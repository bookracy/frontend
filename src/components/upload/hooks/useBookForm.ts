import { useState } from "react";
import { BookFormData } from "../BookMetadataForm";

export interface BookFormState extends BookFormData {
  file?: File;
  cover?: File;
}

export const useBookForm = (initialState?: Partial<BookFormState>) => {
  const [form, setForm] = useState<BookFormState>({
    file: undefined,
    cover: undefined,
    title: "",
    author: "",
    book_filetype: "",
    description: "",
    publisher: "",
    year: "",
    book_lang: "",
    isbn: "",
    file_source: "",
    cid: "",
    ...initialState,
  });

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);
  const [isCoverTooLarge, setIsCoverTooLarge] = useState(false);

  // 100MB in bytes
  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  const handleChange = (field: keyof BookFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleFileTypeChange = (value: string) => {
    setForm((f) => ({ ...f, book_filetype: value }));
  };

  const handleBookFileChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const fileType = file.name.split(".").pop()?.toLowerCase() || "";

      // Check if file is too large
      const isTooLarge = file.size > MAX_FILE_SIZE;
      setIsFileTooLarge(isTooLarge);

      setForm((f) => ({
        ...f,
        file,
        book_filetype: fileType,
      }));
      setFilePreview(`${file.name}`);
    }
  };

  const handleCoverChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      // Check if cover is too large
      const isTooLarge = file.size > MAX_FILE_SIZE;
      setIsCoverTooLarge(isTooLarge);

      setForm((f) => ({ ...f, cover: file }));
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setForm((f) => ({ ...f, cover: undefined }));
    setIsCoverTooLarge(false);
  };

  const handleRemoveBook = () => {
    setFilePreview(null);
    setForm((f) => ({ ...f, file: undefined }));
    setIsFileTooLarge(false);
  };

  const resetForm = () => {
    setForm({
      file: undefined,
      cover: undefined,
      title: "",
      author: "",
      book_filetype: "",
      description: "",
      publisher: "",
      year: "",
      book_lang: "",
      isbn: "",
      file_source: "",
      cid: "",
    });
    setCoverPreview(null);
    setFilePreview(null);
    setIsFileTooLarge(false);
    setIsCoverTooLarge(false);
  };

  return {
    form,
    setForm,
    coverPreview,
    setCoverPreview,
    filePreview,
    isFileTooLarge,
    isCoverTooLarge,
    handleChange,
    handleFileTypeChange,
    handleBookFileChange,
    handleCoverChange,
    handleRemoveCover,
    handleRemoveBook,
    resetForm,
  };
};
