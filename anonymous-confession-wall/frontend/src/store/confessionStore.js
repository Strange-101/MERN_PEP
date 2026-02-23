import { create } from 'zustand';

export const useConfessionStore = create((set) => ({
  isSecretModalOpen: false,
  activeConfessionId: null,
  actionType: null, // 'edit' or 'delete'
  
  openSecretModal: (id, type) => set({ 
    isSecretModalOpen: true, 
    activeConfessionId: id, 
    actionType: type 
  }),
  
  closeSecretModal: () => set({ 
    isSecretModalOpen: false, 
    activeConfessionId: null, 
    actionType: null 
  }),
}));