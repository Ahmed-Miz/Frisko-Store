export interface Icategories {
  id: number;
  parent_id: null;
  name: string;
  slug: string;
  image: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url: string;
  children: Child[];
}

interface Child {
  id: number;
  parent_id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url: string;
}
