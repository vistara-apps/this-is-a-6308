import { useState, useCallback } from 'react';
import { SubscriptionTier } from '../types/user';
import {
  generateShareableLink,
  shareToSocialMedia,
  SharePlatform,
  ShareOptions,
  ShareError
} from '../services/share-service';

interface UseShareReturn {
  isSharing: boolean;
  shareUrl: string | null;
  error: ShareError | null;
  generateLink: (
    userId: string,
    projectId: string,
    imageBlob: Blob,
    options: ShareOptions,
    userTier: SubscriptionTier
  ) => Promise<string | null>;
  shareToSocial: (
    platform: SharePlatform,
    url: string,
    title: string,
    imageUrl?: string
  ) => string | null;
  clearShare: () => void;
}

export function useShare(): UseShareReturn {
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [error, setError] = useState<ShareError | null>(null);

  const generateLink = useCallback(
    async (
      userId: string,
      projectId: string,
      imageBlob: Blob,
      options: ShareOptions,
      userTier: SubscriptionTier = 'free'
    ): Promise<string | null> => {
      setIsSharing(true);
      setError(null);
      
      try {
        const { shareUrl, error } = await generateShareableLink(
          userId,
          projectId,
          imageBlob,
          options,
          userTier
        );
        
        if (error) {
          setError(error);
          return null;
        }
        
        setShareUrl(shareUrl);
        return shareUrl;
      } catch (err) {
        console.error('Generate link error:', err);
        setError({ message: 'An unexpected error occurred while generating link' });
        return null;
      } finally {
        setIsSharing(false);
      }
    },
    []
  );

  const shareToSocial = useCallback(
    (platform: SharePlatform, url: string, title: string, imageUrl?: string): string | null => {
      setError(null);
      
      try {
        const { shareUrl, error } = shareToSocialMedia(platform, url, title, imageUrl);
        
        if (error) {
          setError(error);
          return null;
        }
        
        return shareUrl;
      } catch (err) {
        console.error('Share to social error:', err);
        setError({ message: 'An unexpected error occurred while sharing' });
        return null;
      }
    },
    []
  );

  const clearShare = useCallback(() => {
    setShareUrl(null);
    setError(null);
  }, []);

  return {
    isSharing,
    shareUrl,
    error,
    generateLink,
    shareToSocial,
    clearShare
  };
}

