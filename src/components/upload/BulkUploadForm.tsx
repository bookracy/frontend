import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BulkBookItem } from "./BulkBookItem";
import { BookFormData } from "./BookMetadataForm";
import { extractMetadataFromFilename, computeFileMd5, autofillBookFields } from "./utils";

interface BulkBookForm extends BookFormData {
  file: File;
  cover?: File;
  coverPreview?: string | null;
}

interface BulkUploadFormProps {
  files: File[];
  onClearFiles: () => void;
}

export function BulkUploadForm({ files, onClearFiles }: BulkUploadFormProps) {
  const [bulkForm, setBulkForm] = useState<BulkBookForm[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<number[]>([]);
  const [bulkResult, setBulkResult] = useState<{ success?: boolean; error?: string; md5?: string }[]>([]);
  const [bulkAutofillLoading, setBulkAutofillLoading] = useState<number | null>(null);

  // Initialize form data from files
  useEffect(() => {
    if (files.length > 0) {
      setBulkForm(
        files.map((file) => {
          const meta = extractMetadataFromFilename(file.name);
          return {
            file,
            cover: undefined,
            coverPreview: null,
            title: meta.title,
            author: meta.author,
            book_filetype: file.name.split(".").pop()?.toLowerCase() || "",
            description: "",
            publisher: "",
            year: meta.year,
            book_lang: "",
            isbn: "",
            file_source: "",
            cid: "",
          };
        }),
      );
    }
  }, [files]);

  const handleBulkFieldChange = (idx: number, field: keyof BookFormData, value: string) => {
    setBulkForm((prev) => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const handleBulkCoverChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
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
    setBulkUploading(false);
  };

  return (
    <form onSubmit={handleBulkSubmit} className="mt-4 flex flex-col gap-6">
      <div className="text-base font-semibold">Files to upload:</div>

      <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto">
        {bulkForm.map((book, idx) => (
          <BulkBookItem
            key={book.file.name + idx}
            book={book}
            index={idx}
            onRemove={() => {
              setBulkForm(bulkForm.filter((_, i) => i !== idx));
              // Also update the parent's files state
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

      <Button type="submit" className="mt-4 w-full" loading={bulkUploading} disabled={bulkUploading || bulkForm.length === 0}>
        Upload All
      </Button>
    </form>
  );
}
