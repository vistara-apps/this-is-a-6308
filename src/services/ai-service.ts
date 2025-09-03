import { removeBackground as openaiRemoveBackground, generateDesignSuggestions as openaiGenerateDesignSuggestions } from '../lib/openai';
import { SubscriptionTier } from '../types/user';

export type AIError = {
  message: string;
  code?: string;
};

export type AIResponse<T> = {
  data: T | null;
  error: AIError | null;
};

// Usage limits by subscription tier
const USAGE_LIMITS = {
  free: {
    backgroundRemoval: 5, // 5 per month
    designSuggestions: 10, // 10 per month
  },
  pro: {
    backgroundRemoval: 50, // 50 per month
    designSuggestions: 100, // 100 per month
  },
  premium: {
    backgroundRemoval: -1, // unlimited
    designSuggestions: -1, // unlimited
  },
};

/**
 * Remove background from an image
 */
export async function removeBackground(
  imageUrl: string,
  userTier: SubscriptionTier = 'free'
): Promise<AIResponse<string>> {
  try {
    // Check usage limits (in a real app, this would query a usage database)
    // For demo purposes, we'll just allow it
    const canUseFeature = checkUsageLimit(userTier, 'backgroundRemoval');
    if (!canUseFeature) {
      return {
        data: null,
        error: {
          message: 'You have reached your monthly limit for background removal. Please upgrade your plan.',
          code: 'USAGE_LIMIT_EXCEEDED',
        },
      };
    }

    // Process the image
    const processedImageUrl = await openaiRemoveBackground(imageUrl);
    
    // Track usage (in a real app, this would update a usage database)
    trackUsage(userTier, 'backgroundRemoval');
    
    return { data: processedImageUrl, error: null };
  } catch (error) {
    console.error('Background removal error:', error);
    return {
      data: null,
      error: { message: 'Failed to remove background from image' },
    };
  }
}

/**
 * Generate design suggestions based on a prompt
 */
export async function generateDesignSuggestions(
  prompt: string,
  userTier: SubscriptionTier = 'free'
): Promise<AIResponse<string[]>> {
  try {
    // Check usage limits
    const canUseFeature = checkUsageLimit(userTier, 'designSuggestions');
    if (!canUseFeature) {
      return {
        data: null,
        error: {
          message: 'You have reached your monthly limit for design suggestions. Please upgrade your plan.',
          code: 'USAGE_LIMIT_EXCEEDED',
        },
      };
    }

    // Generate suggestions
    const suggestions = await openaiGenerateDesignSuggestions(prompt);
    
    // Track usage
    trackUsage(userTier, 'designSuggestions');
    
    return { data: suggestions, error: null };
  } catch (error) {
    console.error('Design suggestions error:', error);
    return {
      data: null,
      error: { message: 'Failed to generate design suggestions' },
    };
  }
}

/**
 * Check if user has reached usage limit for a feature
 * In a real app, this would query a usage database
 */
function checkUsageLimit(userTier: SubscriptionTier, feature: keyof typeof USAGE_LIMITS.free): boolean {
  const limit = USAGE_LIMITS[userTier][feature];
  
  // -1 means unlimited
  if (limit === -1) {
    return true;
  }
  
  // For demo purposes, we'll just return true
  // In a real app, this would check against actual usage
  return true;
}

/**
 * Track usage of AI features
 * In a real app, this would update a usage database
 */
function trackUsage(userTier: SubscriptionTier, feature: keyof typeof USAGE_LIMITS.free): void {
  // For demo purposes, we'll just log it
  console.log(`Tracked usage of ${feature} for ${userTier} tier`);
  
  // In a real app, this would increment a usage counter in the database
}

