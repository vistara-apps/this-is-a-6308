import { useState, useEffect, useCallback } from 'react';
import { Project } from '../types/project';
import {
  getUserProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
  ProjectError
} from '../services/project-service';

interface UseProjectsReturn {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: ProjectError | null;
  fetchProjects: (userId: string) => Promise<void>;
  fetchProject: (projectId: string) => Promise<void>;
  createNewProject: (project: Omit<Project, 'id'>) => Promise<Project | null>;
  updateExistingProject: (projectId: string, updates: Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>) => Promise<Project | null>;
  deleteExistingProject: (projectId: string) => Promise<boolean>;
  duplicateExistingProject: (projectId: string, userId: string) => Promise<Project | null>;
  clearError: () => void;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ProjectError | null>(null);

  const fetchProjects = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { projects, error } = await getUserProjects(userId);
      if (error) {
        setError(error);
      } else {
        setProjects(projects);
      }
    } catch (err) {
      console.error('Fetch projects error:', err);
      setError({ message: 'An unexpected error occurred while fetching projects' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { project, error } = await getProject(projectId);
      if (error) {
        setError(error);
      } else {
        setCurrentProject(project);
      }
    } catch (err) {
      console.error('Fetch project error:', err);
      setError({ message: 'An unexpected error occurred while fetching the project' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewProject = useCallback(async (project: Omit<Project, 'id'>): Promise<Project | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { project: newProject, error } = await createProject(project);
      if (error) {
        setError(error);
        return null;
      } else {
        // Add to projects list
        if (newProject) {
          setProjects(prev => [newProject, ...prev]);
          setCurrentProject(newProject);
        }
        return newProject;
      }
    } catch (err) {
      console.error('Create project error:', err);
      setError({ message: 'An unexpected error occurred while creating the project' });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateExistingProject = useCallback(
    async (
      projectId: string,
      updates: Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>
    ): Promise<Project | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const { project: updatedProject, error } = await updateProject(projectId, updates);
        if (error) {
          setError(error);
          return null;
        } else {
          // Update in projects list
          if (updatedProject) {
            setProjects(prev =>
              prev.map(p => (p.id === projectId ? updatedProject : p))
            );
            // Update current project if it's the one being edited
            if (currentProject && currentProject.id === projectId) {
              setCurrentProject(updatedProject);
            }
          }
          return updatedProject;
        }
      } catch (err) {
        console.error('Update project error:', err);
        setError({ message: 'An unexpected error occurred while updating the project' });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentProject]
  );

  const deleteExistingProject = useCallback(async (projectId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await deleteProject(projectId);
      if (error) {
        setError(error);
        return false;
      } else {
        // Remove from projects list
        setProjects(prev => prev.filter(p => p.id !== projectId));
        // Clear current project if it's the one being deleted
        if (currentProject && currentProject.id === projectId) {
          setCurrentProject(null);
        }
        return true;
      }
    } catch (err) {
      console.error('Delete project error:', err);
      setError({ message: 'An unexpected error occurred while deleting the project' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  const duplicateExistingProject = useCallback(
    async (projectId: string, userId: string): Promise<Project | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const { project: duplicatedProject, error } = await duplicateProject(projectId, userId);
        if (error) {
          setError(error);
          return null;
        } else {
          // Add to projects list
          if (duplicatedProject) {
            setProjects(prev => [duplicatedProject, ...prev]);
          }
          return duplicatedProject;
        }
      } catch (err) {
        console.error('Duplicate project error:', err);
        setError({ message: 'An unexpected error occurred while duplicating the project' });
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    projects,
    currentProject,
    isLoading,
    error,
    fetchProjects,
    fetchProject,
    createNewProject,
    updateExistingProject,
    deleteExistingProject,
    duplicateExistingProject,
    clearError
  };
}

