import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import { AVAILABLE_FILE_TYPES } from "@/lib/file";

interface BulkUploadProps {
  isDragActive: boolean;
  getRootProps: () => React.HTMLAttributes<HTMLDivElement>;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
}

export function BulkUpload({ isDragActive, getRootProps, getInputProps }: BulkUploadProps) {
  return (
    <div className="mb-6">
      <Label className="text-base font-medium">Bulk Upload Files</Label>
      <div
        {...getRootProps()}
        className={cn(
          "mt-2 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors",
          isDragActive ? "border-primary bg-primary/10" : "border-muted hover:border-primary/50",
        )}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mb-2 h-10 w-10 text-muted-foreground" />
        <p className="text-center text-sm text-muted-foreground">{isDragActive ? "Drop files here" : "Drag and drop files here, or click to select"}</p>
        <p className="mt-1 text-center text-xs text-muted-foreground">{AVAILABLE_FILE_TYPES.map((type) => type.toUpperCase()).join(", ")} (max. 10 files)</p>
      </div>
    </div>
  );
}
