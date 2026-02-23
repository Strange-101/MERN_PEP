import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    trim: true,
  },
  confessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Confession',
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // NEW: This enables recursive/nested replies. 
  // Null = top-level comment. ObjectId = reply to another comment.
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  likes: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);