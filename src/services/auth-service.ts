import { supabase } from '../lib/supabase';
import { User } from '../types/user';

export type AuthError = {
  message: string;
  code?: string;
};

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: { message: error.message, code: error.code } };
    }

    if (!data.user) {
      return { user: null, error: { message: 'User not found' } };
    }

    // Get user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return { user: null, error: { message: profileError.message, code: profileError.code } };
    }

    return { user: profileData as User, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: { message: 'An unexpected error occurred during sign in' } };
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, error: { message: error.message, code: error.code } };
    }

    if (!data.user) {
      return { user: null, error: { message: 'Failed to create user' } };
    }

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email,
        name,
        subscription_tier: 'free',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      return { user: null, error: { message: profileError.message, code: profileError.code } };
    }

    return { user: profileData as User, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: { message: 'An unexpected error occurred during sign up' } };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: { message: error.message, code: error.code } };
    }

    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: { message: 'An unexpected error occurred during sign out' } };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      return { user: null, error: { message: authError.message, code: authError.code } };
    }

    if (!authData.user) {
      return { user: null, error: null }; // No error, just no user
    }

    // Get user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      return { user: null, error: { message: profileError.message, code: profileError.code } };
    }

    return { user: profileData as User, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error: { message: 'An unexpected error occurred while fetching user' } };
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { error: { message: error.message, code: error.code } };
    }

    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error: { message: 'An unexpected error occurred during password reset' } };
  }
}

/**
 * Update password
 */
export async function updatePassword(password: string): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { error: { message: error.message, code: error.code } };
    }

    return { error: null };
  } catch (error) {
    console.error('Update password error:', error);
    return { error: { message: 'An unexpected error occurred while updating password' } };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<User, 'id' | 'email'>>
): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      return { error: { message: error.message, code: error.code } };
    }

    return { error: null };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { error: { message: 'An unexpected error occurred while updating profile' } };
  }
}

