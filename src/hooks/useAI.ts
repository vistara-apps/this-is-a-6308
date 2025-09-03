import { useState, useCallback } from 'react';
import { SubscriptionTier } from '../types/user';
import {
  removeBackground,
  generateDesignSuggestions,
  AIError
} from '../services/ai-service';

interface UseAIReturn {
  isProcessing: boolean;
  error: AIError | null;
  processedImageUrl: string | null;
  suggestions: string[] | null;
  removeImageBackground: (imageUrl: string, userTier: SubscriptionTier) => Promise<string | null>;
  getDesignSuggestions: (prompt: string, userTier: SubscriptionTier) => Promise<string[] | null>;
  clearError: () => void;
}

export function useAI(): UseAIReturn {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<AIError | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);

  const removeImageBackground = useCallback(
    async (imageUrl: string, userTier: SubscriptionTier = 'free'): Promise<string | null> => {
      setIsProcessing(true);
      setError(null);
      setProcessedImageUrl(null);
      
      try {
        const { data, error } = await removeBackground(imageUrl, userTier);
        
        if (error) {
          setError(error);
          return null;
        }
        
        setProcessedImageUrl(data);
        return data;
      } catch (err) {
        console.error('Remove background error:', err);
        setError({ message: 'An unexpected error occurred while processing the image' });
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const getDesignSuggestions = useCallback(
    async (prompt: string, userTier: SubscriptionTier = 'free'): Promise<string[] | null> => {
      setIsProcessing(true);
      setError(null);
      setSuggestions(null);
      
      try {
        const { data, error } = await generateDesignSuggestions(prompt, userTier);
        
        if (error) {
          setError(error);
          return null;
        }
        
        setSuggestions(data);
        return data;
      } catch (err) {
        console.error('Design suggestions error:', err);
        setError({ message: 'An unexpected error occurred while generating suggestions' });
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isProcessing,
    error,
    processedImageUrl,
    suggestions,
    removeImageBackground,
    getDesignSuggestions,
    clearError
  };
}

