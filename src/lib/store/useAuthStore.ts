import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUser } from '@/lib/api/endpoints';
import { McsrApiError } from '@/lib/api/client';

interface AuthState {
  username: string | null;
  privateKey: string | null;
  privateKeyRevision: number;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (username: string, privateKey?: string) => Promise<void>;
  setPrivateKey: (privateKey: string) => void;
  clearPrivateKey: () => void;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: null,
      privateKey: null,
      privateKeyRevision: 0,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string, privateKey?: string) => {
        set({ isLoading: true, error: null });

        try {
          // Validate username by attempting to fetch user data
          const trimmedUsername = username.trim();

          if (!trimmedUsername) {
            throw new Error('Username cannot be empty');
          }

          // Call API to validate the user exists
          await getUser(trimmedUsername);

          // If successful, set the authenticated state
          set({
            username: trimmedUsername,
            privateKey: privateKey?.trim() || null,
            privateKeyRevision: privateKey?.trim() ? 1 : 0,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          const errorMessage = err instanceof McsrApiError
            ? `Player "${username}" not found. Please check the spelling and try again.`
            : err instanceof Error
            ? err.message
            : 'Failed to validate username. Please try again.';

          set({
            username: null,
            privateKey: null,
            privateKeyRevision: 0,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });

          throw err;
        }
      },

      setPrivateKey: (privateKey: string) => {
        set((state) => ({
          privateKey: privateKey.trim() || null,
          privateKeyRevision: state.privateKeyRevision + 1,
        }));
      },

      clearPrivateKey: () => {
        set((state) => ({
          privateKey: null,
          privateKeyRevision: state.privateKeyRevision + 1,
        }));
      },

      logout: () => {
        set({
          username: null,
          privateKey: null,
          privateKeyRevision: 0,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'mcsr-auth-storage',
      version: 1,
      migrate: (persistedState) => {
        if (persistedState && typeof persistedState === 'object') {
          const state = persistedState as Partial<AuthState>;
          delete state.privateKey;
          state.privateKeyRevision = 0;
          return state;
        }

        return persistedState;
      },
      partialize: (state) => ({
        username: state.username,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
