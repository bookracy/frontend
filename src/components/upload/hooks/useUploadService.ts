import { useSettingsStore } from "@/stores/settings";
import { BookFormState } from "./useBookForm";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";

export interface UploadResult {
  success?: boolean;
  error?: string;
  md5?: string;
}

/**
 * Create FormData from book metadata
 */
export const createFormDataFromBook = (formData: BookFormState): FormData => {
  const data = new FormData();
  data.append("file", formData.file as File);
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
  return data;
};

/**
 * Validate book data
 */
export const validateBookData = (formData: BookFormState): boolean => {
  return !!(formData.file && formData.title && formData.author && formData.book_filetype);
};

// Handle uploads
export const useUploadService = () => {
  const backendURL = useSettingsStore.getState().backendURL;
  const queryClient = useQueryClient();
  const accessToken = useAuthStore.getState().accessToken;

  /**
   * Upload a single book and track progress
   */
  const uploadSingleBook = async (formData: BookFormState, onProgressUpdate?: (progress: number) => void): Promise<UploadResult> => {
    // Validate required fields
    if (!validateBookData(formData)) {
      return { success: false, error: "Please fill all required fields." };
    }

    // Create form data
    const data = createFormDataFromBook(formData);

    // Upload with progress tracking
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${backendURL}/upload`);

      if (accessToken) {
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      }

      if (onProgressUpdate) {
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            onProgressUpdate(Math.round((evt.loaded / evt.total) * 100));
          }
        };
      }

      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && res.success) {
            queryClient.invalidateQueries({ queryKey: ["books"] });
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
  };

  /**
   * Upload multiple books in sequence
   */
  const uploadMultipleBooks = async (books: BookFormState[], onProgressUpdate?: (index: number, progress: number) => void): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];

    for (let i = 0; i < books.length; i++) {
      const formData = books[i];

      // Create a progress handler for this specific upload
      const handleProgress = (progress: number) => {
        if (onProgressUpdate) {
          onProgressUpdate(i, progress);
        }
      };

      try {
        // Validate required fields
        if (!validateBookData(formData)) {
          results.push({
            success: false,
            error: `Missing required fields for file ${formData.file?.name}`,
          });
          continue;
        }

        const result = await uploadSingleBook(formData, handleProgress);
        results.push(result);
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Invalidate queries after all uploads
    if (results.some((result) => result.success)) {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    }

    return results;
  };

  return {
    uploadSingleBook,
    uploadMultipleBooks,
  };
};
