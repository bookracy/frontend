import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { BookFormState } from "./useBookForm";
import { useUploadService } from "./useUploadService";

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
  const { uploadMultipleBooks } = useUploadService();

  // Update form data when files prop changes
  useEffect(() => {
    setBulkForm(createFormDataFromFiles(files));
    setBulkProgress(Array(files.length).fill(0));
  }, [files]);

  // Mutation for uploading all books in sequence
  const bulkUploadMutation = useMutation({
    mutationFn: async () => {
      // Initialize progress at 0 for all books
      setBulkProgress(Array(bulkForm.length).fill(0));

      // Use the uploadMultipleBooks function with progress tracking
      return uploadMultipleBooks(bulkForm, (index, progress) => {
        setBulkProgress((prev) => prev.map((p, idx) => (idx === index ? progress : p)));
      });
    },
    onSuccess: (results) => {
      // Check if all uploads were successful and clear the form
      const allSuccessful = results.every((result) => result.success);
      if (allSuccessful) {
        setBulkForm([]);
        onClearFiles();
      }
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
