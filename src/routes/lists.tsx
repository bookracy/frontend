import { BookList } from "@/components/books/book-list";
import { useBookmarksStore } from "@/stores/bookmarks";
import { createFileRoute } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/lists")({
  component: Lists,
});

export function Lists() {
  const bookmarks = useBookmarksStore((state) => state.bookmarks);

  return (
    <div className="flex flex-1 justify-center">
      <div className="flex w-full flex-col gap-4">
        {bookmarks.length > 0 ? (
          <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        ):(
          <div>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 className="text-2xl font-bold">No Bookmarks</h1>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Add some books here by clicking the bookmark icon on a book card.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        <BookList books={bookmarks} />
      </div>
    </div>
  );
}
