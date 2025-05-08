import { useMutation } from "@tanstack/react-query";
import { computeFileMd5 } from "./utils";
import { BookItem } from "@/api/backend/types";
import { client } from "@/api/backend/base";

interface AutofillParams {
  file: File;
  index: number;
}

// Fetch book metadata from server
export async function autofillBookFields(md5: string): Promise<Partial<BookItem> | null> {
  try {
    const res = await client<{ results: BookItem[] }>("/books", {
      query: { query: md5, limit: 1 },
    });
    if (res.results && res.results.length > 0) return res.results[0];
    return null;
  } catch {
    return null;
  }
}

export const useAutofill = (onSuccess: (data: any) => void) => {
  return useMutation({
    mutationFn: async (params: AutofillParams) => {
      const md5 = await computeFileMd5(params.file);
      const data = await autofillBookFields(md5);
      return { data, index: params.index };
    },
    onSuccess: (result) => {
      if (result.data) {
        onSuccess(result.data);
      }
    },
  });
};
