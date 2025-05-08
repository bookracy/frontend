import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FileUploadArea } from "@/components/upload/FileUploadArea";
import { SingleBookForm } from "@/components/upload/SingleBookForm";
import { BulkUploadForm } from "@/components/upload/BulkUploadForm";
import { FILE_TYPES } from "@/components/upload/utils";

export const Route = createFileRoute("/upload")({
  component: Upload,
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/", search: { q: "" } });
  },
});

function Upload() {
  const [bulk, setBulk] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    if (bulk) {
      setBulkFiles((prev) => [...prev, ...files]);
    } else if (files[0]) {
      // In single mode, handle the first file through the SingleBookForm
      const fileInput = document.querySelector('input[type="file"][name="file"]') as HTMLInputElement;
      if (fileInput) {
        const event = new Event("change", { bubbles: true });
        Object.defineProperty(event, "target", { writable: false, value: { files: [files[0]] } });
        fileInput.dispatchEvent(event);
      }
    }
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center py-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-2 md:px-0">
        <Card className="w-full border border-border bg-card shadow-2xl dark:bg-card">
          <CardHeader>
            <CardTitle>Upload a Book</CardTitle>
            <CardDescription>Share your books with the world. Fill in the details and upload your file. Allowed types: epub, pdf, txt, mobi, etc. Max size: 100MB.</CardDescription>
          </CardHeader>

          <div className="flex flex-col gap-4 p-6 pt-0">
            <div className="mb-2 flex items-center gap-4">
              <Label className="flex cursor-pointer select-none items-center gap-2">
                <input
                  type="checkbox"
                  checked={bulk}
                  onChange={() => {
                    setBulk(!bulk);
                    setBulkFiles([]);
                  }}
                  className="accent-blue-500"
                />
                Bulk Upload
              </Label>
            </div>

            <FileUploadArea bulk={bulk} uploading={false} onFilesSelected={handleFilesSelected} acceptedTypes={FILE_TYPES} />

            {bulk && bulkFiles.length > 0 ? (
              <BulkUploadForm files={bulkFiles} onClearFiles={() => setBulkFiles([])} />
            ) : (
              !bulk && (
                <SingleBookForm
                  onSubmit={async (formData) => {
                    return new Promise((resolve) => {
                      const xhr = new XMLHttpRequest();
                      xhr.open("POST", "https://backend.bookracy.ru/upload");
                      xhr.onload = () => {
                        try {
                          const res = JSON.parse(xhr.responseText);
                          if (xhr.status === 200 && res.success) {
                            resolve({ success: true, md5: res.md5 });
                          } else {
                            resolve({ error: res.error || "Upload failed." });
                          }
                        } catch {
                          resolve({ error: "Unexpected server response." });
                        }
                      };
                      xhr.onerror = () => {
                        resolve({ error: "Network error." });
                      };
                      xhr.send(formData);
                    });
                  }}
                />
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
