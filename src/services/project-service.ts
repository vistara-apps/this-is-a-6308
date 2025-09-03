import { supabase } from '../lib/supabase';
import { Project } from '../types/project';

export type ProjectError = {
  message: string;
  code?: string;
};

/**
 * Get all projects for a user
 */
export async function getUserProjects(
  userId: string
): Promise<{ projects: Project[]; error: ProjectError | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      return { projects: [], error: { message: error.message, code: error.code } };
    }

    return { projects: data as Project[], error: null };
  } catch (error) {
    console.error('Get user projects error:', error);
    return { projects: [], error: { message: 'An unexpected error occurred while fetching projects' } };
  }
}

/**
 * Get a single project by ID
 */
export async function getProject(
  projectId: string
): Promise<{ project: Project | null; error: ProjectError | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      return { project: null, error: { message: error.message, code: error.code } };
    }

    return { project: data as Project, error: null };
  } catch (error) {
    console.error('Get project error:', error);
    return { project: null, error: { message: 'An unexpected error occurred while fetching the project' } };
  }
}

/**
 * Create a new project
 */
export async function createProject(
  project: Omit<Project, 'id'>
): Promise<{ project: Project | null; error: ProjectError | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...project,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return { project: null, error: { message: error.message, code: error.code } };
    }

    return { project: data as Project, error: null };
  } catch (error) {
    console.error('Create project error:', error);
    return { project: null, error: { message: 'An unexpected error occurred while creating the project' } };
  }
}

/**
 * Update an existing project
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>
): Promise<{ project: Project | null; error: ProjectError | null }> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      return { project: null, error: { message: error.message, code: error.code } };
    }

    return { project: data as Project, error: null };
  } catch (error) {
    console.error('Update project error:', error);
    return { project: null, error: { message: 'An unexpected error occurred while updating the project' } };
  }
}

/**
 * Delete a project
 */
export async function deleteProject(
  projectId: string
): Promise<{ error: ProjectError | null }> {
  try {
    // First delete all assets associated with the project
    const { error: assetsError } = await supabase
      .from('assets')
      .delete()
      .eq('project_id', projectId);

    if (assetsError) {
      return { error: { message: assetsError.message, code: assetsError.code } };
    }

    // Then delete the project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      return { error: { message: error.message, code: error.code } };
    }

    return { error: null };
  } catch (error) {
    console.error('Delete project error:', error);
    return { error: { message: 'An unexpected error occurred while deleting the project' } };
  }
}

/**
 * Duplicate a project
 */
export async function duplicateProject(
  projectId: string,
  userId: string
): Promise<{ project: Project | null; error: ProjectError | null }> {
  try {
    // Get the original project
    const { project: originalProject, error: getError } = await getProject(projectId);

    if (getError) {
      return { project: null, error: getError };
    }

    if (!originalProject) {
      return { project: null, error: { message: 'Project not found' } };
    }

    // Create a new project with the same data
    const { project: newProject, error: createError } = await createProject({
      user_id: userId,
      name: `${originalProject.name} (Copy)`,
      template_id: originalProject.template_id,
      design_data: originalProject.design_data,
    });

    if (createError) {
      return { project: null, error: createError };
    }

    // Duplicate assets if needed (in a real app, this would copy the assets to new storage locations)
    // For demo purposes, we'll skip this step

    return { project: newProject, error: null };
  } catch (error) {
    console.error('Duplicate project error:', error);
    return { project: null, error: { message: 'An unexpected error occurred while duplicating the project' } };
  }
}

