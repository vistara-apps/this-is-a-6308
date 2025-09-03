import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getProjects, getTemplates } from '../utils/storage';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = getUser();
      const projectsData = getProjects();
      const templatesData = getTemplates();

      setUser(userData);
      setProjects(projectsData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    projects,
    setProjects,
    templates,
    setTemplates,
    isLoading,
    loadData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};