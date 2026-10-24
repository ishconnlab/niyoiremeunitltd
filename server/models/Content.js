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
      default: true,
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

