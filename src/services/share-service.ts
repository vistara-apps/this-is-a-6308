import { supabase } from '../lib/supabase';
import { SubscriptionTier } from '../types/user';

export type SharePlatform = 'link' | 'twitter' | 'facebook' | 'linkedin' | 'pinterest';

export type ShareOptions = {
  title: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
};

export type ShareError = {
  message: string;
  code?: string;
};

export type ShareResponse = {
  shareUrl: string | null;
  error: ShareError | null;
};

/**
 * Generate a shareable link for a project
 */
export async function generateShareableLink(
  userId: string,
  projectId: string,
  imageBlob: Blob,
  options: ShareOptions,
  userTier: SubscriptionTier = 'free'
): Promise<ShareResponse> {
  try {
    // Upload the preview image to storage
    const fileName = `shares/${userId}/${projectId}/${Date.now()}.png`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('public')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: true,
      });
    
    if (uploadError) {
      return { shareUrl: null, error: { message: uploadError.message } };
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage.from('public').getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;
    
    // Create a share record
    const { data, error } = await supabase
      .from('shares')
      .insert({
        user_id: userId,
        project_id: projectId,
        title: options.title,
        description: options.description || '',
        image_url: imageUrl,
        is_public: options.isPublic !== undefined ? options.isPublic : true,
        tags: options.tags || [],
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    
    if (error) {
      return { shareUrl: null, error: { message: error.message, code: error.code } };
    }
    
    // Generate the share URL
    const shareUrl = `${window.location.origin}/share/${data.id}`;
    
    return { shareUrl, error: null };
  } catch (error) {
    console.error('Generate shareable link error:', error);
    return {
      shareUrl: null,
      error: { message: 'Failed to generate shareable link' },
    };
  }
}

/**
 * Share to social media
 */
export function shareToSocialMedia(
  platform: SharePlatform,
  url: string,
  title: string,
  imageUrl?: string
): ShareResponse {
  try {
    let shareUrl: string;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'pinterest':
        if (!imageUrl) {
          return { shareUrl: null, error: { message: 'Image URL is required for Pinterest sharing' } };
        }
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(title)}`;
        break;
      default:
        // Just return the URL for direct link sharing
        return { shareUrl: url, error: null };
    }
    
    // Open in a new window
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    return { shareUrl, error: null };
  } catch (error) {
    console.error('Share to social media error:', error);
    return {
      shareUrl: null,
      error: { message: 'Failed to share to social media' },
    };
  }
}

/**
 * Get a shared project by ID
 */
export async function getSharedProject(shareId: string): Promise<{
  share: any | null;
  error: ShareError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('shares')
      .select(`
        *,
        projects:project_id (
          name,
          template_id,
          design_data
        ),
        users:user_id (
          name
        )
      `)
      .eq('id', shareId)
      .single();
    
    if (error) {
      return { share: null, error: { message: error.message, code: error.code } };
    }
    
    return { share: data, error: null };
  } catch (error) {
    console.error('Get shared project error:', error);
    return {
      share: null,
      error: { message: 'Failed to get shared project' },
    };
  }
}

