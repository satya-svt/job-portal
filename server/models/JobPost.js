import mongoose from 'mongoose';

const jobPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  budget: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    required: true
  },
  location: {
    type: String,
    default: 'Remote'
  },
  company: {
    type: String,
    required: true
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'executive'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  deadline: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better search performance
jobPostSchema.index({ title: 'text', description: 'text', tags: 'text' });
jobPostSchema.index({ requiredSkills: 1 });
jobPostSchema.index({ location: 1 });
jobPostSchema.index({ jobType: 1 });

export default mongoose.model('JobPost', jobPostSchema);