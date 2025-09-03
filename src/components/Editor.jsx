import React, { useState, useRef } from 'react';
import { ArrowLeft, Download, Share2, Save, Upload, Wand2, Layers } from 'lucide-react';
import { saveProject } from '../utils/storage';
import AIBackgroundRemover from './AIBackgroundRemover';
import ImageUploader from './ImageUploader';

const Editor = ({ template, project, onBack }) => {
  const [currentProject, setCurrentProject] = useState(
    project || {
      projectId: Date.now().toString(),
      userId: '1',
      name: template ? `${template.name} Project` : 'New Project',
      templateId: template?.templateId || null,
      designData: {
        template: template,
        images: [],
        text: 'Your Text Here',
        backgroundColor: template?.elements?.backgroundColor || '#667eea',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  );
  
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedTool, setSelectedTool] = useState('text');
  const [showAITools, setShowAITools] = useState(false);
  const canvasRef = useRef(null);

  const handleSave = () => {
    const updatedProject = {
      ...currentProject,
      updatedAt: new Date().toISOString(),
    };
    saveProject(updatedProject);
    setCurrentProject(updatedProject);
    alert('Project saved successfully!');
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${currentProject.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } else {
      // Fallback for demo
      alert('Export feature would download your design as PNG/JPG');
    }
  };

  const handleShare = async () => {
    try {
      const shareData = {
        title: currentProject.name,
        text: 'Check out my design created with PixelSpark!',
        url: window.location.href,
      };
      
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareData.url);
        alert('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Share feature would generate a shareable link');
    }
  };

  const handleImageUpload = (images) => {
    setUploadedImages([...uploadedImages, ...images]);
    setCurrentProject({
      ...currentProject,
      designData: {
        ...currentProject.designData,
        images: [...currentProject.designData.images, ...images],
      },
    });
  };

  const handleBackgroundRemoval = (processedImage) => {
    const updatedImages = uploadedImages.map(img => 
      img.id === processedImage.id ? processedImage : img
    );
    setUploadedImages(updatedImages);
    
    setCurrentProject({
      ...currentProject,
      designData: {
        ...currentProject.designData,
        images: updatedImages,
      },
    });
  };

  const tools = [
    { id: 'text', label: 'Text', icon: Layers },
    { id: 'images', label: 'Images', icon: Upload },
    { id: 'ai', label: 'AI Tools', icon: Wand2 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-semibold text-white">{currentProject.name}</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tools Sidebar */}
        <div className="glass-effect rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Tools</h3>
          <div className="space-y-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setSelectedTool(tool.id);
                    if (tool.id === 'ai') setShowAITools(true);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    selectedTool === tool.id
                      ? 'bg-accent text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>

          {selectedTool === 'text' && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Text Content</label>
                <textarea
                  value={currentProject.designData.text}
                  onChange={(e) => setCurrentProject({
                    ...currentProject,
                    designData: { ...currentProject.designData, text: e.target.value }
                  })}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Background Color</label>
                <input
                  type="color"
                  value={currentProject.designData.backgroundColor}
                  onChange={(e) => setCurrentProject({
                    ...currentProject,
                    designData: { ...currentProject.designData, backgroundColor: e.target.value }
                  })}
                  className="w-full h-10 bg-white/10 border border-white/20 rounded-lg"
                />
              </div>
            </div>
          )}

          {selectedTool === 'images' && (
            <div className="mt-6">
              <ImageUploader onUpload={handleImageUpload} />
              {uploadedImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-white/70 text-sm">Uploaded Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt="Uploaded"
                          className="w-full h-16 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <div className="glass-effect rounded-xl p-6">
            <div className="aspect-video bg-white rounded-lg overflow-hidden relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={450}
                style={{
                  background: currentProject.designData.backgroundColor,
                  width: '100%',
                  height: '100%',
                }}
                className="absolute inset-0"
              />
              
              {/* Design Preview */}
              <div 
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: currentProject.designData.backgroundColor }}
              >
                <div className="text-center p-8">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {currentProject.designData.text}
                  </h2>
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      {uploadedImages.slice(0, 4).map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt="Design element"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tools Modal */}
      {showAITools && (
        <AIBackgroundRemover
          images={uploadedImages}
          onProcessed={handleBackgroundRemoval}
          onClose={() => setShowAITools(false)}
        />
      )}
    </div>
  );
};

export default Editor;