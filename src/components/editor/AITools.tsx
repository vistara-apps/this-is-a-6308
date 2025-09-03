import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Wand2, Image, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import { SubscriptionTier } from '../../types/user';

interface AIToolsProps {
  userTier: SubscriptionTier;
  selectedImageUrl: string | null;
  onApplyBackgroundRemoval: (processedImageUrl: string) => void;
  onApplySuggestion: (suggestion: string) => void;
}

export function AITools({
  userTier,
  selectedImageUrl,
  onApplyBackgroundRemoval,
  onApplySuggestion,
}: AIToolsProps) {
  const { isProcessing, error, processedImageUrl, suggestions, removeImageBackground, getDesignSuggestions, clearError } = useAI();
  
  const [showRemoveBackgroundDialog, setShowRemoveBackgroundDialog] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const [prompt, setPrompt] = useState('');
  
  const handleRemoveBackground = async () => {
    if (!selectedImageUrl) return;
    
    const processedUrl = await removeImageBackground(selectedImageUrl, userTier);
    
    if (processedUrl) {
      onApplyBackgroundRemoval(processedUrl);
      setShowRemoveBackgroundDialog(false);
    }
  };
  
  const handleGetSuggestions = async () => {
    if (!prompt) return;
    
    await getDesignSuggestions(prompt, userTier);
  };
  
  const handleApplySuggestion = (suggestion: string) => {
    onApplySuggestion(suggestion);
    setShowSuggestionsDialog(false);
  };
  
  const isPremiumFeature = userTier === 'free';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">AI Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowRemoveBackgroundDialog(true)}
            disabled={!selectedImageUrl}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Remove Background
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowSuggestionsDialog(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Design Suggestions
          </Button>
        </CardContent>
      </Card>
      
      {/* Remove Background Dialog */}
      <Dialog open={showRemoveBackgroundDialog} onOpenChange={setShowRemoveBackgroundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Background</DialogTitle>
            <DialogDescription>
              Our AI will remove the background from your image.
              {isPremiumFeature && ' Free tier users have limited uses per month.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {selectedImageUrl && (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-full max-w-sm">
                  <img
                    src={processedImageUrl || selectedImageUrl}
                    alt="Selected"
                    className="w-full h-auto rounded-lg border"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                      <p className="text-red-800 text-sm">{error.message}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRemoveBackgroundDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRemoveBackground}
              disabled={isProcessing || !selectedImageUrl}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : processedImageUrl ? (
                'Apply Changes'
              ) : (
                'Remove Background'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Design Suggestions Dialog */}
      <Dialog open={showSuggestionsDialog} onOpenChange={setShowSuggestionsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Design Suggestions</DialogTitle>
            <DialogDescription>
              Get AI-powered design suggestions for your project.
              {isPremiumFeature && ' Free tier users have limited uses per month.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Describe what you're creating..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isProcessing}
              />
              <Button onClick={handleGetSuggestions} disabled={isProcessing || !prompt}>
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error.message}</p>
                </div>
              </div>
            )}
            
            {suggestions && suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Suggestions:</h4>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-purple-50 border border-purple-100 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      <p>{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuggestionsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

