import { useState } from 'react';
import { useConfessionStore } from '../store/confessionStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';
import { X, Lock, CheckCircle, Trash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SecretCodeModal = () => {
  const { isSecretModalOpen, activeConfessionId, actionType, closeSecretModal } = useConfessionStore();
  const [secretCode, setSecretCode] = useState('');
  const [newText, setNewText] = useState('');
  const queryClient = useQueryClient();

  const closeAndReset = () => {
    setSecretCode('');
    setNewText('');
    closeSecretModal();
  };

  const handleSuccess = (msg) => {
    queryClient.invalidateQueries({ queryKey: ['confessions'] });
    toast.success(msg);
    closeAndReset();
  };

  const handleError = (error) => {
    toast.error(error.response?.data?.message || 'Invalid secret code');
  };

  const editMutation = useMutation({
    mutationFn: (data) => api.put(`/confessions/${activeConfessionId}`, data),
    onSuccess: () => handleSuccess('Confession updated!'),
    onError: handleError
  });

  const deleteMutation = useMutation({
    mutationFn: (data) => api.delete(`/confessions/${activeConfessionId}`, { data }),
    onSuccess: () => handleSuccess('Confession deleted!'),
    onError: handleError
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (actionType === 'edit') {
      if (!newText) return toast.error('New text is required');
      editMutation.mutate({ secretCode, text: newText });
    } else {
      deleteMutation.mutate({ secretCode });
    }
  };

  if (!isSecretModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-zinc-900/40 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
          className="bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 rounded-3xl p-6 w-full max-w-md shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-tight">
              {actionType} Confession
            </h3>
            <motion.button 
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.8 }}
              onClick={closeAndReset} 
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full"
            >
              <X size={20} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit}>
            {actionType === 'edit' && (
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Enter new confession text..."
                className="minimal-input w-full p-4 mb-4 h-28 resize-none font-medium"
              />
            )}
            
            <div className="flex items-center minimal-input px-4 py-3 mb-6 focus-within:ring-2 focus-within:ring-zinc-900 dark:focus-within:ring-zinc-100">
              <Lock size={18} className="text-zinc-400 mr-3" />
              <input
                type="password"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                placeholder="Enter your secret code..."
                className="bg-transparent text-zinc-900 dark:text-zinc-100 font-bold focus:outline-none w-full"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={editMutation.isPending || deleteMutation.isPending}
              className={`w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-colors border-2 ${
                actionType === 'delete' 
                  ? 'bg-red-500 hover:bg-red-600 text-white border-red-600 dark:border-red-400' 
                  : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100'
              }`}
            >
              {actionType === 'delete' ? <Trash size={20} /> : <CheckCircle size={20} />}
              CONFIRM {actionType.toUpperCase()}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SecretCodeModal;