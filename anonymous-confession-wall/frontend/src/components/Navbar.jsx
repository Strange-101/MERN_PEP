import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { LogOut, UserCircle, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  return (
    <nav className="sticky top-4 z-50 flex items-center justify-between px-6 py-4 mx-4 mb-8 minimal-card shadow-md">
      <Link to="/" className="text-xl font-extrabold tracking-tight">
        AnonAF.
      </Link>

      <div className="flex items-center gap-4">
        <motion.button 
          whileTap={{ scale: 0.8, rotate: 90 }}
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="hover:opacity-80 transition-opacity">
              <img src={user?.avatar} alt="Avatar" className="w-9 h-9 rounded-full border-2 border-zinc-900 dark:border-zinc-100" referrerPolicy="no-referrer" />
            </Link>
            <motion.button whileTap={{ scale: 0.9 }} onClick={logout} className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              <LogOut size={20} />
            </motion.button>
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin} 
            className="flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-xl font-bold transition-colors"
          >
            <UserCircle size={20} />
            Login
          </motion.button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;