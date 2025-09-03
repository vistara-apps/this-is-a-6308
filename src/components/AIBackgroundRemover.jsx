import React, { useState } from 'react';
import { X, Wand2, Loader2 } from 'lucide-react';

const AIBackgroundRemover = ({ images, onProcessed, onClose }) => {
  const [processing, setProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleRemoveBackground = async (image) => {
    setProcessing(true);
    setSelectedImage(image.id);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would call the OpenAI API here
      // For demo purposes, we'll just mark the image as processed
      const processedImage = {
        ...image,
        processed: true,
        // In reality, this would be the processed image URL from the AI
        processedUrl: image.url,
      };

      if (onProcessed) {
        onProcessed(processedImage);
      }

      alert('Background removed successfully! (Demo simulation)');
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setProcessing(false);
      setSelectedImage(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">AI Background Removal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Select an image to remove its background using AI technology.
          </p>

          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No images uploaded yet. Upload images first to use this feature.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  
                  <button
                    onClick={() => handleRemoveBackground(image)}
                    disabled={processing}
                    className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg disabled:opacity-50"
                  >
                    {processing && selectedImage === image.id ? (
                      <Loader2 className="animate-spin text-white" size={24} />
                    ) : (
                      <div className="flex items-center space-x-2 text-white">
                        <Wand2 size={20} />
                        <span className="text-sm font-medium">
                          {image.processed ? 'Processed' : 'Remove BG'}
                        </span>
                      </div>
                    )}
                  </button>

                  {image.processed && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      ✓ Done
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Upload your images using the image tool</li>
              <li>2. Click on any image to remove its background</li>
              <li>3. Our AI will process the image automatically</li>
              <li>4. Use the processed image in your design</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBackgroundRemover;