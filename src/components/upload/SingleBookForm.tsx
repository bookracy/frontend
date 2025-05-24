import { Button } from "@/components/ui/button";
import { BookMetadataForm } from "./BookMetadataForm";
import { ProgressBar } from "./UploadProgressBar";
import { UploadResult } from "./UploadResult";
import { FILE_TYPES } from "./hooks/utils";
import { FileDropField } from "./FileDropField";
import { BookPreview, CoverPreview } from "./FilePreview";
import { Card } from "@/components/ui/card";
import { Minus } from "lucide-react";
import { useBookForm, BookFormValues } from "./hooks/useBookForm";
import { useAutofill, AutofillOutcome } from "./hooks/useAutofill";
import { useBookUpload } from "./hooks/useBookUpload";
import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";

interface SingleBookFormProps {
  onSubmit?: (formData: FormData) => Promise<{ success?: boolean; error?: string; md5?: string }>;
}

export function SingleBookForm({ onSubmit }: SingleBookFormProps) {
  const {
    form,
    file,
    cover,
    coverPreview,
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
    setCoverPreview,
  } = useBookForm();

  const [formValues, setFormValues] = useState(form.getValues());

  // Keep formValues in sync with form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setFormValues(form.getValues());
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success?: boolean; error?: string; md5?: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Autofill mutation for individual books
  const autofillMutation = useAutofill((outcome: AutofillOutcome) => {
    if (outcome.status === "success") {
      const data = outcome.data;
      const currentValues = form.getValues();
      form.setValue("title", data.title || currentValues.title);
      form.setValue("author", data.author || currentValues.author);
      form.setValue("book_filetype", data.book_filetype || currentValues.book_filetype);
      form.setValue("description", data.description || currentValues.description || "");
      form.setValue("publisher", data.publisher || currentValues.publisher || "");
      form.setValue("year", data.year || currentValues.year || "");
      form.setValue("book_lang", data.book_lang || currentValues.book_lang || "");
      form.setValue("isbn", data.isbn || currentValues.isbn || "");
      form.setValue("file_source", data.file_source || currentValues.file_source || "");
      form.setValue("cid", data.cid || currentValues.cid || "");

      if (data.book_image || data.external_cover_url) {
        setCoverPreview(data.book_image || data.external_cover_url || null);
      }
    }
  });

  // Upload mutation
  const uploadMutation = useBookUpload(setProgress);

  const handleAutofill = async () => {
    if (!file) return;
    autofillMutation.mutate({ file, index: 0 });
  };

  const handleBookFileWithResultClear = (files: File[]) => {
    setResult(null);
    handleBookFileChange(files);
  };

  const handleFieldChange = (field: string, value: string) => {
    handleChange(field as keyof BookFormValues, value);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await form.trigger();
    if (!isValid) {
      return;
    }

    setResult(null);
    setProgress(0);
    setIsUploading(true);

    let result;

    try {
      if (onSubmit) {
        const formData = new FormData();
        const currentValues = form.getValues();

        // Add form values to FormData
        Object.entries(currentValues).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            formData.append(key, String(value));
          }
        });

        // Add files to FormData
        if (file) formData.append("file", file);
        if (cover) formData.append("cover", cover);

        result = await onSubmit(formData);
      } else {
        // Create a combined object for the uploadMutation
        const currentValues = form.getValues();
        const bookData = {
          ...currentValues,
          description: currentValues.description || "",
          publisher: currentValues.publisher || "",
          year: currentValues.year || "",
          book_lang: currentValues.book_lang || "",
          isbn: currentValues.isbn || "",
          file_source: currentValues.file_source || "",
          cid: currentValues.cid || "",
          file,
          cover,
        };

        result = await uploadMutation.mutateAsync(bookData);
      }

      setResult(result);

      if (result.success) {
        resetForm();
      }
    } catch (error) {
      setResult({ success: false, error: error instanceof Error ? error.message : "Upload failed" });
    } finally {
      setIsUploading(false);
    }
  };

  // Ensure all potentially undefined values have fallbacks for BookMetadataForm to prevent errors
  const bookFormData = {
    title: formValues.title,
    author: formValues.author,
    book_filetype: formValues.book_filetype,
    description: formValues.description || "",
    publisher: formValues.publisher || "",
    year: formValues.year || "",
    book_lang: formValues.book_lang || "",
    isbn: formValues.isbn || "",
    file_source: formValues.file_source || "",
    cid: formValues.cid || "",
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left column - Upload Cards */}
          <div className="h-full md:col-span-1">
            <Card className="flex h-full flex-col overflow-hidden border shadow">
              <div className="flex h-full flex-col">
                {/* Book File Uploader */}
                <div className="relative flex-1 p-4">
                  {file && (
                    <button
                      type="button"
                      className="absolute right-7 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveBook();
                        setResult(null);
                      }}
                      disabled={uploadMutation.isPending || isUploading}
                      title="Remove book file"
                    >
                      <Minus size={14} />
                    </button>
                  )}
                  <FileDropField
                    label="Upload your book file (EPUB, PDF, etc.)"
                    acceptedTypes={FILE_TYPES}
                    disabled={uploadMutation.isPending || isUploading}
                    onFilesSelected={handleBookFileWithResultClear}
                    icon="📚"
                    previewComponent={
                      file && filePreview ? <BookPreview fileName={file.name} fileSize={file.size} fileType={formValues.book_filetype || file.name.split(".").pop() || ""} /> : undefined
                    }
                    isFileTooLarge={isFileTooLarge}
                  />
                </div>

                {/* Cover Image Uploader */}
                <div className="relative flex-1 p-4">
                  {coverPreview && (
                    <button
                      type="button"
                      className="absolute right-7 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCover();
                      }}
                      disabled={uploadMutation.isPending || isUploading}
                      title="Remove cover image"
                    >
                      <Minus size={14} />
                    </button>
                  )}
                  <FileDropField
                    label="Upload cover image (JPG, PNG)"
                    acceptedTypes={["jpg", "jpeg", "png", "gif", "webp"]}
                    disabled={uploadMutation.isPending || isUploading}
                    onFilesSelected={handleCoverChange}
                    icon="🖼️"
                    previewComponent={coverPreview ? <CoverPreview imageUrl={coverPreview} /> : undefined}
                    isFileTooLarge={isCoverTooLarge}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right column - Metadata Form */}
          <div className="md:col-span-2">
            <Card className="border p-6 shadow">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Book Details</h2>
                <div>
                  {file && (
                    <Button type="button" size="sm" variant="outline" onClick={handleAutofill} loading={autofillMutation.isPending} disabled={uploadMutation.isPending || isUploading || !file}>
                      Autofill Metadata
                    </Button>
                  )}
                  {autofillMutation.isPending && <div className="pt-2 text-xs text-muted-foreground">Looking up metadata...</div>}
                </div>
              </div>
              <BookMetadataForm data={bookFormData} onChange={handleFieldChange} onFileTypeChange={handleFileTypeChange} disabled={uploadMutation.isPending || isUploading} fileTypes={FILE_TYPES} />
            </Card>
          </div>
        </div>

        {(uploadMutation.isPending || isUploading) && <ProgressBar progress={progress} />}
        <UploadResult result={result} />

        <Button
          type="submit"
          className="mt-2 w-full"
          loading={uploadMutation.isPending || isUploading}
          disabled={uploadMutation.isPending || isUploading || !file || isFileTooLarge || isCoverTooLarge}
        >
          {isFileTooLarge ? "Book File Too Large (Max 100MB)" : isCoverTooLarge ? "Cover Image Too Large (Max 100MB)" : "Upload Book"}
        </Button>
      </form>
    </Form>
  );
}
