import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ThumbsUp, Heart, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

const ReactionButtons = ({ confessionId, reactions }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (type) => api.post(`/confessions/${confessionId}/react`, { type }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['confessions'] })
  });

  const ReactionBtn = ({ icon: Icon, count, type }) => (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.8, rotate: type === 'laugh' ? 15 : -15 }}
      onClick={() => mutation.mutate(type)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-bold transition-colors"
    >
      <Icon size={18} className="text-zinc-600 dark:text-zinc-400" />
      <span>{count}</span>
    </motion.button>
  );

  return (
    <div className="flex gap-1">
      <ReactionBtn icon={ThumbsUp} count={reactions?.like || 0} type="like" />
      <ReactionBtn icon={Heart} count={reactions?.love || 0} type="love" />
      <ReactionBtn icon={Smile} count={reactions?.laugh || 0} type="laugh" />
    </div>
  );
};

export default ReactionButtons;