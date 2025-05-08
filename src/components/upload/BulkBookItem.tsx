import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgressBar } from "./ProgressBar";
import { UploadResult } from "./UploadResult";
import { BookFormData } from "./BookMetadataForm";
import { FILE_TYPES } from "./utils";

interface BulkBookItemProps {
  book: BookFormData & {
    file: File;
    cover?: File;
    coverPreview?: string | null;
  };
  index: number;
  onRemove: () => void;
  onFieldChange: (field: keyof BookFormData, value: string) => void;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAutofill: () => void;
  isAutofilling: boolean;
  isUploading: boolean;
  uploadProgress: number;
  uploadResult: { success?: boolean; error?: string; md5?: string } | undefined;
}

export function BulkBookItem({ book, index, onRemove, onFieldChange, onCoverChange, onAutofill, isAutofilling, isUploading, uploadProgress, uploadResult }: BulkBookItemProps) {
  return (
    <Card className="flex flex-col gap-2 border bg-muted/30 p-4 dark:bg-muted/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <div className="break-all font-mono text-xs">{book.file.name}</div>
          <div className="text-xs text-muted-foreground">
            {(book.file.size / 1024 / 1024).toFixed(2)} MB, {book.book_filetype.toUpperCase()}
          </div>
        </div>
        <Button type="button" size="sm" variant="destructive" onClick={onRemove}>
          Remove
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
        <div>
          <Label>Cover Image</Label>
          <Input type="file" accept="image/*" disabled={isUploading} onChange={onCoverChange} />
          {book.coverPreview && <img src={book.coverPreview} alt="Cover preview" className="mt-2 h-20 w-16 rounded border object-cover shadow" />}
        </div>
        <div>
          <Label>Title *</Label>
          <Input value={book.title} required disabled={isUploading} onChange={(e) => onFieldChange("title", e.target.value)} />
        </div>
        <div>
          <Label>Author *</Label>
          <Input value={book.author} required disabled={isUploading} onChange={(e) => onFieldChange("author", e.target.value)} />
        </div>
        <div>
          <Label>File Type *</Label>
          <Select value={book.book_filetype} onValueChange={(v) => onFieldChange("book_filetype", v)} disabled={isUploading}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {FILE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Language</Label>
          <Input value={book.book_lang} disabled={isUploading} onChange={(e) => onFieldChange("book_lang", e.target.value)} placeholder="e.g. en" />
        </div>
        <div>
          <Label>Year</Label>
          <Input value={book.year} disabled={isUploading} onChange={(e) => onFieldChange("year", e.target.value)} placeholder="e.g. 2025" />
        </div>
        <div>
          <Label>Publisher</Label>
          <Input value={book.publisher} disabled={isUploading} onChange={(e) => onFieldChange("publisher", e.target.value)} />
        </div>
        <div>
          <Label>ISBN</Label>
          <Input value={book.isbn} disabled={isUploading} onChange={(e) => onFieldChange("isbn", e.target.value)} />
        </div>
        <div>
          <Label>File Source</Label>
          <Input value={book.file_source} disabled={isUploading} onChange={(e) => onFieldChange("file_source", e.target.value)} />
        </div>
        <div>
          <Label>Content ID</Label>
          <Input value={book.cid} disabled={isUploading} onChange={(e) => onFieldChange("cid", e.target.value)} />
        </div>
        <div className="col-span-full">
          <Label>Description</Label>
          <textarea
            value={book.description}
            disabled={isUploading}
            onChange={(e) => onFieldChange("description", e.target.value)}
            className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
      <div className="mb-2 flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onAutofill} loading={isAutofilling} disabled={isUploading}>
          Autofill from Bookracy
        </Button>
        {isAutofilling && <span className="text-xs text-muted-foreground">Looking up metadata...</span>}
      </div>
      {isUploading && <ProgressBar progress={uploadProgress} />}
      {uploadResult && <UploadResult result={uploadResult} />}
    </Card>
  );
}
