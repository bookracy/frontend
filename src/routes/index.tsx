import { useGetBooksQuery } from "@/api/search/search";
import { BookItem, SkeletonBookItem } from "@/components/books/book-item";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSettingsStore } from "@/stores/settingsStore";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: (search) => {
    if (!search.q) {
      return { q: "" };
    }
    if (typeof search.q !== "string") {
      return { q: search.q.toString() };
    }
    return { q: search.q };
  },
});

function Index() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { q } = Route.useSearch();

  const booksPerSearch = useSettingsStore((state) => state.booksPerSearch);
  const language = useSettingsStore((state) => state.language);

  const debouncedQ = useDebounce(q, 500);

  const { data, error, isLoading } = useGetBooksQuery({
    query: debouncedQ,
    lang: language,
    limit: booksPerSearch,
  });

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">
          📚 Welcome to <strong>Bookracy</strong> 📚
        </h1>
        <p>Bookracy is a free and open-source web app that allows you to read and download your favorite books, comics, and manga.</p>

        <p className="text-white">To get started, either search below or navigate the site using the sidebar.</p>

        <Input
          placeholder="Search for books..."
          value={q}
          onChange={(e) =>
            navigate({
              search: {
                q: e.target.value,
              },
            })
          }
        />

        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: booksPerSearch }).map((_, i) => (
              <SkeletonBookItem key={i} />
            ))}
          </div>
        )}
        {error && <p>Error: {error.message}</p>}

        {data && (
          <div className="flex flex-col gap-4">
            {data.results.map((book) => (
              <BookItem key={book.md5} {...book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
