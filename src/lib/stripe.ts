import { loadStripe } from '@stripe/stripe-js';
import { SubscriptionTier } from '../types/user';

// Initialize Stripe with the public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_demo');

// Subscription plan IDs
export const SUBSCRIPTION_PLANS = {
  free: null, // Free tier doesn't have a plan ID
  pro: import.meta.env.VITE_STRIPE_PRO_PLAN_ID || 'price_pro',
  premium: import.meta.env.VITE_STRIPE_PREMIUM_PLAN_ID || 'price_premium',
};

// Subscription plan details
export const PLAN_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Access to basic templates',
      'Limited exports (5 per month)',
      'Basic AI tools',
      'Standard quality exports',
    ],
  },
  pro: {
    name: 'Pro',
    price: 5,
    features: [
      'Access to all templates',
      'Unlimited exports',
      'Advanced AI tools',
      'High quality exports',
      'Remove PixelSpark branding',
    ],
  },
  premium: {
    name: 'Premium',
    price: 15,
    features: [
      'Everything in Pro',
      'Priority support',
      'Custom templates',
      'Team collaboration',
      'API access',
    ],
  },
};

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  tier: SubscriptionTier,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string | null; error: string | null }> {
  if (tier === 'free') {
    return { sessionId: null, error: 'Cannot create checkout session for free tier' };
  }

  const planId = SUBSCRIPTION_PLANS[tier];
  if (!planId) {
    return { sessionId: null, error: 'Invalid subscription tier' };
  }

  try {
    // In a real implementation, this would be a server-side API call
    // For demo purposes, we're simulating the response
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        planId,
        successUrl,
        cancelUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { sessionId: null, error: errorData.message || 'Failed to create checkout session' };
    }

    const data = await response.json();
    return { sessionId: data.sessionId, error: null };
  } catch (error) {
    console.error('Create checkout session error:', error);
    return { sessionId: null, error: 'An unexpected error occurred' };
  }
}

/**
 * Redirect to Stripe checkout
 */
export async function redirectToCheckout(
  sessionId: string
): Promise<{ error: string | null }> {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      return { error: 'Failed to load Stripe' };
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      return { error: error.message || 'Failed to redirect to checkout' };
    }

    return { error: null };
  } catch (error) {
    console.error('Redirect to checkout error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

/**
 * Create a customer portal session for managing subscription
 */
export async function createCustomerPortalSession(
  userId: string,
  returnUrl: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    // In a real implementation, this would be a server-side API call
    // For demo purposes, we're simulating the response
    const response = await fetch('/api/create-customer-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        returnUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { url: null, error: errorData.message || 'Failed to create customer portal session' };
    }

    const data = await response.json();
    return { url: data.url, error: null };
  } catch (error) {
    console.error('Create customer portal session error:', error);
    return { url: null, error: 'An unexpected error occurred' };
  }
}

