export type AssetType = 'image' | 'svg' | 'font' | 'video';

export interface Asset {
  id: string;
  project_id: string;
  type: AssetType;
  url: string;
  name: string;
  size: number; // in bytes
  created_at: string;
}

