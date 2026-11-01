const API_BASE = '/api';

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface Recipe {
  id: number;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
  createdAt: number;
}

export interface Tag {
  id: number;
  name: string;
}

export interface RecipePayload {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  prepTime: number | null;
  cookTime: number | null;
  servings: number | null;
}

export const api = {
  recipes: {
    list: (params?: { tagIds?: number[]; ingredient?: string; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.tagIds?.length) searchParams.append('tagIds', params.tagIds.join(','));
      if (params?.ingredient) searchParams.append('ingredient', params.ingredient);
      if (params?.search) searchParams.append('search', params.search);
      const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
      return fetchApi<Recipe[]>(`/recipes${query}`);
    },
    get: (id: number) => fetchApi<Recipe>(`/recipes/${id}`),
    create: (data: RecipePayload) => fetchApi<{ id: number }>('/recipes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: RecipePayload) => fetchApi<Recipe>(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/recipes/${id}`, { method: 'DELETE' }),
  },
  tags: {
    list: () => fetchApi<Tag[]>('/tags'),
    create: (name: string) => fetchApi<Tag>('/tags', { method: 'POST', body: JSON.stringify({ name }) }),
    delete: (id: number) => fetchApi<{ success: boolean }>(`/tags/${id}`, { method: 'DELETE' }),
  },
};