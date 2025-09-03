import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ImageUploader = ({ onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    const processedImages = imageFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      processed: false,
    }));

    if (onUpload) {
      onUpload(processedImages);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      
      <button
        onClick={handleFileSelect}
        className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/30 rounded-lg hover:border-white/50 transition-colors text-white/70 hover:text-white"
      >
        <Upload size={32} className="mb-2" />
        <span className="text-sm font-medium">Upload Images</span>
        <span className="text-xs text-white/50 mt-1">
          Click to select files
        </span>
      </button>
    </div>
  );
};

export default ImageUploader;