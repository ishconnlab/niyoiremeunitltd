import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
      default: 'Kigali, Rwanda',
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance'],
      default: 'full-time',
    },
    category: {
      type: String,
      enum: [
        'construction',
        'finishing',
        'painting',
        'tiling',
        'ceiling',
        'glass',
        'cleaning',
        'supervision',
        'equipment',
        'materials',
        'workforce',
        'other',
      ],
      default: 'other',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicationEmail: {
      type: String,
      default: '',
    },
    applicationUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Job', jobSchema);
