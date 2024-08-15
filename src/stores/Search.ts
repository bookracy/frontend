// src/stores/Search.ts
export const BACKEND_URL = "https://backend.bookracy.org";

export interface SearchResultItem {
  id: string;
  title: string;
  book_image?: string;
  authors: string[] | string;
  description?: string;
  link?: string;
}

// Optimized fetch function with caching
export const fetchSearchResults = (() => {
  const cache: { [key: string]: SearchResultItem[] } = {};
  return async (query: string, booksPerSearch: number): Promise<SearchResultItem[]> => {
    const cacheKey = `${query}-${booksPerSearch}`;
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/books?query=${query}&limit=${booksPerSearch}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: { results: SearchResultItem[] } = await response.json();
      cache[cacheKey] = data.results || [];
      return cache[cacheKey];
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };
})();
