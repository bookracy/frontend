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
}

export const useAutofill = (onSuccess: (data: ExtendedBookItem) => void) => {
  return useMutation({
    mutationFn: async (params: AutofillParams) => {
      const md5 = await computeFileMd5(params.file);
      const data = await autofillBookFields(md5, params.file.name);
      return { data, index: params.index };
    },
    onSuccess: (result: AutofillResult) => {
      if (result.data) {
        onSuccess(result.data);
      }
    },
  });
};
