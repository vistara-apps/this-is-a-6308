export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface User {
  id: string;
  email: string;
  name: string;
  subscription_tier: SubscriptionTier;
  created_at: string;
  updated_at: string;
}

