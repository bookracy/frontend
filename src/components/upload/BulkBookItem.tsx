import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "./UploadProgressBar";
import { UploadResult } from "./UploadResult";
import { BookFormData } from "./BookMetadataForm";
import { FILE_TYPES } from "./hooks/utils";
import { Minus } from "lucide-react";
import { FileDropField } from "./FileDropField";
import { CoverPreview } from "./CoverPreview";
import { BookPreview } from "./FilePreview";
import { Trash2, Loader2 } from "lucide-react";
import { BulkBookForm } from "./hooks/useBulkUpload";
import { UploadResult as UploadResultType } from "./hooks/useBookUpload";

interface BulkBookItemProps {
  book: BulkBookForm;
  index: number;
  onRemove: () => void;
  onFieldChange: (field: keyof BookFormData, value: string) => void;
  onCoverChange: (files: File[]) => void;
  onAutofill: () => void;
  isAutofilling: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadResult?: UploadResultType;
}

export function BulkBookItem({ book, index, onRemove, onFieldChange, onCoverChange, onAutofill, isAutofilling, isUploading, uploadProgress, uploadResult }: BulkBookItemProps) {
  if (!book.file) return null;

  return (
    <Card className="border p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row">
        {/* Left column with book preview */}
        <div className="w-full md:w-1/3">
          <div className="flex flex-col gap-4">
            <div className="h-40 overflow-hidden rounded border bg-muted">
              <BookPreview fileName={book.file.name} fileSize={book.file.size} fileType={book.book_filetype || book.file.name.split(".").pop() || ""} />
            </div>

            <div className="h-40 overflow-hidden rounded border bg-muted">
              {book.coverPreview ? (
                <CoverPreview imageUrl={book.coverPreview} />
              ) : (
                <FileDropField label="Add cover image" acceptedTypes={["jpg", "jpeg", "png", "gif", "webp"]} disabled={isUploading} onFilesSelected={onCoverChange} icon="🖼️" />
              )}
            </div>

            <Button size="sm" variant="outline" className="w-full" loading={isAutofilling} disabled={isAutofilling || isUploading} onClick={onAutofill}>
              Autofill Metadata
            </Button>
          </div>
        </div>

        {/* Right column with form fields */}
        <div className="flex w-full flex-col space-y-3 md:w-2/3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Book {index + 1}</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={onRemove} disabled={isUploading}>
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor={`title-${index}`}>Title</Label>
              <Input id={`title-${index}`} value={book.title} onChange={(e) => onFieldChange("title", e.target.value)} placeholder="Book title" disabled={isUploading} />
            </div>

            <div className="space-y-1">
              <Label htmlFor={`author-${index}`}>Author</Label>
              <Input id={`author-${index}`} value={book.author} onChange={(e) => onFieldChange("author", e.target.value)} placeholder="Author" disabled={isUploading} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor={`publisher-${index}`}>Publisher</Label>
              <Input id={`publisher-${index}`} value={book.publisher} onChange={(e) => onFieldChange("publisher", e.target.value)} placeholder="Publisher" disabled={isUploading} />
            </div>

            <div className="space-y-1">
              <Label htmlFor={`year-${index}`}>Year</Label>
              <Input id={`year-${index}`} value={book.year} onChange={(e) => onFieldChange("year", e.target.value)} placeholder="Publication year" disabled={isUploading} />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor={`description-${index}`}>Description</Label>
            <Textarea
              id={`description-${index}`}
              value={book.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
              placeholder="Book description"
              rows={2}
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div>
              <ProgressBar progress={uploadProgress} />
              {uploadResult && <div className={`mt-1 text-sm ${uploadResult.success ? "text-green-600" : "text-red-600"}`}>{uploadResult.success ? "Success" : uploadResult.error}</div>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
