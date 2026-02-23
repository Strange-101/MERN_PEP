import { create } from 'zustand';

export const useThemeStore = create((set) => ({
  isDarkMode: true, // Defaulting to dark mode
  toggleTheme: () => set((state) => {
    const newMode = !state.isDarkMode;
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { isDarkMode: newMode };
  }),
  initTheme: () => {
    document.documentElement.classList.add('dark'); // Initialize app in dark mode
  }
}));