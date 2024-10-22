import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the User type
export interface User {
  id: string;
  name: string;
}

// Define the AuthState interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

// Create the auth store
export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user: User, token: string) =>
        set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
