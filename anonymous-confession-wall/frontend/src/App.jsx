import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import { useAuthStore } from './store/authStore';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import ConfessionThread from './pages/ConfessionThread';
import { useThemeStore } from './store/themeStore';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    checkAuth();
    initTheme(); // NEW
  }, [checkAuth, initTheme]);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-white">Loading Auth State...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/confession/:id" element={<ConfessionThread />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" theme="dark" />
      </div>
    </Router>
  );
}

export default App;