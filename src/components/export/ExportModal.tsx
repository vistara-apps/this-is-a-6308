import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Download, Loader2, AlertCircle, Check } from 'lucide-react';
import { useExport } from '../../hooks/useExport';
import { ExportFormat, ExportQuality } from '../../services/export-service';
import { SubscriptionTier } from '../../types/user';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  designElement: HTMLElement | null;
  projectName: string;
  userTier: SubscriptionTier;
  onExportComplete?: (url: string, blob: Blob) => void;
}

export function ExportModal({
  isOpen,
  onClose,
  designElement,
  projectName,
  userTier,
  onExportComplete,
}: ExportModalProps) {
  const { isExporting, exportedUrl, exportedBlob, error, exportToImage, downloadImage, clearExport } = useExport();
  
  const [fileName, setFileName] = useState(projectName || 'My Design');
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState<ExportQuality>('high');
  const [exportComplete, setExportComplete] = useState(false);
  
  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFileName(projectName || 'My Design');
      setExportComplete(false);
      clearExport();
    }
  }, [isOpen, projectName, clearExport]);
  
  const handleExport = async () => {
    if (!designElement) return;
    
    const { url, blob } = await exportToImage(
      designElement,
      {
        format,
        quality,
        fileName,
      },
      userTier
    );
    
    if (url && blob) {
      setExportComplete(true);
      if (onExportComplete) {
        onExportComplete(url, blob);
      }
    }
  };
  
  const handleDownload = () => {
    downloadImage(fileName, format);
  };
  
  const handleClose = () => {
    clearExport();
    onClose();
  };
  
  // Format options
  const formatOptions: { value: ExportFormat; label: string }[] = [
    { value: 'png', label: 'PNG - Best for graphics with transparency' },
    { value: 'jpg', label: 'JPG - Smaller file size, no transparency' },
  ];
  
  // Quality options
  const qualityOptions: { value: ExportQuality; label: string; description: string }[] = [
    { value: 'low', label: 'Low', description: 'Smaller file size, lower quality' },
    { value: 'medium', label: 'Medium', description: 'Balanced file size and quality' },
    { value: 'high', label: 'High', description: 'Larger file size, best quality' },
  ];
  
  // Quality restrictions based on tier
  const isQualityRestricted = userTier === 'free' && quality === 'high';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Design</DialogTitle>
          <DialogDescription>
            Export your design as an image file
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {exportedUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-full max-w-sm">
                <img
                  src={exportedUrl}
                  alt="Exported design"
                  className="w-full h-auto rounded-lg border"
                />
                {exportComplete && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-green-600 font-medium">Export complete!</p>
                <p className="text-sm text-gray-500">Your design has been exported successfully.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">File Name</label>
                <Input
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name"
                  disabled={isExporting}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {formatOptions.map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-colors ${
                        format === option.value ? 'border-purple-500 bg-purple-50' : ''
                      }`}
                      onClick={() => setFormat(option.value)}
                    >
                      <CardContent className="p-3">
                        <div className="font-medium">{option.value.toUpperCase()}</div>
                        <div className="text-xs text-gray-500">{option.label.split(' - ')[1]}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {qualityOptions.map((option) => {
                    const isDisabled = userTier === 'free' && option.value === 'high';
                    
                    return (
                      <Card
                        key={option.value}
                        className={`cursor-pointer transition-colors ${
                          quality === option.value ? 'border-purple-500 bg-purple-50' : ''
                        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isDisabled && setQuality(option.value)}
                      >
                        <CardContent className="p-3">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                          {isDisabled && (
                            <div className="text-xs text-purple-600 mt-1">Pro+ only</div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
              
              {isQualityRestricted && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  High quality exports are available on Pro and Premium plans.
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                  <div className="flex">
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{error.message}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          
          {exportedUrl ? (
            <Button onClick={handleDownload} disabled={!exportedBlob}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          ) : (
            <Button onClick={handleExport} disabled={isExporting || !designElement}>
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                'Export'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

