import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Send, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const ConfessionForm = () => {
  const [text, setText] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newConfession) => api.post('/confessions', newConfession),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confessions'] });
      toast.success('Confession posted anonymously!');
      setText('');
      setSecretCode('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to post confession');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.length < 1 || secretCode.length < 4) {
      return toast.error('Confession text and a 4+ char secret code are required.');
    }
    mutation.mutate({ text, secretCode });
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onSubmit={handleSubmit} 
      className="minimal-card p-6 mb-10"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's your secret?"
        className="minimal-input w-full p-4 resize-none h-32 mb-4 text-lg font-medium placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
        maxLength={500}
      />
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center minimal-input px-4 py-3 w-full sm:w-auto focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100">
          <Lock size={18} className="text-zinc-500 dark:text-zinc-400 mr-3" />
          <input
            type="password"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder="Secret Code (min 4 chars)"
            className="bg-transparent text-zinc-900 dark:text-zinc-100 font-bold focus:outline-none text-sm w-full sm:w-48 placeholder:font-normal"
          />
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
          <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
            {text.length}/500
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={mutation.isPending}
            className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-opacity disabled:opacity-50 shadow-md"
          >
            {mutation.isPending ? 'Posting...' : 'Post Anonymously'}
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </motion.form>
  );
};

export default ConfessionForm;