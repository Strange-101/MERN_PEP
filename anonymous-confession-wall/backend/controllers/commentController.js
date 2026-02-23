import Comment from '../models/Comment.js';
import Confession from '../models/Confession.js';

// @desc    Add a comment (or reply)
// @route   POST /api/confessions/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text, parentId } = req.body;
    const confessionId = req.params.id;

    // Create the comment
    const comment = await Comment.create({
      text,
      confessionId,
      authorId: req.user._id,
      parentId: parentId || null, // If null, it's a top-level comment
    });

    // Increment the comment count on the parent confession
    await Confession.findByIdAndUpdate(confessionId, { $inc: { commentCount: 1 } });

    // Populate the author's identity to return to the frontend
    await comment.populate('authorId', 'secretIdentity avatar');

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all comments for a confession
// @route   GET /api/confessions/:id/comments
// @access  Public
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ confessionId: req.params.id })
      .populate('authorId', 'secretIdentity avatar')
      .sort({ createdAt: 1 }); // Oldest first, standard for threaded views
      
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};