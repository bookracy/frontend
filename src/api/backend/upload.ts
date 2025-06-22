import { UploadForm } from "@/routes/upload";
import { useAuthStore } from "@/stores/auth";
import { useSettingsStore } from "@/stores/settings";

export type UploadResponse = {
  message: string;
  book_id?: string;
};

export const createFormDataFromBook = (book: UploadForm["books"][number]): FormData => {
  const data = new FormData();

  if (book.file) data.append("file", book.file);
  if (book.coverImage) data.append("cover", book.coverImage);

  data.append("title", book.title);
  data.append("author", book.author);
  data.append("book_filetype", book.fileType);

  if (book.description) data.append("description", book.description);
  if (book.publisher) data.append("publisher", book.publisher);
  if (book.year) data.append("year", book.year.toString());
  if (book.language) data.append("book_lang", book.language);
  if (book.isbn) data.append("isbn", book.isbn);
  if (book.fileSource) data.append("file_source", book.fileSource);
  if (book.contentId) data.append("cid", book.contentId);

  return data;
};

export const uploadBook = async (formData: FormData, onProgress?: (progress: number) => void): Promise<UploadResponse> => {
  const backendURL = useSettingsStore.getState().backendURL;
  const accessToken = useAuthStore.getState().accessToken;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress?.(progress);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          resolve({ message: "Upload successful" });
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    xhr.open("POST", `${backendURL}/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);

    xhr.send(formData);
  });
};

export const uploadBooks = async (books: UploadForm["books"], onProgress?: (completed: number, total: number, currentBookProgress: number) => void): Promise<UploadResponse[]> => {
  const results: UploadResponse[] = [];

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const formData = createFormDataFromBook(book);

    try {
      const result = await uploadBook(formData, (bookProgress) => {
        const completedBooks = i;
        const currentBookContribution = bookProgress / 100;
        const overallProgress = ((completedBooks + currentBookContribution) / books.length) * 100;

        onProgress?.(completedBooks + 1, books.length, overallProgress);
      });

      results.push(result);
    } catch (error) {
      onProgress?.(i + 1, books.length, ((i + 1) / books.length) * 100);
      throw error;
    }
  }

  return results;
};
