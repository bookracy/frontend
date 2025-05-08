import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookFormState } from "./useBookForm";
import { UploadResult } from "./useBookUpload";

const createFormDataFromFiles = (files: File[]): BulkBookForm[] => {
  return files.map((file) => ({
    file,
    cover: undefined,
    coverPreview: null,
    title: "",
    author: "",
    book_filetype: file.name.split(".").pop()?.toLowerCase() || "",
    description: "",
    publisher: "",
    year: "",
    book_lang: "",
    isbn: "",
    file_source: "",
    cid: "",
  }));
};

export interface BulkBookForm extends BookFormState {
  coverPreview?: string | null;
}

export const useBulkUpload = (files: File[], onClearFiles: () => void) => {
  // Initialize form empty data
  const [bulkForm, setBulkForm] = useState<BulkBookForm[]>(() => createFormDataFromFiles(files));
  const [bulkProgress, setBulkProgress] = useState<number[]>([]);
  const queryClient = useQueryClient();

  // Update form data when files prop changes
  useEffect(() => {
    setBulkForm(createFormDataFromFiles(files));
    setBulkProgress(Array(files.length).fill(0));
  }, [files]);

  // Mutation for uploading all books in sequence
  const bulkUploadMutation = useMutation({
    mutationFn: async () => {
      const results: UploadResult[] = [];

      // Initialize progress at 0 for all books
      setBulkProgress(Array(bulkForm.length).fill(0));

      for (let i = 0; i < bulkForm.length; i++) {
        const formData = bulkForm[i];

        // Create a progress handler for this specific upload
        const handleProgress = (progress: number) => {
          setBulkProgress((prev) => prev.map((p, idx) => (idx === i ? progress : p)));
        };

        try {
          // Validate required fields
          if (!formData.file || !formData.title || !formData.author || !formData.book_filetype) {
            results.push({
              success: false,
              error: `Missing required fields for file ${formData.file?.name}`,
            });
            continue;
          }

          // Use direct XMLHttpRequest for progress tracking per file
          const result = await new Promise<UploadResult>((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://backend.bookracy.ru/upload");

            xhr.upload.onprogress = (evt) => {
              if (evt.lengthComputable) {
                handleProgress(Math.round((evt.loaded / evt.total) * 100));
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

            // Prepare the form data
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

            xhr.send(data);
          });

          results.push(result);
        } catch (error) {
          results.push({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      return results;
    },
    onSuccess: (results) => {
      // Check if all uploads were successful and clear the form
      const allSuccessful = results.every((result) => result.success);
      if (allSuccessful) {
        setBulkForm([]);
        onClearFiles();
      }

      // Invalidate any relevant queries that should be refreshed
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleBulkFieldChange = (idx: number, field: keyof BookFormState, value: string) => {
    setBulkForm((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const handleBulkCoverChange = (idx: number, files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setBulkForm((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                cover: file,
                coverPreview: URL.createObjectURL(file),
              }
            : item,
        ),
      );
    } else {
      setBulkForm((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                cover: undefined,
                coverPreview: null,
              }
            : item,
        ),
      );
    }
  };

  return {
    bulkForm,
    setBulkForm,
    bulkProgress,
    handleBulkFieldChange,
    handleBulkCoverChange,
    bulkUploadMutation,
  };
};
