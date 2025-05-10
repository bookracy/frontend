import { Button } from "@/components/ui/button";
import { BulkBookItem } from "./BulkBookItem";
import { FILE_TYPES } from "./hooks/utils";
import { FileDropField } from "./FileDropField";
import { Card } from "@/components/ui/card";
import { useBulkUpload, BulkBookForm } from "./hooks/useBulkUpload";
import { useAutofill, ExtendedBookItem } from "./hooks/useAutofill";
import { BulkUploadResult } from "./UploadResult";
import { NavigationButtons } from "./NavigationButtons";
import { useNavigationHelpers } from "./hooks/useNavigationHelpers";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";

interface BulkUploadFormProps {
  files: File[];
  onClearFiles: () => void;
  onAddFiles: (files: File[]) => void;
}

export function BulkUploadForm({ files, onClearFiles, onAddFiles }: BulkUploadFormProps) {
  const { bulkForm, setBulkForm, bulkProgress, handleBulkFieldChange, handleBulkCoverChange, bulkUploadMutation } = useBulkUpload(files, onClearFiles);
  const [autofillStats, setAutofillStats] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const [isAutofillAllRunning, setIsAutofillAllRunning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isItemUnfilled = (item: BulkBookForm) => {
    return !item.title || !item.author || !item.book_filetype;
  };

  const { currentItemIndex, hasPrevious, hasNext, goToNextUnfilled, goToPrevUnfilled } = useNavigationHelpers(bulkForm, isItemUnfilled);

  // Autofill mutation for each book
  const autofillMutation = useAutofill((data: ExtendedBookItem, error?: unknown, noResults?: boolean) => {
    if (error || noResults) {
      // If there's an API error or no results found, count as failure
      setAutofillStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
      return;
    }

    if (data && autofillMutation.variables) {
      const index = autofillMutation.variables.index;

      setBulkForm((prev) =>
        prev.map((item, i) =>
          i === index
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
                file_source: data.file_source || item.file_source,
                cid: data.cid || item.cid,
                coverPreview: data.book_image || data.external_cover_url || item.coverPreview,
              }
            : item,
        ),
      );

      // Count as success if we have valid data
      setAutofillStats((prev) => ({ ...prev, success: prev.success + 1 }));
    }
  });

  const handleBulkFileChange = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      // Add new files to existing bulk files
      const updatedFiles = [...files, ...newFiles];
      onAddFiles(updatedFiles);
    }
  };

  const handleBulkAutofill = useCallback(
    (idx: number) => {
      const book = bulkForm[idx];
      if (!book.file) return;
      autofillMutation.mutate({ file: book.file, index: idx });
    },
    [bulkForm, autofillMutation],
  );

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
              setAutofillStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
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
                  setAutofillStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
                },
              },
            );
          });
        } catch {
          setAutofillStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
        }
      } else {
        setAutofillStats((prev) => ({ ...prev, failed: prev.failed + 1 }));
      }
    }

    setIsAutofillAllRunning(false);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    bulkUploadMutation.mutate();
  };

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  // Auto-scroll to the current selected item when changed
  useEffect(() => {
    if (currentItemIndex !== null && currentItemIndex !== -1 && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: currentItemIndex,
        align: "center",
        behavior: "smooth",
      });
    }
  }, [currentItemIndex]);

  // Memoize the item renderer function to prevent unnecessary re-renders
  const itemContent = useMemo(() => {
    return (index: number, book: BulkBookForm) => (
      <div className="py-2">
        <BulkBookItem
          key={`${index}-${book.file?.name || "unnamed"}`}
          id={`bulk-item-${index}`}
          book={book}
          index={index}
          isSelected={currentItemIndex === index}
          onRemove={() => {
            setBulkForm(bulkForm.filter((_, i) => i !== index));
          }}
          onFieldChange={(field, value) => handleBulkFieldChange(index, field, value)}
          onCoverChange={(e) => handleBulkCoverChange(index, e)}
          onAutofill={() => handleBulkAutofill(index)}
          isAutofilling={autofillMutation.isPending && autofillMutation.variables?.index === index}
          isUploading={bulkUploadMutation.isPending}
          uploadProgress={bulkProgress[index] || 0}
          uploadResult={bulkUploadMutation.data ? bulkUploadMutation.data[index] : undefined}
        />
      </div>
    );
  }, [bulkForm, currentItemIndex, setBulkForm, handleBulkFieldChange, handleBulkCoverChange, handleBulkAutofill, autofillMutation, bulkUploadMutation, bulkProgress]);

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

          <div ref={containerRef} className="p-6 pt-0">
            {bulkForm.length > 0 && (
              <Virtuoso
                ref={virtuosoRef}
                useWindowScroll
                totalCount={bulkForm.length}
                data={bulkForm}
                itemContent={itemContent}
                overscan={2000}
                increaseViewportBy={{ top: 400, bottom: 400 }}
                defaultItemHeight={600}
                className="p-2"
              />
            )}
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

      {bulkForm.length > 0 && <NavigationButtons onPrevious={goToPrevUnfilled} onNext={goToNextUnfilled} disabled={bulkUploadMutation.isPending} hasPrevious={hasPrevious} hasNext={hasNext} />}
    </form>
  );
}
