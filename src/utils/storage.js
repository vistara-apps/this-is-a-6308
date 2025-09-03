// Mock data and storage utilities
export const initializeApp = () => {
  // Initialize mock user
  if (!localStorage.getItem('pixelspark_user')) {
    const user = {
      userId: '1',
      email: 'demo@pixelspark.com',
      subscriptionTier: 'free',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('pixelspark_user', JSON.stringify(user));
  }

  // Initialize mock templates
  if (!localStorage.getItem('pixelspark_templates')) {
    const templates = [
      {
        templateId: '1',
        name: 'Social Media Post',
        category: 'social',
        previewUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop',
        elements: { width: 1080, height: 1080, backgroundColor: '#667eea' },
        isPremium: false,
      },
      {
        templateId: '2',
        name: 'Instagram Story',
        category: 'social',
        previewUrl: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=600&fit=crop',
        elements: { width: 1080, height: 1920, backgroundColor: '#764ba2' },
        isPremium: false,
      },
      {
        templateId: '3',
        name: 'LinkedIn Banner',
        category: 'professional',
        previewUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=200&fit=crop',
        elements: { width: 1584, height: 396, backgroundColor: '#4f46e5' },
        isPremium: true,
      },
      {
        templateId: '4',
        name: 'YouTube Thumbnail',
        category: 'video',
        previewUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=400&fit=crop',
        elements: { width: 1280, height: 720, backgroundColor: '#f59e0b' },
        isPremium: false,
      },
      {
        templateId: '5',
        name: 'Presentation Slide',
        category: 'business',
        previewUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=400&fit=crop',
        elements: { width: 1920, height: 1080, backgroundColor: '#10b981' },
        isPremium: true,
      },
      {
        templateId: '6',
        name: 'Blog Header',
        category: 'web',
        previewUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=300&fit=crop',
        elements: { width: 1200, height: 600, backgroundColor: '#8b5cf6' },
        isPremium: false,
      },
    ];
    localStorage.setItem('pixelspark_templates', JSON.stringify(templates));
  }

  // Initialize empty projects
  if (!localStorage.getItem('pixelspark_projects')) {
    localStorage.setItem('pixelspark_projects', JSON.stringify([]));
  }
};

export const getUser = () => {
  const user = localStorage.getItem('pixelspark_user');
  return user ? JSON.parse(user) : null;
};

export const getProjects = () => {
  const projects = localStorage.getItem('pixelspark_projects');
  return projects ? JSON.parse(projects) : [];
};

export const getTemplates = () => {
  const templates = localStorage.getItem('pixelspark_templates');
  return templates ? JSON.parse(templates) : [];
};

export const saveProject = (project) => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.projectId === project.projectId);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }
  
  localStorage.setItem('pixelspark_projects', JSON.stringify(projects));
  return project;
};

export const deleteProject = (projectId) => {
  const projects = getProjects();
  const filteredProjects = projects.filter(p => p.projectId !== projectId);
  localStorage.setItem('pixelspark_projects', JSON.stringify(filteredProjects));
};