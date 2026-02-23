import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ConfessionForm from '../components/ConfessionForm';
import ConfessionCard from '../components/ConfessionCard';
import ConfessionSkeleton from '../components/ConfessionSkeleton';
import SecretCodeModal from '../components/SecretCodeModal';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  const { data: confessions, isLoading: confessionsLoading } = useQuery({
    queryKey: ['confessions'],
    queryFn: async () => {
      const { data } = await api.get('/confessions');
      return data;
    },
    // CRITICAL: Only fetch the confessions from the backend IF the user is logged in
    enabled: isAuthenticated, 
  });

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  // 1. Loading State
  if (authLoading) return null;

  // 2. The Gate (Unauthenticated View)
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
          className="max-w-2xl minimal-card p-10 md:p-16 border-4 border-zinc-900 dark:border-zinc-100"
        >
          <Lock size={48} className="mx-auto mb-6 text-zinc-900 dark:text-zinc-50" />
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight uppercase text-zinc-900 dark:text-zinc-50">
            Unlock the Wall
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium mb-10">
            You must be logged in to read, react, or confess. Your true identity will always remain hidden from the public.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin} 
            className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-8 py-4 rounded-xl font-black text-sm md:text-base tracking-widest uppercase border-2 border-zinc-900 dark:border-zinc-100 shadow-lg mx-auto flex items-center justify-center w-full sm:w-auto"
          >
            Authenticate with Google
          </motion.button>
        </motion.div>
      </div>
    );
  }


  // 3. The Feed (Authenticated View)
  return (
    <div className="max-w-3xl mx-auto pb-12">
      <ConfessionForm />
      
      <div className="space-y-6">
        {confessionsLoading && (
          <>
            <ConfessionSkeleton />
            <ConfessionSkeleton />
          </>
        )}
        
        {confessions?.length === 0 && (
          <div className="minimal-input border-dashed p-10 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm">
            No secrets here yet. Be the first.
          </div>
        )}
        
        {confessions?.map((confession) => (
          <ConfessionCard key={confession._id} confession={confession} />
        ))}
      </div>

      <SecretCodeModal />
    </div>
  );
};

export default Home;