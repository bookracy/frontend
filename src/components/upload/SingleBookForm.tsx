import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookMetadataForm, BookFormData } from "./BookMetadataForm";
import { CoverUploadInput } from "./CoverUploadInput";
import { ProgressBar } from "./ProgressBar";
import { UploadResult } from "./UploadResult";
import { computeFileMd5, autofillBookFields, FILE_TYPES } from "./utils";

interface SingleBookFormProps {
  onSubmit: (formData: FormData) => Promise<{ success?: boolean; error?: string; md5?: string }>;
}

export function SingleBookForm({ onSubmit }: SingleBookFormProps) {
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [autofillLoading, setAutofillLoading] = useState(false);

  const handleChange = (field: keyof BookFormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleFileTypeChange = (value: string) => {
    setForm((f) => ({ ...f, book_filetype: value }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((f) => ({ ...f, file }));
      setFilePreview(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB, ${file.type || file.name.split(".").pop()?.toUpperCase()})`);
    } else {
      setForm((f) => ({ ...f, file: undefined }));
      setFilePreview(null);
    }
  };

  // Handle cover image upload
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm((f) => ({ ...f, cover: file }));
      setCoverPreview(URL.createObjectURL(file));
    } else {
      setForm((f) => ({ ...f, cover: undefined }));
      setCoverPreview(null);
    }
  };

  const handleCoverRemove = () => {
    setCoverPreview(null);
    setForm((f) => ({ ...f, cover: undefined }));
    if (coverInputRef.current) coverInputRef.current.value = "";
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
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (coverInputRef.current) coverInputRef.current.value = "";
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6 pt-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="file">Book File *</Label>
          <Input ref={fileInputRef} id="file" name="file" type="file" accept={FILE_TYPES.map((t) => "." + t).join(",")} required disabled={uploading} onChange={handleFileChange} />
          {filePreview && <div className="mt-2 break-all text-xs text-muted-foreground">{filePreview}</div>}
        </div>
        <CoverUploadInput coverPreview={coverPreview} disabled={uploading} onCoverChange={handleCoverChange} onCoverRemove={handleCoverRemove} />
      </div>

      <BookMetadataForm data={form} onChange={handleChange} onFileTypeChange={handleFileTypeChange} disabled={uploading} fileTypes={FILE_TYPES} />

      <div className="mb-2 flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={handleAutofill} loading={autofillLoading} disabled={uploading || !form.file}>
          Autofill from Bookracy
        </Button>
        {autofillLoading && <span className="text-xs text-muted-foreground">Looking up metadata...</span>}
      </div>

      {uploading && <ProgressBar progress={progress} />}

      <UploadResult result={result} />

      <Button type="submit" className="mt-2 w-full" loading={uploading} disabled={uploading}>
        Upload
      </Button>
    </form>
  );
}
