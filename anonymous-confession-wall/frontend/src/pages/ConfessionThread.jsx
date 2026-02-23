import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ConfessionCard from '../components/ConfessionCard';
import CommentTree from '../components/CommentTree';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ConfessionThread = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: confession, isLoading: isLoadingPost } = useQuery({
    queryKey: ['confession', id],
    queryFn: async () => {
      const { data } = await api.get(`/confessions/${id}`);
      return data;
    }
  });

  const { data: comments, isLoading: isLoadingComments } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const { data } = await api.get(`/confessions/${id}/comments`);
      return data;
    }
  });

  if (isLoadingPost) return <div className="text-center text-zinc-500 font-bold py-20 uppercase tracking-widest animate-pulse">Loading thread...</div>;
  if (!confession) return <div className="text-center text-red-500 font-bold py-20 uppercase tracking-widest">Confession not found.</div>;

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      <motion.button 
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors font-bold uppercase tracking-wider text-sm"
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      <ConfessionCard confession={confession} isThreadView={true} />
      
      {isLoadingComments ? (
        <div className="text-center text-zinc-400 dark:text-zinc-600 font-medium mt-12 animate-pulse">Loading discussion...</div>
      ) : (
        <CommentTree confessionId={id} comments={comments || []} />
      )}
    </div>
  );
};

export default ConfessionThread;