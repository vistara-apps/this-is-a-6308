import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/user';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut, 
  getCurrentUser,
  resetPassword,
  updatePassword,
  updateUserProfile,
  AuthError
} from '../services/auth-service';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetUserPassword: (email: string) => Promise<void>;
  updateUserPassword: (password: string) => Promise<void>;
  updateProfile: (updates: Partial<Omit<User, 'id' | 'email'>>) => Promise<void>;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      try {
        const { user, error } = await getCurrentUser();
        if (error) {
          setError(error);
        } else {
          setUser(user);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError({ message: 'Failed to load user session' });
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, error } = await signInWithEmail(email, password);
      if (error) {
        setError(error);
      } else {
        setUser(user);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError({ message: 'An unexpected error occurred during sign in' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user, error } = await signUpWithEmail(email, password, name);
      if (error) {
        setError(error);
      } else {
        setUser(user);
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError({ message: 'An unexpected error occurred during sign up' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signOut();
      if (error) {
        setError(error);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Sign out error:', err);
      setError({ message: 'An unexpected error occurred during sign out' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetUserPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error);
      }
    } catch (err) {
      console.error('Reset password error:', err);
      setError({ message: 'An unexpected error occurred during password reset' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserPassword = useCallback(async (password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await updatePassword(password);
      if (error) {
        setError(error);
      }
    } catch (err) {
      console.error('Update password error:', err);
      setError({ message: 'An unexpected error occurred while updating password' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Omit<User, 'id' | 'email'>>) => {
    if (!user) {
      setError({ message: 'No user is logged in' });
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { error } = await updateUserProfile(user.id, updates);
      if (error) {
        setError(error);
      } else {
        // Update local user state
        setUser(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setError({ message: 'An unexpected error occurred while updating profile' });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    signIn,
    signUp,
    logout,
    resetUserPassword,
    updateUserPassword,
    updateProfile,
    clearError
  };
}

