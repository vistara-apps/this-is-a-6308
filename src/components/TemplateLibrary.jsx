import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import TemplateCard from './TemplateCard';
import { Search, Filter } from 'lucide-react';

const TemplateLibrary = ({ onTemplateSelect }) => {
  const { templates } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'social', label: 'Social Media' },
    { id: 'professional', label: 'Professional' },
    { id: 'video', label: 'Video' },
    { id: 'business', label: 'Business' },
    { id: 'web', label: 'Web' },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Template Library</h1>
        <p className="text-xl text-white/80">
          Choose from our collection of professionally designed templates
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id} className="bg-gray-800 text-white">
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.templateId}
            template={template}
            onSelect={onTemplateSelect}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">No templates found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default TemplateLibrary;