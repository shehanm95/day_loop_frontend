import type { Category, CategoryCreate as CategoryCreateInput, CategoryReorderItem } from "../types/category";
import { apiClient } from "./api";


export const categoryService = {
  // ==========================================
  // 1. RETRIEVAL & SEARCH ENDPOINTS (Public)
  // ==========================================

  /** Get a filtered, searched, and paginated list of categories */
  getCategories: async (
    skip = 0, 
    limit = 100, 
    isActive?: boolean, 
    search?: string
  ): Promise<Category[]> => {
    const params: any = { skip, limit };
    if (isActive !== undefined) params.is_active = isActive;
    if (search) params.search = search;

    const response = await apiClient.get<Category[]>("/api/v1/categories/", { params });
    return response.data;
  },

  /** Search categories by name, slug, or description */
  searchCategories: async (q: string, isActive?: boolean): Promise<Category[]> => {
    const params: any = { q };
    if (isActive !== undefined) params.is_active = isActive;

    const response = await apiClient.get<Category[]>("/api/v1/categories/search", { params });
    return response.data;
  },

  /** Get a single category by its slug */
  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/api/v1/categories/slug/${slug}`);
    return response.data;
  },

  /** Get a single category by its ID */
  getCategoryById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/api/v1/categories/${id}`);
    return response.data;
  },

  // ==========================================
  // 2. CREATION ENDPOINTS [Admin Only]
  // ==========================================

  /** Create a new category with optional image file upload using FormData */
  createCategory: async (data: CategoryCreateInput, file?: File): Promise<Category> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    if (data.description) formData.append("description", data.description);
    if (data.is_active !== undefined) formData.append("is_active", String(data.is_active));
    if (data.display_order !== undefined) formData.append("display_order", String(data.display_order));
    
    if (file) {
      formData.append("file", file);
    }

    const response = await apiClient.post<Category>("/api/v1/categories/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /** Create multiple categories in bulk */
  createCategoriesBulk: async (categories: CategoryCreateInput[]): Promise<Category[]> => {
    const response = await apiClient.post<Category[]>("/api/v1/categories/bulk", categories);
    return response.data;
  },

  // ==========================================
  // 3. UPDATING ENDPOINTS [Admin Only]
  // ==========================================

  /** Fully update a category */
  updateCategoryFull: async (id: number, data: CategoryCreateInput): Promise<Category> => {
    const response = await apiClient.put<Category>(`/api/v1/categories/${id}`, data);
    return response.data;
  },

  /** Partially update a category */
  updateCategoryPartial: async (id: number, data: CategoryCreateInput): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/api/v1/categories/${id}`, data);
    return response.data;
  },

  /** Update display order for multiple categories at once */
  reorderCategories: async (items: CategoryReorderItem[]): Promise<{ message: string }> => {
    const response = await apiClient.patch("/api/v1/categories/reorder", items);
    return response.data;
  },

  // ==========================================
  // 4. MANAGEMENT & UTILITIES [Admin Only]
  // ==========================================

  /** Toggle a category's active/inactive status */
  toggleCategoryStatus: async (id: number): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/api/v1/categories/${id}/status`);
    return response.data;
  },

  /** Upload or update a category icon/image file */
  uploadCategoryImage: async (id: number, file: File): Promise<Category> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<Category>(`/api/v1/categories/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // ==========================================
  // 5. DELETION ENDPOINTS [Admin Only]
  // ==========================================

  /** Delete a single category */
  deleteCategory: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/categories/${id}`);
  },

  /** Delete multiple selected categories in bulk */
  deleteCategoriesBulk: async (ids: number[]): Promise<{ message: string }> => {
    const response = await apiClient.delete("/api/v1/categories/bulk", {
      data: { ids },
    });
    return response.data;
  },

  /** Delete all categories */
  deleteAllCategories: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete("/api/v1/categories/");
    return response.data;
  },
};