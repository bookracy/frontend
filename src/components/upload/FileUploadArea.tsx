import { useRef } from "react";

interface FileUploadAreaProps {
  bulk: boolean;
  uploading: boolean;
  onFilesSelected: (files: File[]) => void;
  acceptedTypes: string[];
}

export function FileUploadArea({ bulk, uploading, onFilesSelected, acceptedTypes }: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files).filter((f) => acceptedTypes.includes(f.name.split(".").pop()?.toLowerCase() || ""));
    onFilesSelected(files);
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((f) => acceptedTypes.includes(f.name.split(".").pop()?.toLowerCase() || ""));
      onFilesSelected(files);
    }
  };

  return (
    <div
      className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-400/60 bg-muted/40 p-8 text-center transition hover:bg-blue-100/40 dark:bg-muted/10 dark:hover:bg-blue-900/30"
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onClick={handleAreaClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex flex-col items-center gap-2 text-lg font-semibold text-blue-500 dark:text-blue-300">
        <span className="text-3xl">📚</span>
        {bulk ? "Drag & drop or click to select multiple book files" : "Drag & drop or click to select a book file"}
      </div>
      <input ref={fileInputRef} type="file" accept={acceptedTypes.map((t) => "." + t).join(",")} multiple={bulk} className="hidden" onChange={handleFileChange} disabled={uploading} />
    </div>
  );
}
