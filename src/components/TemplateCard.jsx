import React from 'react';
import { Crown, Eye } from 'lucide-react';

const TemplateCard = ({ template, onSelect }) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(template);
    }
  };

  return (
    <div className="glass-effect rounded-xl overflow-hidden hover:scale-105 transition-all duration-200 cursor-pointer group">
      <div className="relative">
        <img
          src={template.previewUrl}
          alt={template.name}
          className="w-full aspect-video object-cover"
        />
        {template.isPremium && (
          <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-md">
            <Crown size={16} />
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handleSelect}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
          >
            <Eye size={16} />
            <span>Use Template</span>
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1">{template.name}</h3>
        <p className="text-white/70 text-sm capitalize">{template.category}</p>
        {template.isPremium && (
          <span className="inline-block mt-2 bg-accent/20 text-accent text-xs px-2 py-1 rounded-full">
            Premium
          </span>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;