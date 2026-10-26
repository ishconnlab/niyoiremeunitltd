const PAGE_SIZES = new Set([10, 25, 50]);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const adminListQuery = (req, { fields, filter = {} }) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const requestedLimit = Number.parseInt(req.query.limit, 10) || 10;
  const limit = PAGE_SIZES.has(requestedLimit) ? requestedLimit : 10;
  const search = String(req.query.search || '').trim().slice(0, 100);
  const query = { ...filter };
  if (search) {
    const expression = new RegExp(escapeRegex(search), 'i');
    query.$or = fields.map((field) => ({ [field]: expression }));
  }
  return { query, page, limit };
};

export const adminListResponse = (items, total, page, limit) => ({
  success: true,
  data: items,
  count: items.length,
  total,
  page,
  limit,
  pages: Math.max(1, Math.ceil(total / limit)),
});
