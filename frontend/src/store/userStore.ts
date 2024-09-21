import { create } from 'zustand';

interface UserState {
  user: { id: number; name: string } | null;
  setUser: (user: { id: number; name: string } | null) => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  setUser: user => set({ user }),
}));
