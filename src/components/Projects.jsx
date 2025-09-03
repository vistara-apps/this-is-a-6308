import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Calendar, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { deleteProject } from '../utils/storage';

const Projects = ({ onProjectSelect }) => {
  const { projects, setProjects } = useApp();

  const handleDeleteProject = (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
      setProjects(projects.filter(p => p.projectId !== projectId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">My Projects</h1>
        <p className="text-xl text-white/80">
          Manage and access all your creative projects in one place
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="glass-effect rounded-xl p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-white mb-4">No projects yet</h3>
            <p className="text-white/70 mb-6">
              Start creating amazing graphics by selecting a template from our library.
            </p>
            <button className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Browse Templates
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.projectId} className="glass-effect rounded-xl overflow-hidden group">
              <div 
                className="aspect-video relative cursor-pointer"
                style={{ backgroundColor: project.designData?.backgroundColor || '#667eea' }}
                onClick={() => onProjectSelect(project)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-lg font-semibold text-center px-4">
                    {project.designData?.text || project.name}
                  </h3>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center space-x-2 text-white">
                    <Edit3 size={16} />
                    <span>Edit Project</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white truncate flex-1">{project.name}</h3>
                  <button
                    onClick={() => handleDeleteProject(project.projectId)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <div className="flex items-center text-white/70 text-sm mb-3">
                  <Calendar size={14} className="mr-1" />
                  <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onProjectSelect(project)}
                    className="flex-1 bg-accent hover:bg-accent/90 text-white text-sm py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-md transition-colors">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;