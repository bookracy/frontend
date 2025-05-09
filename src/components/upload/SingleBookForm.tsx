import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookMetadataForm } from "./BookMetadataForm";
import { ProgressBar } from "./UploadProgressBar";
import { UploadResult } from "./UploadResult";
import { FILE_TYPES } from "./hooks/utils";
import { FileDropField } from "./FileDropField";
import { BookPreview, CoverPreview } from "./FilePreview";
import { Card } from "@/components/ui/card";
import { Minus } from "lucide-react";
import { useBookForm } from "./hooks/useBookForm";
import { useAutofill } from "./hooks/useAutofill";
import { useBookUpload } from "./hooks/useBookUpload";

interface SingleBookFormProps {
  onSubmit?: (formData: FormData) => Promise<{ success?: boolean; error?: string; md5?: string }>;
}

export function SingleBookForm({ onSubmit }: SingleBookFormProps) {
  const {
    form,
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
    setForm,
    setCoverPreview,
  } = useBookForm();

  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success?: boolean; error?: string; md5?: string } | null>(null);

  // Autofill mutation for individual books
  const autofillMutation = useAutofill((data) => {
    setForm((f) => ({
      ...f,
      title: data.title || f.title,
      author: data.author || f.author,
      book_filetype: data.book_filetype || f.book_filetype,
      description: data.description || f.description,
      publisher: data.publisher || f.publisher,
      year: data.year || f.year,
      book_lang: data.book_lang || f.book_lang,
      isbn: data.isbn || f.isbn,
      file_source: data.file_source || f.file_source,
      cid: data.cid || f.cid,
    }));
    if (data.book_image || data.external_cover_url) {
      setCoverPreview(data.book_image || data.external_cover_url || null);
    }
  });

  // Upload mutation
  const uploadMutation = useBookUpload(setProgress);

  // Handle autofill
  const handleAutofill = async () => {
    if (!form.file) return;
    autofillMutation.mutate({ file: form.file, index: 0 });
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setProgress(0);

    let result;
    
    if (onSubmit) {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'file' && key !== 'cover') {
          formData.append(key, String(value));
        }
      });
      if (form.file) formData.append('file', form.file);
      if (form.cover) formData.append('cover', form.cover);
      
      result = await onSubmit(formData);
    } else {
      result = await uploadMutation.mutateAsync(form);
    }

    setResult(result);

    if (result.success) {
      resetForm();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left column - Upload Cards */}
        <div className="h-full md:col-span-1">
          <Card className="flex h-full flex-col overflow-hidden border shadow">
            <div className="flex h-full flex-col">
              {/* Book File Uploader */}
              <div className="relative flex-1 p-4">
                {form.file && (
                  <button
                    type="button"
                    className="absolute right-7 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBook();
                    }}
                    disabled={uploadMutation.isPending}
                    title="Remove book file"
                  >
                    <Minus size={14} />
                  </button>
                )}
                <FileDropField
                  label="Upload your book file (EPUB, PDF, etc.)"
                  acceptedTypes={FILE_TYPES}
                  disabled={uploadMutation.isPending}
                  onFilesSelected={handleBookFileChange}
                  icon="📚"
                  previewComponent={
                    form.file && filePreview ? <BookPreview fileName={form.file.name} fileSize={form.file.size} fileType={form.book_filetype || form.file.name.split(".").pop() || ""} /> : undefined
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
                    disabled={uploadMutation.isPending}
                    title="Remove cover image"
                  >
                    <Minus size={14} />
                  </button>
                )}
                <FileDropField
                  label="Upload cover image (JPG, PNG)"
                  acceptedTypes={["jpg", "jpeg", "png", "gif", "webp"]}
                  disabled={uploadMutation.isPending}
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
                {form.file && (
                  <Button type="button" size="sm" variant="outline" onClick={handleAutofill} loading={autofillMutation.isPending} disabled={uploadMutation.isPending || !form.file}>
                    Autofill Metadata
                  </Button>
                )}
                {autofillMutation.isPending && <div className="pt-2 text-xs text-muted-foreground">Looking up metadata...</div>}
              </div>
            </div>
            <BookMetadataForm data={form} onChange={handleChange} onFileTypeChange={handleFileTypeChange} disabled={uploadMutation.isPending} fileTypes={FILE_TYPES} />
          </Card>
        </div>
      </div>

      {uploadMutation.isPending && <ProgressBar progress={progress} />}
      <UploadResult result={result} />

      <Button type="submit" className="mt-2 w-full" loading={uploadMutation.isPending} disabled={uploadMutation.isPending || !form.file || isFileTooLarge || isCoverTooLarge}>
        {isFileTooLarge ? "Book File Too Large (Max 100MB)" : isCoverTooLarge ? "Cover Image Too Large (Max 100MB)" : "Upload Book"}
      </Button>
    </form>
  );
}
