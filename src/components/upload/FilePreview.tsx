interface BookPreviewProps {
  fileName: string;
  fileSize: number;
  fileType: string;
}

export function BookPreview({ fileName, fileSize, fileType }: BookPreviewProps) {
  return (
    <div className="flex w-full flex-col items-center gap-2 text-center">
      <span className="text-3xl">📕</span>
      <div className="flex w-full max-w-full flex-col items-center gap-1">
        <div className="w-full break-words text-sm font-medium text-blue-600 dark:text-blue-400">{fileName}</div>
        <div className="text-xs text-muted-foreground">
          {(fileSize / 1024 / 1024).toFixed(2)} MB • {fileType.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

interface CoverPreviewProps {
  imageUrl: string;
}

export function CoverPreview({ imageUrl }: CoverPreviewProps) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="h-20 w-16 overflow-hidden rounded-md shadow-md">
        <img src={imageUrl} alt="Cover preview" className="h-full w-full object-cover" />
      </div>
      <span className="text-xs text-muted-foreground">Cover Image</span>
    </div>
  );
}
