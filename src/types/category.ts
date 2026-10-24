// 1. Base interface matching CategoryBase
export interface CategoryBase {
  name: string;
  slug: string;
  description?: string | null;
  icon_url?: string | null;
  is_active: boolean;
  display_order: number;
}

// 2. Creation interface matching CategoryCreate
export interface CategoryCreate extends CategoryBase {}

// 3. Update interface matching CategoryUpdate (all fields optional)
export interface CategoryUpdate {
  name?: string | null;
  slug?: string | null;
  description?: string | null;
  icon_url?: string | null;
  is_active?: boolean | null;
  display_order?: number | null;
}

// 4. Read interface matching CategoryRead (includes ID and timestamps)
export interface CategoryRead extends CategoryBase {
  id: number;
  created_at: string; // ISO DateTime string from Python
  updated_at: string; // ISO DateTime string from Python
}

// 5. Reorder interface matching CategoryReorderItem
export interface CategoryReorderItem {
  id: number;
  display_order: number;
}

// Convenience alias (CategoryRead)
export type Category = CategoryRead;