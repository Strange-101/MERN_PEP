import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import ConfessionCard from '../components/ConfessionCard';
import ConfessionSkeleton from '../components/ConfessionSkeleton';
import toast from 'react-hot-toast';
import { User, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, checkAuth } = useAuthStore();
  const [identity, setIdentity] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.secretIdentity) setIdentity(user.secretIdentity);
  }, [user]);

  const { data: myConfessions, isLoading } = useQuery({
    queryKey: ['myConfessions'],
    queryFn: async () => {
      const { data } = await api.get('/confessions/me');
      return data;
    }
  });

  const profileMutation = useMutation({
    mutationFn: (newIdentity) => api.put('/auth/profile', { secretIdentity: newIdentity }),
    onSuccess: () => {
      toast.success('Secret Identity updated!');
      checkAuth(); 
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Failed to update identity')
  });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (identity.length < 3) return toast.error('Identity must be at least 3 characters');
    profileMutation.mutate(identity);
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in">
      {/* Animated Back Button */}
      <motion.button 
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors font-bold uppercase tracking-wider text-sm"
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      {/* Profile Settings Card */}
      <div className="minimal-card p-8 mb-10">
        <div className="flex items-center gap-4 mb-6">
          <img src={user?.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-4 border-zinc-900 dark:border-zinc-100 shadow-sm" referrerPolicy="no-referrer" />
          <div>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">YOUR IDENTITY</h2>
            <p className="text-zinc-500 text-sm font-medium">This is how you appear in the comment sections.</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              value={identity} 
              onChange={(e) => setIdentity(e.target.value)}
              placeholder="e.g., PhantomHacker"
              className="minimal-input w-full py-3 pl-12 pr-4 font-bold placeholder:font-normal"
              maxLength={20}
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            disabled={profileMutation.isPending || identity === user?.secretIdentity}
            className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 border-2 border-zinc-900 dark:border-zinc-100 shadow-md"
          >
            <Save size={18} /> {profileMutation.isPending ? 'Saving...' : 'Save'}
          </motion.button>
        </form>
      </div>

      <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-6 border-b-2 border-zinc-200 dark:border-zinc-800 pb-2 tracking-tight uppercase">
        My Confessions
      </h3>
      
      <div className="space-y-6">
        {isLoading && <><ConfessionSkeleton /><ConfessionSkeleton /></>}
        {myConfessions?.length === 0 && (
          <p className="text-center text-zinc-500 font-medium py-10 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            You haven't posted any secrets yet.
          </p>
        )}
        {myConfessions?.map((confession) => (
          <ConfessionCard key={confession._id} confession={confession} />
        ))}
      </div>
    </div>
  );
};

export default Profile;