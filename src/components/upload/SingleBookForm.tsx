import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookMetadataForm, BookFormData } from "./BookMetadataForm";
import { ProgressBar } from "./ProgressBar";
import { UploadResult } from "./UploadResult";
import { computeFileMd5, autofillBookFields, FILE_TYPES } from "./utils";
import { FileDropField } from "./FileDropField";
import { BookPreview, CoverPreview } from "./FilePreview";
import { Card } from "@/components/ui/card";
import { Minus } from "lucide-react";

interface SingleBookFormProps {
  onSubmit: (formData: FormData) => Promise<{ success?: boolean; error?: string; md5?: string }>;
}

// 100MB in bytes
const MAX_FILE_SIZE = 100 * 1024 * 1024;

export function SingleBookForm({}: SingleBookFormProps) {
  const [form, setForm] = useState<BookFormData & { file?: File; cover?: File }>({
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

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success?: boolean; error?: string; md5?: string } | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [autofillLoading, setAutofillLoading] = useState(false);
  const [isFileTooLarge, setIsFileTooLarge] = useState(false);
  const [isCoverTooLarge, setIsCoverTooLarge] = useState(false);

  const handleChange = (field: keyof BookFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleFileTypeChange = (value: string) => {
    setForm((f) => ({ ...f, book_filetype: value }));
  };

  // Handle book file upload
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

  // Handle cover image upload
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

  // Remove cover image
  const handleRemoveCover = () => {
    setCoverPreview(null);
    setForm((f) => ({ ...f, cover: undefined }));
    setIsCoverTooLarge(false);
  };

  // Remove book file
  const handleRemoveBook = () => {
    setFilePreview(null);
    setForm((f) => ({ ...f, file: undefined }));
    setIsFileTooLarge(false);
  };

  // Autofill metadata from server
  const handleAutofill = async () => {
    if (!form.file) return;
    setAutofillLoading(true);
    const md5 = await computeFileMd5(form.file);
    const data = await autofillBookFields(md5);
    setAutofillLoading(false);
    if (data) {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        file_source: (data as any).file_source || f.file_source,
        cid: data.cid || f.cid,
      }));
      if (data.book_image || data.external_cover_url) {
        setCoverPreview(data.book_image || data.external_cover_url || null);
      }
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setUploading(true);
    setProgress(0);
    try {
      const data = new FormData();
      if (!form.file || !form.title || !form.author || !form.book_filetype) {
        setResult({ error: "Please fill all required fields." });
        setUploading(false);
        return;
      }
      data.append("file", form.file);
      if (form.cover) data.append("cover", form.cover);
      data.append("title", form.title);
      data.append("author", form.author);
      data.append("book_filetype", form.book_filetype);
      if (form.description) data.append("description", form.description);
      if (form.publisher) data.append("publisher", form.publisher);
      if (form.year) data.append("year", form.year);
      if (form.book_lang) data.append("book_lang", form.book_lang);
      if (form.isbn) data.append("isbn", form.isbn);
      if (form.file_source) data.append("file_source", form.file_source);
      if (form.cid) data.append("cid", form.cid);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://backend.bookracy.ru/upload");
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) setProgress(Math.round((evt.loaded / evt.total) * 100));
      };
      xhr.onload = () => {
        setUploading(false);
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && res.success) {
            setResult({ success: true, md5: res.md5 });
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
          } else {
            setResult({ error: res.error || "Upload failed." });
          }
        } catch {
          setResult({ error: "Unexpected server response." });
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        setResult({ error: "Network error." });
      };
      xhr.send(data);
    } catch {
      setUploading(false);
      setResult({ error: "Unexpected error." });
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
                    disabled={uploading}
                    title="Remove book file"
                  >
                    <Minus size={14} />
                  </button>
                )}
                <FileDropField
                  label="Upload your book file (EPUB, PDF, etc.)"
                  acceptedTypes={FILE_TYPES}
                  disabled={uploading}
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
                    disabled={uploading}
                    title="Remove cover image"
                  >
                    <Minus size={14} />
                  </button>
                )}
                <FileDropField
                  label="Upload cover image (JPG, PNG)"
                  acceptedTypes={["jpg", "jpeg", "png", "gif", "webp"]}
                  disabled={uploading}
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
                  <Button type="button" size="sm" variant="outline" onClick={handleAutofill} loading={autofillLoading} disabled={uploading || !form.file}>
                    Autofill Metadata
                  </Button>
                )}
                {autofillLoading && <div className="pt-2 text-xs text-muted-foreground">Looking up metadata...</div>}
              </div>
            </div>
            <BookMetadataForm data={form} onChange={handleChange} onFileTypeChange={handleFileTypeChange} disabled={uploading} fileTypes={FILE_TYPES} />
          </Card>
        </div>
      </div>

      {uploading && <ProgressBar progress={progress} />}
      <UploadResult result={result} />

      <Button type="submit" className="mt-2 w-full" loading={uploading} disabled={uploading || !form.file || isFileTooLarge || isCoverTooLarge}>
        {isFileTooLarge ? "Book File Too Large (Max 100MB)" : isCoverTooLarge ? "Cover Image Too Large (Max 100MB)" : "Upload Book"}
      </Button>
    </form>
  );
}
