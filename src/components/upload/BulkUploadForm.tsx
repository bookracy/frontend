import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BulkBookItem } from "./BulkBookItem";
import { BookFormData } from "./BookMetadataForm";
import { computeFileMd5, autofillBookFields, FILE_TYPES } from "./utils";
import { FileDropField } from "./FileDropField";
import { Card } from "@/components/ui/card";

interface BulkBookForm extends BookFormData {
  file: File;
  cover?: File;
  coverPreview?: string | null;
}

interface BulkUploadFormProps {
  files: File[];
  onClearFiles: () => void;
  onAddFiles: (files: File[]) => void;
}

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

export function BulkUploadForm({ files, onClearFiles, onAddFiles }: BulkUploadFormProps) {
  // Initialize form empty data
  const [bulkForm, setBulkForm] = useState<BulkBookForm[]>(() => createFormDataFromFiles(files));
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<number[]>([]);
  const [bulkResult, setBulkResult] = useState<{ success?: boolean; error?: string; md5?: string }[]>([]);
  const [bulkAutofillLoading, setBulkAutofillLoading] = useState<number | null>(null);

  // Update form data when files prop changes
  useEffect(() => {
    setBulkForm(createFormDataFromFiles(files));
  }, [files]);

  const handleBulkFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      // Add new files to existing bulk files
      const updatedFiles = [...files, ...newFiles];
      onAddFiles(updatedFiles);
    }
  };

  const handleBulkFieldChange = (idx: number, field: keyof BookFormData, value: string) => {
    setBulkForm((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const handleBulkCoverChange = (idx: number, e: React.ChangeEvent<HTMLInputElement> | File[]) => {
    if (Array.isArray(e)) {
      // Handling File[] from FileDropField
      if (e.length > 0) {
        const file = e[0];
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
        // Empty array means cover removal
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
    } else {
      // Handling React.ChangeEvent (original code)
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
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
      }
    }
  };

  const handleBulkAutofill = async (idx: number) => {
    const book = bulkForm[idx];
    if (!book.file) return;
    setBulkAutofillLoading(idx);
    const md5 = await computeFileMd5(book.file);
    const data = await autofillBookFields(md5);
    setBulkAutofillLoading(null);
    if (data) {
      setBulkForm((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                title: data.title || item.title,
                author: data.author || item.author,
                book_filetype: data.book_filetype || item.book_filetype,
                description: data.description || item.description,
                publisher: data.publisher || item.publisher,
                year: data.year || item.year,
                book_lang: data.book_lang || item.book_lang,
                isbn: data.isbn || item.isbn,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                file_source: (data as any).file_source || item.file_source,
                cid: data.cid || item.cid,
                coverPreview: data.book_image || data.external_cover_url || item.coverPreview,
              }
            : item,
        ),
      );
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkUploading(true);
    setBulkProgress(Array(bulkForm.length).fill(0));
    setBulkResult([]);
    const results: { success?: boolean; error?: string; md5?: string }[] = [];

    for (let i = 0; i < bulkForm.length; i++) {
      const book = bulkForm[i];
      const data = new FormData();
      if (!book.file || !book.title || !book.author || !book.book_filetype) {
        results.push({ error: `Missing required fields for file ${book.file.name}` });
        continue;
      }

      data.append("file", book.file);
      if (book.cover) data.append("cover", book.cover);
      data.append("title", book.title);
      data.append("author", book.author);
      data.append("book_filetype", book.book_filetype);
      if (book.description) data.append("description", book.description);
      if (book.publisher) data.append("publisher", book.publisher);
      if (book.year) data.append("year", book.year);
      if (book.book_lang) data.append("book_lang", book.book_lang);
      if (book.isbn) data.append("isbn", book.isbn);
      if (book.file_source) data.append("file_source", book.file_source);
      if (book.cid) data.append("cid", book.cid);

      // Use XMLHttpRequest for progress
      await new Promise<void>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://backend.bookracy.ru/upload");
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setBulkProgress((prev) => prev.map((p, idx2) => (idx2 === i ? Math.round((evt.loaded / evt.total) * 100) : p)));
          }
        };
        xhr.onload = () => {
          try {
            const res = JSON.parse(xhr.responseText);
            if (xhr.status === 200 && res.success) {
              results.push({ success: true, md5: res.md5 });
            } else {
              results.push({ error: res.error || "Upload failed." });
            }
          } catch {
            results.push({ error: "Unexpected server response." });
          }
          resolve();
        };
        xhr.onerror = () => {
          results.push({ error: "Network error." });
          resolve();
        };
        xhr.send(data);
      });
    }

    setBulkResult(results);

    // Check if all uploads were successful and clear the form
    const allSuccessful = results.every((result) => result.success);
    if (allSuccessful) {
      setBulkForm([]);
      onClearFiles();
    }

    setBulkUploading(false);
  };

  return (
    <form onSubmit={handleBulkSubmit} className="mt-4 flex flex-col gap-6">
      <Card className="border p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Bulk Upload</h2>
        <div className="h-[200px]">
          <FileDropField label="Add books (drag files here or click to browse)" acceptedTypes={FILE_TYPES} multiple={true} disabled={bulkUploading} onFilesSelected={handleBulkFileChange} icon="📚" />
        </div>
      </Card>

      {bulkForm.length > 0 && (
        <Card className="border shadow">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Files to Upload ({bulkForm.length})</h2>
            </div>
          </div>

          <div className="h-fit overflow-y-auto p-6 pt-0">
            <div className="flex flex-col gap-4">
              {bulkForm.map((book, idx) => (
                <BulkBookItem
                  key={book.file.name + idx}
                  book={book}
                  index={idx}
                  onRemove={() => {
                    setBulkForm(bulkForm.filter((_, i) => i !== idx));
                    onClearFiles();
                  }}
                  onFieldChange={(field, value) => handleBulkFieldChange(idx, field, value)}
                  onCoverChange={(e) => handleBulkCoverChange(idx, e)}
                  onAutofill={() => handleBulkAutofill(idx)}
                  isAutofilling={bulkAutofillLoading === idx}
                  isUploading={bulkUploading}
                  uploadProgress={bulkProgress[idx] || 0}
                  uploadResult={bulkResult[idx]}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {bulkForm.length > 0 && (
        <Button type="submit" className="mt-2 w-full" loading={bulkUploading} disabled={bulkUploading || bulkForm.length === 0}>
          Upload All {bulkForm.length} Books
        </Button>
      )}

      {bulkForm.length === 0 && <div className="py-4 text-center text-muted-foreground">Add book files to begin bulk upload</div>}
    </form>
  );
}
