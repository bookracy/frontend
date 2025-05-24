import { useRef } from "react";
import { cn } from "@/lib/utils";

interface FileDropFieldProps {
  label: string;
  acceptedTypes?: string[];
  filePreview?: string | null;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  previewComponent?: React.ReactNode;
  isFileTooLarge?: boolean;
}

export function FileDropField({
  label,
  acceptedTypes = [],
  filePreview = null,
  multiple = false,
  onFilesSelected,
  disabled = false,
  icon = "",
  previewComponent,
  isFileTooLarge = false,
}: FileDropFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    const allFiles = Array.from(e.dataTransfer.files);
    const acceptedFiles = allFiles.filter((f) => {
      const extension = f.name.split(".").pop()?.toLowerCase() || "";
      return acceptedTypes.length === 0 || acceptedTypes.includes(extension);
    });

    // Log rejected files
    if (acceptedFiles.length < allFiles.length) {
      console.warn(`${allFiles.length - acceptedFiles.length} files were rejected because they had unsupported file types.`);
    }

    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    } else if (allFiles.length > 0) {
      console.warn("No files were accepted. Supported types:", acceptedTypes.join(", "));
    }
  };

  const handleAreaClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const allFiles = Array.from(e.target.files);
      const acceptedFiles = allFiles.filter((f) => {
        const extension = f.name.split(".").pop()?.toLowerCase() || "";
        return acceptedTypes.length === 0 || acceptedTypes.includes(extension);
      });

      // Log rejected files
      if (acceptedFiles.length < allFiles.length) {
        console.warn(`${allFiles.length - acceptedFiles.length} files were rejected because they had unsupported file types.`);
      }

      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      } else {
        console.warn("No files were accepted. Supported types:", acceptedTypes.join(", "));
      }
    }
  };

  return (
    <div className="flex h-full w-full">
      <div
        className={cn(
          "flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 p-5 text-center transition",
          isFileTooLarge ? "border-red-500" : "border-blue-400/60",
          disabled ? "cursor-not-allowed opacity-50" : "hover:bg-blue-100/40 dark:hover:bg-blue-900/30",
          filePreview ? "bg-blue-50/50 dark:bg-blue-900/20" : "dark:bg-muted/10",
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={handleAreaClick}
        role="button"
        tabIndex={0}
      >
        {previewComponent ? (
          previewComponent
        ) : (
          <div className="flex flex-col items-center gap-2 font-medium text-blue-500 dark:text-blue-300">
            <span className="text-3xl">{icon}</span>
            <span className="max-w-[200px] text-center text-sm">{label}</span>
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept={acceptedTypes.map((t) => "." + t).join(",")} multiple={multiple} className="hidden" onChange={handleFileChange} disabled={disabled} />
    </div>
  );
}
