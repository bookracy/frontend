import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookFormState } from "./useBookForm";

export interface UploadResult {
  success?: boolean;
  error?: string;
  md5?: string;
}

export const useBookUpload = (onProgressUpdate: (progress: number) => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: BookFormState): Promise<UploadResult> => {
      if (!formData.file || !formData.title || !formData.author || !formData.book_filetype) {
        return { success: false, error: "Please fill all required fields." };
      }

      const data = new FormData();
      data.append("file", formData.file);
      if (formData.cover) data.append("cover", formData.cover);
      data.append("title", formData.title);
      data.append("author", formData.author);
      data.append("book_filetype", formData.book_filetype);
      if (formData.description) data.append("description", formData.description);
      if (formData.publisher) data.append("publisher", formData.publisher);
      if (formData.year) data.append("year", formData.year);
      if (formData.book_lang) data.append("book_lang", formData.book_lang);
      if (formData.isbn) data.append("isbn", formData.isbn);
      if (formData.file_source) data.append("file_source", formData.file_source);
      if (formData.cid) data.append("cid", formData.cid);

      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://backend.bookracy.ru/upload");
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            onProgressUpdate(Math.round((evt.loaded / evt.total) * 100));
          }
        };
        xhr.onload = () => {
          try {
            const res = JSON.parse(xhr.responseText);
            if (xhr.status === 200 && res.success) {
              resolve({ success: true, md5: res.md5 });
            } else {
              resolve({ success: false, error: res.error || "Upload failed." });
            }
          } catch {
            resolve({ success: false, error: "Unexpected server response." });
          }
        };
        xhr.onerror = () => {
          resolve({ success: false, error: "Network error." });
        };
        xhr.send(data);
      });
    },
    onSuccess: () => {
      // Invalidate any relevant queries that should be refreshed
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
};
