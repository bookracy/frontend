import { Button } from "@/components/ui/button";
import { BulkBookItem } from "./BulkBookItem";
import { FILE_TYPES } from "./hooks/utils";
import { FileDropField } from "./FileDropField";
import { Card } from "@/components/ui/card";
import { useBulkUpload } from "./hooks/useBulkUpload";
import { useAutofill, ExtendedBookItem } from "./hooks/useAutofill";
import { BulkUploadResult } from "./UploadResult";
import { useState } from "react";

interface BulkUploadFormProps {
  files: File[];
  onClearFiles: () => void;
  onAddFiles: (files: File[]) => void;
}

export function BulkUploadForm({ files, onClearFiles, onAddFiles }: BulkUploadFormProps) {
  const { bulkForm, setBulkForm, bulkProgress, handleBulkFieldChange, handleBulkCoverChange, bulkUploadMutation } = useBulkUpload(files, onClearFiles);
  const [autofillStats, setAutofillStats] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const [isAutofillAllRunning, setIsAutofillAllRunning] = useState(false);

  // Autofill mutation for each book
  const autofillMutation = useAutofill((data: ExtendedBookItem, error?: unknown, isFromAPI?: boolean) => {
    if (error) {
      // If there's an API error, count as failure
      setAutofillStats(prev => ({ ...prev, failed: prev.failed + 1 }));
      return;
    }
    
    if (data && autofillMutation.variables) {
      const index = autofillMutation.variables.index;

      // If data came from API, trust it fully
      // Only validate title/author from filename-based extraction
      const shouldUseTitle = isFromAPI ? !!data.title : (!!data.title && !data.title.includes(')') && !data.title.includes('('));
      const shouldUseAuthor = isFromAPI ? !!data.author : (!!data.author && !data.author.includes('(') && !data.author.includes(')'));
      
      setBulkForm((prev) =>
        prev.map((item, i) =>
          i === index
            ? {
                ...item,
                title: shouldUseTitle && data.title ? data.title : item.title,
                author: shouldUseAuthor && data.author ? data.author : item.author,
                book_filetype: data.book_filetype || item.book_filetype,
                description: data.description || item.description,
                publisher: data.publisher || item.publisher,
                year: data.year || item.year,
                book_lang: data.book_lang || item.book_lang,
                isbn: data.isbn || item.isbn,
                file_source: data.file_source || item.file_source,
                cid: data.cid || item.cid,
                coverPreview: data.book_image || data.external_cover_url || item.coverPreview,
              }
            : item,
        ),
      );
      
      // Count as success if data came from API or if we have proper metadata
      if (isFromAPI) {
        setAutofillStats(prev => ({ ...prev, success: prev.success + 1 }));
      } else if ((shouldUseTitle || shouldUseAuthor) && (data.description || data.publisher || data.year || data.isbn || data.book_image)) {
        setAutofillStats(prev => ({ ...prev, success: prev.success + 1 }));
      } else {
        setAutofillStats(prev => ({ ...prev, failed: prev.failed + 1 }));
      }
    }
  });

  const handleBulkFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      // Add new files to existing bulk files
      const updatedFiles = [...files, ...newFiles];
      onAddFiles(updatedFiles);
    }
  };

  const handleBulkAutofill = async (idx: number) => {
    const book = bulkForm[idx];
    if (!book.file) return;
    autofillMutation.mutate({ file: book.file, index: idx });
  };

  const handleAutofillAll = async () => {
    if (isAutofillAllRunning) return;
    
    setIsAutofillAllRunning(true);
    setAutofillStats({ success: 0, failed: 0 });
    
    // Process books sequentially to avoid overwhelming the API
    for (let i = 0; i < bulkForm.length; i++) {
      const book = bulkForm[i];
      if (book.file) {
        try {
          await new Promise<void>((resolve) => {
            const fileToAutofill = book.file;
            if (!fileToAutofill) {
              setAutofillStats(prev => ({ ...prev, failed: prev.failed + 1 }));
              resolve();
              return;
            }
            
            autofillMutation.mutate(
              { file: fileToAutofill, index: i },
              {
                onSettled: () => {
                  resolve();
                },
                onError: () => {
                  // Handle error in onError callback to ensure it's counted
                  setAutofillStats(prev => ({ ...prev, failed: prev.failed + 1 }));
                }
              }
            );
          });
        } catch {
          setAutofillStats(prev => ({ ...prev, failed: prev.failed + 1 }));
        }
      } else {
        setAutofillStats(prev => ({ ...prev, failed: prev.failed + 1 }));
      }
    }
    
    setIsAutofillAllRunning(false);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    bulkUploadMutation.mutate();
  };

  return (
    <form onSubmit={handleBulkSubmit} className="mt-4 flex flex-col gap-6">
      <Card className="border p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Bulk Upload</h2>
        <div className="h-[200px]">
          <FileDropField
            label="Add books (drag files here or click to browse)"
            acceptedTypes={FILE_TYPES}
            multiple={true}
            disabled={bulkUploadMutation.isPending}
            onFilesSelected={handleBulkFileChange}
            icon="📚"
          />
        </div>
      </Card>

      {bulkForm.length > 0 && (
        <Card className="border shadow">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Files to Upload ({bulkForm.length})</h2>
              <div className="flex items-center gap-4">
                {autofillStats.success > 0 || autofillStats.failed > 0 ? (
                  <span className="text-sm text-muted-foreground">
                    Autofill results: {autofillStats.success} succeeded, {autofillStats.failed} failed
                  </span>
                ) : null}
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleAutofillAll}
                  disabled={isAutofillAllRunning || bulkUploadMutation.isPending || bulkForm.length === 0}
                  loading={isAutofillAllRunning}
                >
                  Autofill All
                </Button>
              </div>
            </div>
          </div>

          <div className="h-fit overflow-y-auto p-6 pt-0">
            <div className="flex flex-col gap-4">
              {bulkForm.map((book, idx) => (
                <BulkBookItem
                  key={`${idx}-${book.file?.name || "unnamed"}`}
                  book={book}
                  index={idx}
                  onRemove={() => {
                    setBulkForm(bulkForm.filter((_, i) => i !== idx));
                  }}
                  onFieldChange={(field, value) => handleBulkFieldChange(idx, field, value)}
                  onCoverChange={(e) => handleBulkCoverChange(idx, e)}
                  onAutofill={() => handleBulkAutofill(idx)}
                  isAutofilling={autofillMutation.isPending && autofillMutation.variables?.index === idx}
                  isUploading={bulkUploadMutation.isPending}
                  uploadProgress={bulkProgress[idx] || 0}
                  uploadResult={bulkUploadMutation.data ? bulkUploadMutation.data[idx] : undefined}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {bulkForm.length > 0 && (
        <Button type="submit" className="mt-2 w-full" loading={bulkUploadMutation.isPending} disabled={bulkUploadMutation.isPending || bulkForm.length === 0}>
          Upload All {bulkForm.length} Books
        </Button>
      )}

      {bulkUploadMutation.isSuccess && bulkUploadMutation.data && <BulkUploadResult results={bulkUploadMutation.data} />}

      {bulkForm.length === 0 && <div className="py-4 text-center text-muted-foreground">Add book files to begin bulk upload</div>}
    </form>
  );
}
