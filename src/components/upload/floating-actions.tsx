import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FloatingActionsProps {
  bookCount: number;
  canAddMore: boolean;
  canSubmit: boolean;
  onAddBook: () => void;
  isUploading?: boolean;
  progress?: number;
}

export function FloatingActions({ bookCount, canAddMore, canSubmit, onAddBook, isUploading = false, progress = 0 }: FloatingActionsProps) {
  return (
    <div className="fixed bottom-6 right-12 z-50 flex gap-4">
      <Button type="button" variant="outline" onClick={onAddBook} disabled={!canAddMore}>
        <Plus className="mr-2 h-4 w-4" />
        Add Book
      </Button>
      <Button type="submit" disabled={!canSubmit} className={`relative overflow-hidden transition-all duration-300 ${isUploading ? "animate-pulse" : ""}`}>
        <span className="relative z-10">{isUploading ? "Uploading..." : `Upload ${bookCount} Book${bookCount !== 1 ? "s" : ""}`}</span>
        {isUploading && progress > 0 && (
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-1000 ease-out"
            style={{
              width: `${progress}%`,
            }}
          />
        )}
      </Button>
    </div>
  );
}
