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
