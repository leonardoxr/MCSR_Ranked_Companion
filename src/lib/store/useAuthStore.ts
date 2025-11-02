import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getUser } from '@/lib/api/endpoints';
import { McsrApiError } from '@/lib/api/client';

interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (username: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username: string) => {
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
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });

          throw err;
        }
      },

      logout: () => {
        set({
          username: null,
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
      partialize: (state) => ({
        username: state.username,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
