import { useMutation } from "@tanstack/react-query";
import { BookFormState } from "./useBookForm";
import { UploadResult, useUploadService } from "./useUploadService";

export type { UploadResult } from "./useUploadService";

export const useBookUpload = (onProgressUpdate: (progress: number) => void) => {
  const { uploadSingleBook } = useUploadService();

  return useMutation({
    mutationFn: async (formData: BookFormState): Promise<UploadResult> => {
      return uploadSingleBook(formData, onProgressUpdate);
    },
  });
};
