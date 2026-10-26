import mongoose from 'mongoose';

const blogImageSchema = new mongoose.Schema({
  url: { type: String, required: true, trim: true, maxlength: 2048 },
  alt: { type: String, trim: true, maxlength: 240, default: '' },
}, { _id: false });

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
  excerpt: { type: String, required: true, trim: true, maxlength: 500 },
  body: { type: String, required: true, trim: true, maxlength: 50000 },
  featuredImage: { type: blogImageSchema, default: undefined },
  images: {
    type: [blogImageSchema],
    default: [],
    validate: { validator: (images) => images.length <= 5, message: 'A blog post can have at most five images.' },
  },
  youtubeVideoId: { type: String, trim: true, validate: { validator: (value) => !value || /^[A-Za-z0-9_-]{11}$/.test(value), message: 'YouTube video ID must contain 11 valid characters.' }, default: '' },
  categories: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  author: { type: String, trim: true, maxlength: 120, default: 'NIYO IREME UNIT LTD' },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  publishedAt: { type: Date, default: null, index: true },
  seoTitle: { type: String, trim: true, maxlength: 70, default: '' },
  seoDescription: { type: String, trim: true, maxlength: 180, default: '' },
}, { timestamps: true, strict: 'throw' });

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ slug: 1, status: 1 });

blogPostSchema.pre('validate', function setPublicationDate() {
  if (this.status === 'published' && !this.publishedAt) this.publishedAt = new Date();
  if (this.status === 'draft') this.publishedAt = null;
  const imageUrls = new Set([...(this.featuredImage?.url ? [this.featuredImage.url] : []), ...this.images.map((image) => image.url)]);
  if (imageUrls.size > 5) this.invalidate('images', 'A blog post can have at most five images in total.');
});

export default mongoose.model('BlogPost', blogPostSchema);
