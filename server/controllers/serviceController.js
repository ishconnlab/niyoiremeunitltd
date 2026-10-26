import asyncHandler from 'express-async-handler';
import Service from '../models/Service.js';

export const getServices = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit, 10) || 100));
  const filter = { status: 'published', isActive: true };
  const [items, total] = await Promise.all([
    Service.find(filter).sort({ order: 1, title: 1 }).skip((page - 1) * limit).limit(limit).lean(),
    Service.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, page, limit, total, pages: Math.ceil(total / limit) });
});

export const getService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, status: 'published', isActive: true }).lean();
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.json({ success: true, data: service });
});

export const getAdminServices = asyncHandler(async (req, res) => {
  const items = await Service.find().sort({ order: 1, updatedAt: -1 }).lean();
  res.json({ success: true, data: items });
});

export const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json({ success: true, data: service });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  const previousSlug = service.slug;
  service.set(req.body);
  await service.save();
  if (service.slug !== previousSlug) {
    await Service.updateMany({ _id: { $ne: service._id }, relatedServices: previousSlug }, { $addToSet: { relatedServices: service.slug } });
    await Service.updateMany({ _id: { $ne: service._id }, relatedServices: previousSlug }, { $pull: { relatedServices: previousSlug } });
  }
  res.json({ success: true, data: service });
});

export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  await Service.updateMany({ _id: { $ne: service._id }, relatedServices: service.slug }, { $pull: { relatedServices: service.slug } });
  await service.deleteOne();
  res.json({ success: true, data: {} });
});
