import { searchBooksByMd5QueryOptions } from "@/api/backend/search/books";
import { useQuery } from "@tanstack/react-query";
import { getBooksByMd5sQueryOptions } from "@/api/backend/search/search";
import { BookList } from "@/components/books/book-list";
import { NavLink } from "@/components/ui/nav-link";
import { useBookmarksStore } from "@/stores/bookmarks";
import { useReadingProgressStore } from "@/stores/progress";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lists")({
  component: Lists,
  async beforeLoad(ctx) {
    const bookmarks = useBookmarksStore.getState().bookmarks;
    await ctx.context.queryClient.ensureQueryData(searchBooksByMd5QueryOptions(bookmarks));
    const readingProgress = useReadingProgressStore
      .getState()
      .readingProgress.filter((p) => p.totalPages > 0)
      .filter((p) => p.currentPage < p.totalPages);
    await ctx.context.queryClient.ensureQueryData(getBooksByMd5sQueryOptions(readingProgress.map((p) => p.md5)));
  },
});

export function Lists() {
  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const readingProgress = useReadingProgressStore((state) => state.readingProgress)
    .filter((p) => p.totalPages > 0)
    .filter((p) => p.currentPage < p.totalPages);

  const { data } = useQuery(getBooksByMd5sQueryOptions(readingProgress.map((p) => p.md5)));

  const { data: bookmarksData } = useQuery(searchBooksByMd5QueryOptions(bookmarks));

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex w-full flex-col gap-4">
        {bookmarks.length > 0 ? <h1 className="text-lg font-bold">Bookmarks</h1> : null}

        {bookmarks.length === 0 && (
          <div>
            <h1 className="text-2xl font-bold">No Bookmarks</h1>
            <p className="text-muted-foreground flex gap-1 text-sm">
              Start adding some books using the bookmark button. Start searching
              <NavLink to={"/?q="}>here</NavLink>
            </p>
          </div>
        )}

        <BookList books={bookmarksData?.results ?? []} />
      </div>

      <div className="flex w-full flex-col gap-4">
        {data?.length && data?.length > 0 ? <h1 className="text-2xl font-bold">Reading Progress</h1> : null}
        {readingProgress.length === 0 && (
          <div>
            <h1 className="text-2xl font-bold">No Reading Progress</h1>
            <p className="text-muted-foreground flex gap-1 text-sm">Start reading some books and your progress will show up here.</p>
          </div>
        )}
        {data?.length && data?.length > 0 ? <BookList books={data} /> : null}
      </div>
    </div>
  );
}
