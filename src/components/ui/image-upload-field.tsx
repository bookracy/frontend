import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  value?: File | string;
  onChange: (file?: File) => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUploader({ value, onChange, disabled = false, className }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | undefined>(typeof value === "string" ? value : undefined);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        const file = acceptedFiles[0];
        onChange(file);

        setPreview(URL.createObjectURL(file));
        return () => {
          URL.revokeObjectURL(preview || "");
        };
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled,
  });

  const removeImage = () => {
    setPreview(undefined);
    onChange(undefined);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {preview ? (
        <div className="relative flex aspect-video max-h-[240px] w-full items-center justify-center overflow-hidden rounded-md border border-muted">
          <img
            src={preview || "/placeholder.svg"}
            alt="Profile preview"
            className="object-cover hover:cursor-pointer"
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  onDrop([file]);
                }
              };
              input.click();
            }}
          />
          <div className="absolute right-2 top-2 flex gap-2">
            <Button type="button" variant="destructive" size="icon" onClick={removeImage} disabled={disabled}>
              <X />
              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "flex aspect-video max-h-[240px] w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-4 transition-colors",
            isDragActive ? "border-primary bg-primary/10" : "border-muted",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-center text-sm text-muted-foreground">{isDragActive ? "Drop image here" : "Drag and drop an image, or click to select"}</p>
          <p className="mt-1 text-center text-xs text-muted-foreground">JPG, PNG, GIF or WEBP (max. 10MB)</p>
        </div>
      )}
    </div>
  );
}
