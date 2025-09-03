import React from 'react';
import { useApp } from '../contexts/AppContext';
import TemplateCard from './TemplateCard';
import { ArrowRight, TrendingUp } from 'lucide-react';

const Dashboard = ({ onTemplateSelect }) => {
  const { templates, projects } = useApp();
  
  const recentTemplates = templates.slice(0, 6);
  const recentProjects = projects.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          Create Amazing Graphics in Minutes
        </h1>
        <p className="text-xl text-white/80 max-w-2xl">
          Choose from hundreds of professional templates, customize with our AI-powered tools, 
          and share your creations instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="glass-effect rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Projects Created</h3>
            <TrendingUp className="text-accent" size={24} />
          </div>
          <div className="text-3xl font-bold">{projects.length}</div>
          <p className="text-white/70 text-sm">+2 this week</p>
        </div>

        <div className="glass-effect rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Templates Used</h3>
            <TrendingUp className="text-accent" size={24} />
          </div>
          <div className="text-3xl font-bold">{Math.min(projects.length, templates.length)}</div>
          <p className="text-white/70 text-sm">Explore more templates</p>
        </div>

        <div className="glass-effect rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Tools Used</h3>
            <TrendingUp className="text-accent" size={24} />
          </div>
          <div className="text-3xl font-bold">0</div>
          <p className="text-white/70 text-sm">Try background removal</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Popular Templates</h2>
          <button 
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            onClick={() => onTemplateSelect && onTemplateSelect(null)}
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTemplates.map((template) => (
            <TemplateCard
              key={template.templateId}
              template={template}
              onSelect={onTemplateSelect}
            />
          ))}
        </div>
      </div>

      {recentProjects.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Recent Projects</h2>
            <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <span>View All</span>
              <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProjects.map((project) => (
              <div
                key={project.projectId}
                className="glass-effect rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-primary to-accent"></div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">{project.name}</h3>
                  <p className="text-white/70 text-sm">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;