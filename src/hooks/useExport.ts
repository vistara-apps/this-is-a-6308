import { useState, useCallback } from 'react';
import { SubscriptionTier } from '../types/user';
import {
  exportDesign,
  downloadExport,
  ExportFormat,
  ExportQuality,
  ExportOptions,
  ExportError
} from '../services/export-service';

interface UseExportReturn {
  isExporting: boolean;
  exportedUrl: string | null;
  exportedBlob: Blob | null;
  error: ExportError | null;
  exportToImage: (
    element: HTMLElement,
    options: ExportOptions,
    userTier: SubscriptionTier
  ) => Promise<{ url: string | null; blob: Blob | null }>;
  downloadImage: (fileName: string, format: ExportFormat) => void;
  clearExport: () => void;
}

export function useExport(): UseExportReturn {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<ExportError | null>(null);

  const exportToImage = useCallback(
    async (
      element: HTMLElement,
      options: ExportOptions,
      userTier: SubscriptionTier = 'free'
    ): Promise<{ url: string | null; blob: Blob | null }> => {
      setIsExporting(true);
      setError(null);
      
      try {
        const { url, blob, error } = await exportDesign(element, options, userTier);
        
        if (error) {
          setError(error);
          return { url: null, blob: null };
        }
        
        setExportedUrl(url);
        setExportedBlob(blob);
        return { url, blob };
      } catch (err) {
        console.error('Export error:', err);
        setError({ message: 'An unexpected error occurred during export' });
        return { url: null, blob: null };
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  const downloadImage = useCallback((fileName: string, format: ExportFormat) => {
    if (!exportedBlob) {
      setError({ message: 'No exported image to download' });
      return;
    }
    
    try {
      downloadExport(exportedBlob, fileName, format);
    } catch (err) {
      console.error('Download error:', err);
      setError({ message: 'Failed to download image' });
    }
  }, [exportedBlob]);

  const clearExport = useCallback(() => {
    if (exportedUrl) {
      URL.revokeObjectURL(exportedUrl);
    }
    setExportedUrl(null);
    setExportedBlob(null);
    setError(null);
  }, [exportedUrl]);

  return {
    isExporting,
    exportedUrl,
    exportedBlob,
    error,
    exportToImage,
    downloadImage,
    clearExport
  };
}

