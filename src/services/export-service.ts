import html2canvas from 'html2canvas';
import { SubscriptionTier } from '../types/user';

export type ExportFormat = 'png' | 'jpg' | 'svg';

export type ExportQuality = 'low' | 'medium' | 'high';

export type ExportOptions = {
  format: ExportFormat;
  quality: ExportQuality;
  fileName?: string;
  width?: number;
  height?: number;
};

export type ExportError = {
  message: string;
  code?: string;
};

export type ExportResponse = {
  url: string | null;
  blob: Blob | null;
  error: ExportError | null;
};

// Quality settings by subscription tier
const QUALITY_SETTINGS = {
  free: {
    scale: 1,
    maxWidth: 1200,
    maxHeight: 1200,
  },
  pro: {
    scale: 2,
    maxWidth: 2400,
    maxHeight: 2400,
  },
  premium: {
    scale: 3,
    maxWidth: 3600,
    maxHeight: 3600,
  },
};

// Quality multipliers
const QUALITY_MULTIPLIERS = {
  low: 0.6,
  medium: 0.8,
  high: 1.0,
};

/**
 * Export a design to an image
 */
export async function exportDesign(
  element: HTMLElement,
  options: ExportOptions,
  userTier: SubscriptionTier = 'free'
): Promise<ExportResponse> {
  try {
    // Get quality settings based on user tier
    const tierSettings = QUALITY_SETTINGS[userTier];
    const qualityMultiplier = QUALITY_MULTIPLIERS[options.quality];
    
    // Calculate scale
    const scale = tierSettings.scale * qualityMultiplier;
    
    // Generate canvas
    const canvas = await html2canvas(element, {
      scale,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    
    // Apply size constraints based on tier
    let width = canvas.width;
    let height = canvas.height;
    
    if (width > tierSettings.maxWidth) {
      const ratio = tierSettings.maxWidth / width;
      width = tierSettings.maxWidth;
      height = Math.round(height * ratio);
    }
    
    if (height > tierSettings.maxHeight) {
      const ratio = tierSettings.maxHeight / height;
      height = tierSettings.maxHeight;
      width = Math.round(width * ratio);
    }
    
    // Apply custom dimensions if provided
    if (options.width && options.height) {
      width = options.width;
      height = options.height;
    }
    
    // Create a new canvas with the desired dimensions
    const resizedCanvas = document.createElement('canvas');
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    
    const ctx = resizedCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    
    ctx.drawImage(canvas, 0, 0, width, height);
    
    // Convert to blob
    const mimeType = options.format === 'jpg' ? 'image/jpeg' : `image/${options.format}`;
    const quality = options.format === 'png' ? undefined : qualityMultiplier;
    
    return new Promise((resolve) => {
      resizedCanvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              url: null,
              blob: null,
              error: { message: 'Failed to generate image blob' },
            });
            return;
          }
          
          const url = URL.createObjectURL(blob);
          resolve({ url, blob, error: null });
        },
        mimeType,
        quality
      );
    });
  } catch (error) {
    console.error('Export design error:', error);
    return {
      url: null,
      blob: null,
      error: { message: 'Failed to export design' },
    };
  }
}

/**
 * Download an exported design
 */
export function downloadExport(blob: Blob, fileName: string, format: ExportFormat): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

