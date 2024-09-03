import { BookItem } from "@/api/backend/types";
import { useBookmarksStore } from "@/stores/bookmarks";
import { Button } from "../ui/button";
import { useMemo } from "react";
import { BookmarkMinus, BookmarkPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function BookmarkButton({ book }: { book: BookItem }) {
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const addBookmark = useBookmarksStore((state) => state.addBookmark);
  const removeBookmark = useBookmarksStore((state) => state.removeBookmark);

  const bookMarkedBook = useMemo(() => bookmarks.find((b) => b.md5 === book.md5), [bookmarks, book.md5]);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" onClick={() => (bookMarkedBook ? removeBookmark(bookMarkedBook.md5) : addBookmark(book))} className="flex items-center gap-2">
            {bookMarkedBook ? <BookmarkMinus className="h-5 w-5" /> : <BookmarkPlus className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{bookMarkedBook ? "Remove bookmark" : "Add bookmark"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
