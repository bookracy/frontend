import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface FloatingActionsProps {
  bookCount: number;
  canAddMore: boolean;
  canSubmit: boolean;
  onAddBook: () => void;
}

export function FloatingActions({ bookCount, canAddMore, canSubmit, onAddBook }: FloatingActionsProps) {
  return (
    <div className="fixed bottom-6 right-12 z-50 flex gap-4">
      <Button type="button" variant="outline" onClick={onAddBook} disabled={!canAddMore}>
        <Plus className="mr-2 h-4 w-4" />
        Add Book
      </Button>
      <Button type="submit" disabled={!canSubmit}>
        Upload {bookCount} Book{bookCount !== 1 ? "s" : ""}
      </Button>
    </div>
  );
}
