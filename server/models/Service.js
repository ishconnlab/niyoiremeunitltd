import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true, trim: true, maxlength: 2048 },
  alt: { type: String, required: true, trim: true, maxlength: 240 },
}, { _id: false });

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true, maxlength: 240 },
  answer: { type: String, required: true, trim: true, maxlength: 3000 },
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  overview: { type: String, required: true, trim: true, maxlength: 600 },
  description: { type: String, required: true, trim: true, maxlength: 8000 },
  problems: { type: [String], default: [] },
  includedWork: { type: [String], default: [] },
  materials: { type: [String], default: [] },
  workflow: { type: [String], default: [] },
  deliverables: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  costFactors: { type: [String], default: [] },
  customization: { type: [String], default: [] },
  faqs: { type: [faqSchema], default: [] },
  relatedServices: { type: [String], default: [] },
  mainImage: { type: String, trim: true, maxlength: 2048, default: '' },
  gallery: {
    type: [galleryImageSchema],
    default: [],
    validate: [
      { validator: (images) => images.length <= 10, message: 'A service can have at most 10 gallery images.' },
      { validator: function validatePublishedGallery(images) { return this.status !== 'published' || images.length >= 3; }, message: 'Published services need at least three gallery images.' },
    ],
  },
  seoTitle: { type: String, trim: true, maxlength: 70, default: '' },
  seoDescription: { type: String, trim: true, maxlength: 180, default: '' },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  isActive: { type: Boolean, default: true, index: true },
  showOnHomePage: { type: Boolean, default: false },
  order: { type: Number, default: 0, index: true },
}, { timestamps: true, strict: 'throw' });

serviceSchema.index({ status: 1, isActive: 1, order: 1 });

export default mongoose.model('Service', serviceSchema);
