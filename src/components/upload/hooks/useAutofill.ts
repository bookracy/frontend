import { useMutation } from "@tanstack/react-query";
import { computeFileMd5 } from "./utils";
import { BookItem } from "@/api/backend/types";
import { client } from "@/api/backend/base";

interface AutofillParams {
  file: File;
  index: number;
}

// Extended type for BookItem with additional properties
export interface ExtendedBookItem extends Partial<BookItem> {
  file_source?: string;
}

interface AutofillResult {
  data: ExtendedBookItem | null;
  index: number;
  noResults: boolean; // Flag to indicate when results were empty
}

export const useAutofill = (onSuccess: (data: ExtendedBookItem, error?: unknown, noResults?: boolean) => void) => {
  return useMutation({
    mutationFn: async (params: AutofillParams) => {
      const md5 = await computeFileMd5(params.file);
      
      // Look up the book by its MD5 hash
      const res = await client<{ results: BookItem[] }>("/books", {
        query: { query: md5, limit: 1 },
      });
      
      // Check if we got any results
      const noResults = !res.results || res.results.length === 0;
      const data = !noResults ? res.results[0] as ExtendedBookItem : null;
        
      return { data, index: params.index, noResults };
    },
    onSuccess: (result: AutofillResult) => {
      if (result.noResults) {
        // If there were no results, treat it as a "not found" case
        onSuccess({} as ExtendedBookItem, undefined, true);
      } else if (result.data) {
        onSuccess(result.data);
      }
    },
    onError: (error: unknown) => {
      // Pass the error to the callback
      onSuccess({} as ExtendedBookItem, error);
    },
  });
};
