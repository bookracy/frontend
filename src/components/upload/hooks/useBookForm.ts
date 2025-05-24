import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormData } from "../BookMetadataForm";

export interface BookFormState extends BookFormData {
  file?: File;
  cover?: File;
}

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  book_filetype: z.string().min(1, "File type is required"),
  description: z.string().optional(),
  publisher: z.string().optional(),
  year: z.string().optional(),
  book_lang: z.string().optional(),
  isbn: z.string().optional(),
  file_source: z.string().optional(),
  cid: z.string().optional(),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;

export const useBookForm = (initialState?: Partial<BookFormState>) => {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: initialState?.title || "",
      author: initialState?.author || "",
      book_filetype: initialState?.book_filetype || "",
      description: initialState?.description || "",
      publisher: initialState?.publisher || "",
      year: initialState?.year || "",
      book_lang: initialState?.book_lang || "",
      isbn: initialState?.isbn || "",
      file_source: initialState?.file_source || "",
      cid: initialState?.cid || "",
    },
    mode: "onChange",
  });

  // Additional state for file handling (not managed by react-hook-form)
  const [file, setFile] = useState<File | undefined>(initialState?.file);
  const [cover, setCover] = useState<File | undefined>(initialState?.cover);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);
  const [isCoverTooLarge, setIsCoverTooLarge] = useState(false);

  // 100MB in bytes
  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  const handleChange = (field: keyof BookFormValues, value: string) => {
    // Update the form field with the new value
    form.setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleFileTypeChange = (value: string) => {
    form.setValue("book_filetype", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleBookFileChange = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      const fileType = selectedFile.name.split(".").pop()?.toLowerCase() || "";

      // Check if file is too large
      const isTooLarge = selectedFile.size > MAX_FILE_SIZE;
      setIsFileTooLarge(isTooLarge);

      setFile(selectedFile);
      form.setValue("book_filetype", fileType, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      setFilePreview(`${selectedFile.name}`);
    }
  };

  const handleCoverChange = (files: File[]) => {
    if (files.length > 0) {
      const selectedCover = files[0];

      // Check if cover is too large
      const isTooLarge = selectedCover.size > MAX_FILE_SIZE;
      setIsCoverTooLarge(isTooLarge);

      setCover(selectedCover);
      setCoverPreview(URL.createObjectURL(selectedCover));
    }
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setCover(undefined);
    setIsCoverTooLarge(false);
  };

  const handleRemoveBook = () => {
    setFilePreview(null);
    setFile(undefined);
    form.setValue("book_filetype", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setIsFileTooLarge(false);
  };

  const resetForm = () => {
    form.reset({
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
    setFile(undefined);
    setCover(undefined);
    setCoverPreview(null);
    setFilePreview(null);
    setIsFileTooLarge(false);
    setIsCoverTooLarge(false);
  };

  return {
    form,
    file,
    cover,
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
