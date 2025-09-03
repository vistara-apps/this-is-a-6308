export interface Project {
  id: string;
  user_id: string;
  name: string;
  template_id: string;
  design_data: any; // JSON data representing the design state
  created_at: string;
  updated_at: string;
}

