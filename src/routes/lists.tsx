import { searchBooksByMd5QueryOptions } from "@/api/backend/search/books";
import { BookList } from "@/components/books/book-list";
import { NavLink } from "@/components/ui/nav-link";
import { useBookmarksStore } from "@/stores/bookmarks";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lists")({
  component: Lists,
  async beforeLoad(ctx) {
    const bookmarks = useBookmarksStore.getState().bookmarks;
    await ctx.context.queryClient.ensureQueryData(searchBooksByMd5QueryOptions(bookmarks));
  },
});

export function Lists() {
  const { data } = useSuspenseQuery(searchBooksByMd5QueryOptions(useBookmarksStore.getState().bookmarks));

  return (
    <div className="flex flex-1 justify-center">
      <div className="flex w-full flex-col gap-4">
        {data.results.length > 0 ? (
          <h1 className="text-2xl font-bold">Your Bookmarks</h1>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">No Bookmarks</h1>
            <p className="flex gap-1 text-sm">
              Start adding some books using the bookmark button. Start searching
              <NavLink to={"/?q="}>here</NavLink>
            </p>
          </div>
        )}

        <BookList books={data.results} />
      </div>
    </div>
  );
}
