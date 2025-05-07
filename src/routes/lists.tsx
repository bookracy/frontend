import { useGetBooksByMd5sQuery } from "@/api/backend/search/search";
import { BookList } from "@/components/books/book-list";
import { NavLink } from "@/components/ui/nav-link";
import { useBookmarksStore } from "@/stores/bookmarks";
import { useReadingProgressStore } from "@/stores/progress";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/lists")({
  component: Lists,
});

export function Lists() {
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const readingProgress = useReadingProgressStore((state) => state.readingProgress)
    .filter((p) => p.totalPages > 0)
    .filter((p) => p.currentPage < p.totalPages);

  const { data, isLoading, isError } = useGetBooksByMd5sQuery(readingProgress.map((p) => p.md5));

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex w-full flex-col gap-4">
        {bookmarks.length > 0 ? (
          <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">No Bookmarks</h1>
            <p className="flex gap-1 text-sm text-muted-foreground">
              Start adding some books using the bookmark button. Start searching
              <NavLink to={"/?q="}>here</NavLink>
            </p>
          </div>
        )}

        <BookList books={bookmarks} />
      </div>

      <div className="flex w-full flex-col gap-4">
        {data?.length && data?.length > 0 && <h1 className="text-2xl font-bold">Reading Progress</h1>}
        {readingProgress.length === 0 && (
          <div>
            <h1 className="text-2xl font-bold">No Reading Progress</h1>
            <p className="flex gap-1 text-sm text-muted-foreground">Start reading some books and your progress will show up here.</p>
          </div>
        )}
        {isLoading && <Loader2 className="h-10 w-10 animate-spin" />}
        {data?.length && data?.length > 0 && <BookList books={data} />}
        {isError && <p>Failed to fetch reading progress</p>}
      </div>
    </div>
  );
}
