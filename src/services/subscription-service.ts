import { supabase } from '../lib/supabase';
import { SubscriptionTier } from '../types/user';
import { createCheckoutSession, createCustomerPortalSession } from '../lib/stripe';

export type SubscriptionError = {
  message: string;
  code?: string;
};

export type SubscriptionResponse = {
  success: boolean;
  error: SubscriptionError | null;
};

/**
 * Get user subscription details
 */
export async function getUserSubscription(userId: string): Promise<{
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  error: SubscriptionError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If no subscription record exists, user is on free tier
      if (error.code === 'PGRST116') {
        return {
          tier: 'free',
          error: null,
        };
      }
      return {
        tier: 'free',
        error: { message: error.message, code: error.code },
      };
    }

    return {
      tier: data.tier,
      stripeCustomerId: data.stripe_customer_id,
      stripeSubscriptionId: data.stripe_subscription_id,
      currentPeriodEnd: data.current_period_end,
      error: null,
    };
  } catch (error) {
    console.error('Get user subscription error:', error);
    return {
      tier: 'free',
      error: { message: 'An unexpected error occurred while fetching subscription' },
    };
  }
}

/**
 * Create a checkout session for subscription
 */
export async function createSubscriptionCheckout(
  userId: string,
  tier: SubscriptionTier,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string | null; error: SubscriptionError | null }> {
  try {
    const { sessionId, error } = await createCheckoutSession(
      userId,
      tier,
      successUrl,
      cancelUrl
    );

    if (error) {
      return { sessionId: null, error: { message: error } };
    }

    return { sessionId, error: null };
  } catch (error) {
    console.error('Create subscription checkout error:', error);
    return {
      sessionId: null,
      error: { message: 'An unexpected error occurred while creating checkout' },
    };
  }
}

/**
 * Create a customer portal session for managing subscription
 */
export async function createSubscriptionPortal(
  userId: string,
  returnUrl: string
): Promise<{ url: string | null; error: SubscriptionError | null }> {
  try {
    const { url, error } = await createCustomerPortalSession(userId, returnUrl);

    if (error) {
      return { url: null, error: { message: error } };
    }

    return { url, error: null };
  } catch (error) {
    console.error('Create subscription portal error:', error);
    return {
      url: null,
      error: { message: 'An unexpected error occurred while creating portal' },
    };
  }
}

/**
 * Update user subscription tier
 * This would typically be called by a webhook handler when Stripe events occur
 */
export async function updateSubscriptionTier(
  userId: string,
  tier: SubscriptionTier,
  stripeData?: {
    customerId: string;
    subscriptionId: string;
    currentPeriodEnd: string;
  }
): Promise<SubscriptionResponse> {
  try {
    // First update the user's subscription tier
    const { error: userError } = await supabase
      .from('users')
      .update({ subscription_tier: tier })
      .eq('id', userId);

    if (userError) {
      return { success: false, error: { message: userError.message, code: userError.code } };
    }

    // Then update or create the subscription record
    const subscriptionData = {
      user_id: userId,
      tier,
      ...(stripeData
        ? {
            stripe_customer_id: stripeData.customerId,
            stripe_subscription_id: stripeData.subscriptionId,
            current_period_end: stripeData.currentPeriodEnd,
          }
        : {}),
      updated_at: new Date().toISOString(),
    };

    // Check if subscription record exists
    const { data: existingData, error: checkError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return { success: false, error: { message: checkError.message, code: checkError.code } };
    }

    // Update or insert subscription record
    if (existingData) {
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update(subscriptionData)
        .eq('id', existingData.id);

      if (updateError) {
        return { success: false, error: { message: updateError.message, code: updateError.code } };
      }
    } else {
      const { error: insertError } = await supabase.from('subscriptions').insert(subscriptionData);

      if (insertError) {
        return { success: false, error: { message: insertError.message, code: insertError.code } };
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Update subscription tier error:', error);
    return {
      success: false,
      error: { message: 'An unexpected error occurred while updating subscription' },
    };
  }
}

/**
 * Cancel user subscription
 * This would typically be called when a user cancels their subscription manually
 */
export async function cancelSubscription(userId: string): Promise<SubscriptionResponse> {
  try {
    // In a real implementation, this would call Stripe API to cancel the subscription
    // For demo purposes, we're just updating the database

    // Update user to free tier
    const { error: userError } = await supabase
      .from('users')
      .update({ subscription_tier: 'free' })
      .eq('id', userId);

    if (userError) {
      return { success: false, error: { message: userError.message, code: userError.code } };
    }

    // Update subscription record
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({
        tier: 'free',
        stripe_subscription_id: null,
        current_period_end: null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (subError) {
      return { success: false, error: { message: subError.message, code: subError.code } };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return {
      success: false,
      error: { message: 'An unexpected error occurred while canceling subscription' },
    };
  }
}

