import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { Loader2, AlertCircle, Copy, Check, Twitter, Facebook, Linkedin, Link } from 'lucide-react';
import { useShare } from '../../hooks/useShare';
import { SharePlatform } from '../../services/share-service';
import { SubscriptionTier } from '../../types/user';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  projectId: string;
  projectName: string;
  imageBlob: Blob | null;
  userTier: SubscriptionTier;
}

export function ShareModal({
  isOpen,
  onClose,
  userId,
  projectId,
  projectName,
  imageBlob,
  userTier,
}: ShareModalProps) {
  const { isSharing, shareUrl, error, generateLink, shareToSocial, clearShare } = useShare();
  
  const [title, setTitle] = useState(projectName || 'My Design');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTitle(projectName || 'My Design');
      setDescription('');
      setIsPublic(true);
      setCopied(false);
      clearShare();
    }
  }, [isOpen, projectName, clearShare]);
  
  const handleGenerateLink = async () => {
    if (!imageBlob) return;
    
    await generateLink(
      userId,
      projectId,
      imageBlob,
      {
        title,
        description,
        isPublic,
      },
      userTier
    );
  };
  
  const handleShareToSocial = (platform: SharePlatform) => {
    if (!shareUrl) return;
    
    shareToSocial(
      platform,
      shareUrl,
      title,
      imageBlob ? URL.createObjectURL(imageBlob) : undefined
    );
  };
  
  const handleCopyLink = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleClose = () => {
    clearShare();
    onClose();
  };
  
  // Social platforms
  const socialPlatforms: { id: SharePlatform; label: string; icon: React.ReactNode }[] = [
    { id: 'twitter', label: 'Twitter', icon: <Twitter className="w-5 h-5" /> },
    { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-5 h-5" /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Design</DialogTitle>
          <DialogDescription>
            Share your design with others or on social media
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {shareUrl ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleCopyLink}
                  className="flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {socialPlatforms.map((platform) => (
                  <Button
                    key={platform.id}
                    variant="outline"
                    className="flex flex-col items-center py-3 h-auto"
                    onClick={() => handleShareToSocial(platform.id)}
                  >
                    {platform.icon}
                    <span className="mt-1 text-xs">{platform.label}</span>
                  </Button>
                ))}
              </div>
              
              {userTier === 'free' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800">
                  <p>Upgrade to Pro or Premium for custom branding and more sharing options.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for your design"
                  disabled={isSharing}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (optional)</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description"
                  disabled={isSharing}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Visibility</label>
                <div className="grid grid-cols-2 gap-2">
                  <Card
                    className={`cursor-pointer transition-colors ${
                      isPublic ? 'border-purple-500 bg-purple-50' : ''
                    }`}
                    onClick={() => setIsPublic(true)}
                  >
                    <CardContent className="p-3">
                      <div className="font-medium">Public</div>
                      <div className="text-xs text-gray-500">Anyone with the link can view</div>
                    </CardContent>
                  </Card>
                  
                  <Card
                    className={`cursor-pointer transition-colors ${
                      !isPublic ? 'border-purple-500 bg-purple-50' : ''
                    }`}
                    onClick={() => setIsPublic(false)}
                  >
                    <CardContent className="p-3">
                      <div className="font-medium">Private</div>
                      <div className="text-xs text-gray-500">Only you can view</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
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
            {shareUrl ? 'Close' : 'Cancel'}
          </Button>
          
          {!shareUrl && (
            <Button
              onClick={handleGenerateLink}
              disabled={isSharing || !imageBlob || !title}
            >
              {isSharing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Link className="w-4 h-4 mr-2" />
                  Generate Link
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

