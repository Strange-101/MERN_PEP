import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, CornerDownRight, Send } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

const CommentItem = ({ comment, allComments, confessionId }) => {
  const { isAuthenticated } = useAuthStore();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  const childComments = allComments.filter(c => c.parentId === comment._id);

  const replyMutation = useMutation({
    mutationFn: (data) => api.post(`/confessions/${confessionId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', confessionId] });
      setIsReplying(false);
      setReplyText('');
      toast.success('Reply posted!');
    }
  });

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    replyMutation.mutate({ text: replyText, parentId: comment._id });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4"
    >
      {/* Minimalist Comment Bubble */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">
            {comment.authorId?.secretIdentity || 'Anonymous Coward'}
          </span>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-zinc-700 dark:text-zinc-300 text-sm mb-3 font-medium">{comment.text}</p>
        
        {isAuthenticated && (
          <motion.button 
            whileHover={{ x: 3 }}
            onClick={() => setIsReplying(!isReplying)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-bold uppercase tracking-wider"
          >
            <MessageCircle size={14} /> Reply
          </motion.button>
        )}
      </div>

      {/* Reply Input Box */}
      {isReplying && (
        <motion.form 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleReply} 
          className="mt-3 ml-4 flex gap-2 items-center"
        >
          <CornerDownRight size={20} className="text-zinc-400 dark:text-zinc-600 mb-1" />
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            className="minimal-input flex-1 py-2 px-4 text-sm font-medium"
            autoFocus
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            disabled={replyMutation.isPending}
            className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-50 border-2 border-zinc-900 dark:border-zinc-100"
          >
            Send
          </motion.button>
        </motion.form>
      )}

      {/* RECURSION: Thick border for structured indentation */}
      {childComments.length > 0 && (
        <div className="ml-4 pl-4 border-l-4 border-zinc-200 dark:border-zinc-800 mt-3 space-y-2">
          {childComments.map(child => (
            <CommentItem key={child._id} comment={child} allComments={allComments} confessionId={confessionId} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

const CommentTree = ({ confessionId, comments }) => {
  const { isAuthenticated } = useAuthStore();
  const [newCommentText, setNewCommentText] = useState('');
  const queryClient = useQueryClient();

  const rootComments = comments.filter(c => c.parentId === null);

  const commentMutation = useMutation({
    mutationFn: (data) => api.post(`/confessions/${confessionId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', confessionId] });
      setNewCommentText('');
      toast.success('Comment posted!');
    }
  });

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    commentMutation.mutate({ text: newCommentText, parentId: null });
  };

  return (
    <div className="minimal-card p-6 mt-6 animate-slide-up">
      <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-6 uppercase tracking-tight border-b-2 border-zinc-200 dark:border-zinc-800 pb-2">
        Discussion ({comments.length})
      </h3>
      
      {isAuthenticated ? (
        <form onSubmit={handlePostComment} className="mb-8">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="What are your thoughts?"
            className="minimal-input w-full p-4 resize-none h-24 mb-3 text-sm font-medium"
          />
          <div className="flex justify-end">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              disabled={commentMutation.isPending}
              className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 border-2 border-zinc-900 dark:border-zinc-100 shadow-sm disabled:opacity-50"
            >
              Post Comment <Send size={16} />
            </motion.button>
          </div>
        </form>
      ) : (
        <div className="minimal-input border-dashed p-6 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm mb-8">
          Log in to join the discussion
        </div>
      )}

      <div className="space-y-2">
        {rootComments.length === 0 ? (
          <p className="text-zinc-400 dark:text-zinc-600 text-center py-8 font-medium">No comments yet. Be the first to start the thread!</p>
        ) : (
          rootComments.map(comment => (
            <CommentItem key={comment._id} comment={comment} allComments={comments} confessionId={confessionId} />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentTree;