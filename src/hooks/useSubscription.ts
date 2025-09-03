import { useState, useEffect, useCallback } from 'react';
import { SubscriptionTier } from '../types/user';
import {
  getUserSubscription,
  createSubscriptionCheckout,
  createSubscriptionPortal,
  cancelSubscription,
  SubscriptionError
} from '../services/subscription-service';
import { PLAN_DETAILS } from '../lib/stripe';

interface UseSubscriptionReturn {
  tier: SubscriptionTier;
  planDetails: typeof PLAN_DETAILS.free;
  isLoading: boolean;
  error: SubscriptionError | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  fetchSubscription: (userId: string) => Promise<void>;
  createCheckout: (userId: string, tier: SubscriptionTier) => Promise<string | null>;
  openCustomerPortal: (userId: string) => Promise<string | null>;
  cancelUserSubscription: (userId: string) => Promise<boolean>;
  clearError: () => void;
}

export function useSubscription(): UseSubscriptionReturn {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [stripeCustomerId, setStripeCustomerId] = useState<string | undefined>(undefined);
  const [stripeSubscriptionId, setStripeSubscriptionId] = useState<string | undefined>(undefined);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<SubscriptionError | null>(null);

  const fetchSubscription = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { tier: userTier, stripeCustomerId, stripeSubscriptionId, currentPeriodEnd, error } = 
        await getUserSubscription(userId);
      
      if (error) {
        setError(error);
      } else {
        setTier(userTier);
        setStripeCustomerId(stripeCustomerId);
        setStripeSubscriptionId(stripeSubscriptionId);
        setCurrentPeriodEnd(currentPeriodEnd);
      }
    } catch (err) {
      console.error('Fetch subscription error:', err);
      setError({ message: 'An unexpected error occurred while fetching subscription' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCheckout = useCallback(async (userId: string, tier: SubscriptionTier): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const successUrl = `${window.location.origin}/subscription/success?tier=${tier}`;
      const cancelUrl = `${window.location.origin}/subscription/cancel`;
      
      const { sessionId, error } = await createSubscriptionCheckout(
        userId,
        tier,
        successUrl,
        cancelUrl
      );
      
      if (error) {
        setError(error);
        return null;
      }
      
      return sessionId;
    } catch (err) {
      console.error('Create checkout error:', err);
      setError({ message: 'An unexpected error occurred while creating checkout' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openCustomerPortal = useCallback(async (userId: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const returnUrl = `${window.location.origin}/account`;
      
      const { url, error } = await createSubscriptionPortal(userId, returnUrl);
      
      if (error) {
        setError(error);
        return null;
      }
      
      return url;
    } catch (err) {
      console.error('Open customer portal error:', err);
      setError({ message: 'An unexpected error occurred while opening customer portal' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelUserSubscription = useCallback(async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const { success, error } = await cancelSubscription(userId);
      
      if (error) {
        setError(error);
        return false;
      }
      
      if (success) {
        setTier('free');
        setStripeSubscriptionId(undefined);
        setCurrentPeriodEnd(undefined);
      }
      
      return success;
    } catch (err) {
      console.error('Cancel subscription error:', err);
      setError({ message: 'An unexpected error occurred while canceling subscription' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get plan details based on current tier
  const planDetails = PLAN_DETAILS[tier];

  return {
    tier,
    planDetails,
    isLoading,
    error,
    stripeCustomerId,
    stripeSubscriptionId,
    currentPeriodEnd,
    fetchSubscription,
    createCheckout,
    openCustomerPortal,
    cancelUserSubscription,
    clearError
  };
}

