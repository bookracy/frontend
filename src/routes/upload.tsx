import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { SingleBookForm } from "@/components/upload/SingleBookForm";
import { BulkUploadForm } from "@/components/upload/BulkUploadForm";
import { useUploadService } from "@/components/upload/hooks/useUploadService";

export const Route = createFileRoute("/upload")({
  component: Upload,
  beforeLoad: (ctx) => {
    if (import.meta.env.PROD) throw redirect({ to: "/", search: { q: "" } });
    if (!ctx.context.auth.isLoggedIn) throw redirect({ to: "/login" });
  },
});

// Helper: Try to extract metadata from file name (basic, for demo)
function extractMetadataFromFilename(filename: string) {
  // Example: "Author - Title (2023).epub" or "Title - Author.pdf"
  const match = filename.match(/(.+?)\s*-\s*(.+?)(?:\s*\((\d{4})\))?\.[^.]+$/);
  if (match) {
    const author = match[1];
    const title = match[2];
    const year = match[3] || "";
    return { title: title.trim(), author: author.trim(), year };
  }
  // Try: "Title.pdf"
  const simple = filename.match(/(.+)\.[^.]+$/);
  if (simple) return { title: simple[1].trim(), author: "", year: "" };
  return { title: "", author: "", year: "" };
}

async function computeFileMd5(file: File): Promise<string> {
  // Use spark-md5 for browser MD5 calculation
  return new Promise((resolve, reject) => {
    const chunkSize = 2 * 1024 * 1024; // 2MB per chunk
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      if (!e.target?.result) return reject(new Error("Failed to read file"));
      spark.append(e.target.result as ArrayBuffer);
      currentChunk++;
      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };
    fileReader.onerror = () => reject(new Error("File read error"));

    function loadNext() {
      const start = currentChunk * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      fileReader.readAsArrayBuffer(file.slice(start, end));
    }
    loadNext();
  });
}

async function autofillBookFields(md5: string): Promise<Partial<BookItem> | null> {
  try {
    const res = await ofetch<{ results: BookItem[] }>("https://backend.bookracy.ru/api/books", {
      query: { query: md5, limit: 1 },
    });
    if (res.results && res.results.length > 0) return res.results[0];
    return null;
  } catch {
    return null;
  }
}

type BulkBookForm = {
  file: File;
  cover?: File;
  coverPreview?: string | null;
  title: string;
  author: string;
  book_filetype: string;
  description: string;
  publisher: string;
  year: string;
  book_lang: string;
  isbn: string;
  file_source: string;
  cid: string;
};

function Upload() {
  const [bulk, setBulk] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const { uploadSingleBook } = useUploadService();

  // Listen for the bulkFilesAdded event
  useEffect(() => {
    const handleBulkFilesAdded = (e: Event) => {
      const customEvent = e as CustomEvent<{ files: File[] }>;
      if (customEvent.detail && customEvent.detail.files) {
        setBulkFiles(customEvent.detail.files);
      }
    };

    window.addEventListener("bulkFilesAdded", handleBulkFilesAdded);

    return () => {
      window.removeEventListener("bulkFilesAdded", handleBulkFilesAdded);
    };
  }, []);

  return (
    <div className="flex w-full items-start justify-center">
      <div className="container mx-auto px-0">
        <Card className="w-full border border-border bg-card shadow-md dark:bg-card">
          <CardHeader className="pb-4">
            <CardTitle>Upload a Book</CardTitle>
            <CardDescription>Share your books with the world. Fill in the details and upload your file. Allowed types: epub, pdf, txt, mobi, etc. Max size: 100MB.</CardDescription>
            <div className="mt-4 flex items-center gap-4">
              <Label className="flex cursor-pointer select-none items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={bulk}
                  onChange={() => {
                    setBulk(!bulk);
                    setBulkFiles([]);
                  }}
                  className="accent-blue-500"
                />
                Bulk Upload Mode
              </Label>
            </div>
          </CardHeader>

          <div className="px-6 pb-6">
            {bulk ? (
              <BulkUploadForm files={bulkFiles} onClearFiles={() => setBulkFiles([])} onAddFiles={(files) => setBulkFiles(files)} />
            ) : (
              <SingleBookForm
                onSubmit={async (formData) => {
                  // Convert FormData to BookFormState
                  const book = {
                    file: formData.get("file") as File,
                    cover: formData.get("cover") as File,
                    title: formData.get("title") as string,
                    author: formData.get("author") as string,
                    book_filetype: formData.get("book_filetype") as string,
                    description: formData.get("description") as string,
                    publisher: formData.get("publisher") as string,
                    year: formData.get("year") as string,
                    book_lang: formData.get("book_lang") as string,
                    isbn: formData.get("isbn") as string,
                    file_source: formData.get("file_source") as string,
                    cid: formData.get("cid") as string,
                  };

                  return uploadSingleBook(book);
                }}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
