import { useGetBooksQuery } from "@/api/search/search";
import { BookItem, SkeletonBookItem } from "@/components/books/book-item";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSettingsStore } from "@/stores/settingsStore";
import { useLayoutStore } from "@/stores/layout"; // Make sure to import this
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/ui/nav-link";
import { SearchIcon } from "lucide-react";

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
  const sidebar = useLayoutStore((state) => state.sidebar);

  const debouncedQ = useDebounce(q, 500);

  const { data, error, isLoading } = useGetBooksQuery({
    query: debouncedQ,
    lang: language,
    limit: booksPerSearch,
  });

  return (
    <div>
      <h1 className="text-2xl">
        Welcome to <strong className="text-primary">Bookracy</strong> 📚
      </h1>
      <br />
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p>
            Bookracy is a free and open-source web app that allows you to read and download your favorite books, comics, and manga.
            <br />
            To get started, search below or navigate the site using the sidebar or click to <NavLink to="/about">Learn More →</NavLink>
          </p>
        </div>

        {/* Sticky Search Input */}
        <div
          className={cn("sticky left-[40px] top-[8px] z-50 w-full", {
            "left-[200px]": sidebar.isOpen,
          })}
        >
          <div className="relative w-full max-w-full">
            {" "}
            {/* Adjust max width as needed */}
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="flex h-10 rounded-md border border-input bg-background px-10 py-2 text-sm transition-all duration-300 focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-primary/50"
              placeholder="Search for books, comics, or manga..."
              value={q}
              onChange={(e) =>
                navigate({
                  search: {
                    q: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: booksPerSearch }).map((_, i) => (
              <SkeletonBookItem key={i} />
            ))}
          </div>
        )}
        {error && <p className="text-red-500">Error: {error.message}</p>}

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
