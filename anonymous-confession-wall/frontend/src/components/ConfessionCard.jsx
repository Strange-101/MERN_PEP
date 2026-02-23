import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Edit2, Trash2, Link2, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactionButtons from './ReactionButtons';
import { useConfessionStore } from '../store/confessionStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ConfessionCard = ({ confession }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { openSecretModal } = useConfessionStore();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/confession/${confession._id}`);
    toast.success('Link copied!');
    setShowMenu(false);
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="minimal-card p-6 mb-6 relative group animate-fade-in"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-zinc-500 font-medium text-xs uppercase tracking-wider">
          {formatDistanceToNow(new Date(confession.createdAt), { addSuffix: true })}
        </p>
        
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            <MoreVertical size={18} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-36 minimal-card z-10 overflow-hidden py-1">
              <button onClick={handleCopyLink} className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2">
                <Link2 size={14} /> Copy Link
              </button>
              <button onClick={() => { setShowMenu(false); openSecretModal(confession._id, 'edit'); }} className="w-full text-left px-4 py-2 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2">
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => { setShowMenu(false); openSecretModal(confession._id, 'delete'); }} className="w-full text-left px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950 flex items-center gap-2">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-lg mb-6 leading-relaxed whitespace-pre-wrap font-medium">
        {confession.text}
      </p>

      <div className="border-t-2 border-zinc-100 dark:border-zinc-800 pt-4 mt-auto flex justify-between items-center">
        <ReactionButtons confessionId={confession._id} reactions={confession.reactions} />
        
        <Link 
          to={`/confession/${confession._id}`} 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 text-sm font-bold transition-colors"
        >
          <MessageSquare size={18} className="text-zinc-600 dark:text-zinc-400" />
          <span>{confession.commentCount || 0}</span>
        </Link>
      </div>
    </motion.div>
  );
};

export default ConfessionCard;