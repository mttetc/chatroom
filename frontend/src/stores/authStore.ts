import socket from '@/api/socket';
import { User } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        socket.auth = { token };
        socket.connect();
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        socket.disconnect();
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        user: state.user?.isAnonymous ? null : state.user,
        token: state.user?.isAnonymous ? null : state.token,
        isAuthenticated: state.user?.isAnonymous
          ? false
          : state.isAuthenticated,
      }),
    }
  )
);
