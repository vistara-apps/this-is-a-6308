export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'group';
  properties: any; // Element-specific properties
}

export interface Template {
  id: string;
  name: string;
  category: string;
  preview_url: string;
  elements: TemplateElement[];
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

