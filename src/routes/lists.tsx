import { searchBooksByMd5QueryOptions } from "@/api/backend/search/books";
import { BookList } from "@/components/books/book-list";
import { NavLink } from "@/components/ui/nav-link";
import { useBookmarksStore } from "@/stores/bookmarks";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lists")({
  component: Lists,
  async beforeLoad(ctx) {
    const bookmarks = useBookmarksStore.getState().bookmarks;
    await ctx.context.queryClient.ensureQueryData(searchBooksByMd5QueryOptions(bookmarks));
  },
});

export function Lists() {
  const bookmarks = useBookmarksStore((state) => state.bookmarks);

  const { data } = useQuery(searchBooksByMd5QueryOptions(bookmarks));

  if (bookmarks.length === 0 || !data) {
    return (
      <div className="flex flex-1 justify-center">
        <div className="flex w-full flex-col gap-4">
          <h1 className="text-2xl font-bold">No Bookmarks</h1>
          <p className="flex gap-1 text-sm">
            Start adding some books using the bookmark button. Start searching
            <NavLink to={"/?q="}>here</NavLink>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 justify-center">
      <div className="flex w-full flex-col gap-4">
        <h1 className="text-2xl font-bold">Your Bookmarks</h1>

        <BookList books={data.results} />
      </div>
    </div>
  );
}
