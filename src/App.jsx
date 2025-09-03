import React, { useState, useEffect } from 'react';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TemplateLibrary from './components/TemplateLibrary';
import Editor from './components/Editor';
import Projects from './components/Projects';
import { initializeApp } from './utils/storage';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setActiveView('editor');
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setActiveView('editor');
  };

  return (
    <AppProvider>
      <div className="min-h-screen gradient-bg">
        <div className="flex">
          <Sidebar activeView={activeView} onViewChange={setActiveView} />
          <main className="flex-1 p-6">
            {activeView === 'dashboard' && (
              <Dashboard onTemplateSelect={handleTemplateSelect} />
            )}
            {activeView === 'templates' && (
              <TemplateLibrary onTemplateSelect={handleTemplateSelect} />
            )}
            {activeView === 'editor' && (
              <Editor
                template={selectedTemplate}
                project={currentProject}
                onBack={() => setActiveView('dashboard')}
              />
            )}
            {activeView === 'projects' && (
              <Projects onProjectSelect={handleProjectSelect} />
            )}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;