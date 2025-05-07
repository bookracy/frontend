import { useGetBooksQueryWithExternalDownloads } from "@/api/backend/search/search";
import { SkeletonBookItem } from "@/components/books/book-item";
import { useDebounce } from "@/hooks/use-debounce";
import { useSettingsStore } from "@/stores/settings";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { NavLink } from "@/components/ui/nav-link";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Filters, FilterProps } from "@/components/books/filters";
import { BookList } from "@/components/books/book-list";
import { BookGallery } from "@/components/books/book-gallery";

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

  const [filters, setFilters] = useState<FilterProps["filters"]>({
    view: "list",
    perPage: 10,
  });

  const language = useSettingsStore((state) => state.language);

  const debouncedQ = useDebounce(q, 500);

  const { data, error, isLoading } = useGetBooksQueryWithExternalDownloads({
    query: debouncedQ,
    lang: language,
    limit: filters.perPage,
  });

  return (
    <div>
      <h1 className="text-2xl">
        Welcome to <strong>Bookracy</strong> 📚
      </h1>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-muted-foreground">
          <p>
            Bookracy is a free and open-source web app that allows you to read and download your favorite books, comics, and manga.
            <br />
            To get started, either search below or navigate the site using the sidebar.
          </p>
          <NavLink to="/about">About Us</NavLink>
        </div>

        <div className="flex flex-col gap-2">
          <Filters filters={filters} setFilters={setFilters} />

          <Input
            iconLeft={<SearchIcon />}
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

        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonBookItem key={i} />
            ))}
          </div>
        )}
        {error && <p className="text-red-500">Error: {error.message}</p>}

        {data && filters.view === "list" && <BookList books={data.results} />}
        {data && filters.view === "grid" && <BookGallery books={data.results} />}
      </div>
    </div>
  );
}
