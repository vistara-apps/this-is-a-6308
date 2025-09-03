import { useState, useEffect, useCallback } from 'react';
import { Template } from '../types/template';
import {
  getAllTemplates,
  getTemplatesByCategory,
  getTemplate,
  searchTemplates,
  getTemplateCategories,
  TemplateError
} from '../services/template-service';
import { SubscriptionTier } from '../types/user';

interface UseTemplatesReturn {
  templates: Template[];
  currentTemplate: Template | null;
  categories: string[];
  isLoading: boolean;
  error: TemplateError | null;
  fetchTemplates: (userTier?: SubscriptionTier) => Promise<void>;
  fetchTemplatesByCategory: (category: string, userTier?: SubscriptionTier) => Promise<void>;
  fetchTemplate: (templateId: string) => Promise<void>;
  searchTemplatesByQuery: (query: string, userTier?: SubscriptionTier) => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export function useTemplates(): UseTemplatesReturn {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<TemplateError | null>(null);

  const fetchTemplates = useCallback(async (userTier: SubscriptionTier = 'free') => {
    setIsLoading(true);
    setError(null);
    try {
      const { templates, error } = await getAllTemplates(userTier);
      if (error) {
        setError(error);
      } else {
        setTemplates(templates);
      }
    } catch (err) {
      console.error('Fetch templates error:', err);
      setError({ message: 'An unexpected error occurred while fetching templates' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchTemplatesByCategory = useCallback(
    async (category: string, userTier: SubscriptionTier = 'free') => {
      setIsLoading(true);
      setError(null);
      try {
        const { templates, error } = await getTemplatesByCategory(category, userTier);
        if (error) {
          setError(error);
        } else {
          setTemplates(templates);
        }
      } catch (err) {
        console.error('Fetch templates by category error:', err);
        setError({ message: 'An unexpected error occurred while fetching templates' });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchTemplate = useCallback(async (templateId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { template, error } = await getTemplate(templateId);
      if (error) {
        setError(error);
      } else {
        setCurrentTemplate(template);
      }
    } catch (err) {
      console.error('Fetch template error:', err);
      setError({ message: 'An unexpected error occurred while fetching the template' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchTemplatesByQuery = useCallback(
    async (query: string, userTier: SubscriptionTier = 'free') => {
      setIsLoading(true);
      setError(null);
      try {
        const { templates, error } = await searchTemplates(query, userTier);
        if (error) {
          setError(error);
        } else {
          setTemplates(templates);
        }
      } catch (err) {
        console.error('Search templates error:', err);
        setError({ message: 'An unexpected error occurred while searching templates' });
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { categories, error } = await getTemplateCategories();
      if (error) {
        setError(error);
      } else {
        setCategories(categories);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
      setError({ message: 'An unexpected error occurred while fetching categories' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    templates,
    currentTemplate,
    categories,
    isLoading,
    error,
    fetchTemplates,
    fetchTemplatesByCategory,
    fetchTemplate,
    searchTemplatesByQuery,
    fetchCategories,
    clearError
  };
}

