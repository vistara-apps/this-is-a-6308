import { supabase } from '../lib/supabase';
import { Template } from '../types/template';
import { SubscriptionTier } from '../types/user';

export type TemplateError = {
  message: string;
  code?: string;
};

/**
 * Get all templates
 */
export async function getAllTemplates(
  userTier: SubscriptionTier = 'free'
): Promise<{ templates: Template[]; error: TemplateError | null }> {
  try {
    let query = supabase.from('templates').select('*');
    
    // Filter by premium status based on user tier
    if (userTier === 'free') {
      query = query.eq('is_premium', false);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return { templates: [], error: { message: error.message, code: error.code } };
    }

    return { templates: data as Template[], error: null };
  } catch (error) {
    console.error('Get all templates error:', error);
    return { templates: [], error: { message: 'An unexpected error occurred while fetching templates' } };
  }
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(
  category: string,
  userTier: SubscriptionTier = 'free'
): Promise<{ templates: Template[]; error: TemplateError | null }> {
  try {
    let query = supabase
      .from('templates')
      .select('*')
      .eq('category', category);
    
    // Filter by premium status based on user tier
    if (userTier === 'free') {
      query = query.eq('is_premium', false);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return { templates: [], error: { message: error.message, code: error.code } };
    }

    return { templates: data as Template[], error: null };
  } catch (error) {
    console.error('Get templates by category error:', error);
    return { templates: [], error: { message: 'An unexpected error occurred while fetching templates' } };
  }
}

/**
 * Get a single template by ID
 */
export async function getTemplate(
  templateId: string
): Promise<{ template: Template | null; error: TemplateError | null }> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error) {
      return { template: null, error: { message: error.message, code: error.code } };
    }

    return { template: data as Template, error: null };
  } catch (error) {
    console.error('Get template error:', error);
    return { template: null, error: { message: 'An unexpected error occurred while fetching the template' } };
  }
}

/**
 * Search templates by query
 */
export async function searchTemplates(
  query: string,
  userTier: SubscriptionTier = 'free'
): Promise<{ templates: Template[]; error: TemplateError | null }> {
  try {
    let dbQuery = supabase
      .from('templates')
      .select('*')
      .or(`name.ilike.%${query}%,category.ilike.%${query}%`);
    
    // Filter by premium status based on user tier
    if (userTier === 'free') {
      dbQuery = dbQuery.eq('is_premium', false);
    }
    
    const { data, error } = await dbQuery.order('created_at', { ascending: false });

    if (error) {
      return { templates: [], error: { message: error.message, code: error.code } };
    }

    return { templates: data as Template[], error: null };
  } catch (error) {
    console.error('Search templates error:', error);
    return { templates: [], error: { message: 'An unexpected error occurred while searching templates' } };
  }
}

/**
 * Get all template categories
 */
export async function getTemplateCategories(): Promise<{ categories: string[]; error: TemplateError | null }> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('category')
      .order('category');

    if (error) {
      return { categories: [], error: { message: error.message, code: error.code } };
    }

    // Extract unique categories
    const categories = [...new Set(data.map(item => item.category))];

    return { categories, error: null };
  } catch (error) {
    console.error('Get template categories error:', error);
    return { categories: [], error: { message: 'An unexpected error occurred while fetching categories' } };
  }
}

