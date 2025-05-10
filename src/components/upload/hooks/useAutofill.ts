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

// Possible outcomes of an autofill attempt
export type AutofillOutcome = { status: "success"; data: ExtendedBookItem; index: number } | { status: "empty"; index: number } | { status: "error"; error: unknown; index: number };

export const useAutofill = (onResult: (outcome: AutofillOutcome) => void) => {
  return useMutation({
    mutationFn: async (params: AutofillParams) => {
      const md5 = await computeFileMd5(params.file);

      // Look up the book by its MD5 hash
      const res = await client<{ results: BookItem[] }>("/books", {
        query: { query: md5, limit: 1 },
      });

      // Check if we got any results
      if (!res.results || res.results.length === 0) {
        return {
          status: "empty" as const,
          index: params.index,
        };
      }

      // We have results, check if they contain useful data
      const bookData = res.results[0] as ExtendedBookItem;

      return {
        status: "success" as const,
        data: bookData,
        index: params.index,
      };
    },
    onSuccess: (result) => {
      onResult(result as AutofillOutcome);
    },
    onError: (error: unknown, params: AutofillParams) => {
      onResult({
        status: "error",
        error,
        index: params.index,
      });
    },
  });
};
