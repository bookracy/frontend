import { useMutation } from "@tanstack/react-query";
import { computeFileMd5 } from "./utils";
import { BookItem } from "@/api/backend/types";
import { client } from "@/api/backend/base";
import { scrapeMetadataFromFilename, refineMetadata } from "./useMetadataScraper";

interface AutofillParams {
  file: File;
  index: number;
}

// Extended type for BookItem with additional properties
export interface ExtendedBookItem extends Partial<BookItem> {
  file_source?: string;
}

// Fetch book metadata from server
export async function autofillBookFields(md5: string, filename: string): Promise<ExtendedBookItem | null> {
  try {
    // Try server lookup first
    const res = await client<{ results: BookItem[] }>("/books", {
      query: { query: md5, limit: 1 },
    });
    
    if (res.results && res.results.length > 0) {
      return res.results[0] as ExtendedBookItem;
    }
    
    // If server lookup fails, fall back to filename-based scraping
    const basicMetadata = scrapeMetadataFromFilename(filename);
    const enhancedMetadata = refineMetadata(filename, basicMetadata);
    
    if (Object.keys(enhancedMetadata).length > 0) {
      return enhancedMetadata;
    }
    
    return null;
  } catch {
    // On server error, attempt filename-based scraping
    const basicMetadata = scrapeMetadataFromFilename(filename);
    const enhancedMetadata = refineMetadata(filename, basicMetadata);
    
    if (Object.keys(enhancedMetadata).length > 0) {
      return enhancedMetadata;
    }
    
    return null;
  }
}

interface AutofillResult {
  data: ExtendedBookItem | null;
  index: number;
  isFromAPI: boolean;
}

export const useAutofill = (onSuccess: (data: ExtendedBookItem, error?: unknown, isFromAPI?: boolean) => void) => {
  return useMutation({
    mutationFn: async (params: AutofillParams) => {
      const md5 = await computeFileMd5(params.file);
      let data: ExtendedBookItem | null = null;
      let isFromAPI = false;
      
      try {
        // Try server lookup first
        const res = await client<{ results: BookItem[] }>("/books", {
          query: { query: md5, limit: 1 },
        });
        
        if (res.results && res.results.length > 0) {
          data = res.results[0] as ExtendedBookItem;
          isFromAPI = true;
          return { data, index: params.index, isFromAPI };
        }
        
        // If server lookup fails but no error thrown, fall back to filename-based scraping
        const basicMetadata = scrapeMetadataFromFilename(params.file.name);
        data = refineMetadata(params.file.name, basicMetadata);
        return { data, index: params.index, isFromAPI: false };
      } catch (error) {
        // On server error, attempt filename-based scraping
        const basicMetadata = scrapeMetadataFromFilename(params.file.name);
        data = refineMetadata(params.file.name, basicMetadata);
        return { data, index: params.index, isFromAPI: false };
      }
    },
    onSuccess: (result: AutofillResult) => {
      if (result.data) {
        onSuccess(result.data, undefined, result.isFromAPI);
      }
    },
    onError: (error: unknown) => {
      onSuccess({} as ExtendedBookItem, error, false);
    },
  });
};
