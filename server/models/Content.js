import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: [true, 'Please add a section'],
      enum: [
        'services',
        'equipment',
        'workforce',
        'hero',
        'about',
        'contact',
        'footer',
        'gallery',
        'faq',
        'home',
        'benefits',
        'company',
        'social',
        'quote',
        'privacy',
        'team',
        'blog',
        'seo',
      ],
    },
    key: {
      type: String,
      required: [true, 'Please add a key'],
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please add a value'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      // New website content stays unpublished until an administrator approves it.
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Content', contentSchema);

