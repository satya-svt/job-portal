import mongoose from 'mongoose';

const userPostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postType: {
    type: String,
    enum: ['update', 'achievement', 'article', 'question', 'celebration'],
    default: 'update'
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better performance
userPostSchema.index({ author: 1 });
userPostSchema.index({ createdAt: -1 });

export default mongoose.model('UserPost', userPostSchema);