import { useGetBooksQueryWithExternalDownloads } from "@/api/backend/search/search";
import { SkeletonBookItem } from "@/components/books/book-item";
import { useDebounce } from "@/hooks/use-debounce";
import { useSettingsStore } from "@/stores/settings";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayoutStore } from "@/stores/layout";
import { cn } from "@/lib/utils";
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
  const sidebar = useLayoutStore((state) => state.sidebar);

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

  const isSearching = data?.results.length === 0;

  return (
    <div className="p-4md:p-6 mx-auto max-w-7xl lg:p-8">
      <div className={cn("flex flex-col gap-4", isSearching ? "" : "h-full justify-center")}>
        <header className="mb-0">
          <h1 className="mb-4 text-3xl font-bold">
            Welcome to <strong className="text-primary">Bookracy</strong> 📚
          </h1>
          <p className="text-lg text-muted-foreground">
            Bookracy is a free and open-source web app that allows you to read and download your favorite books, comics, and manga.
            <br />
            To get started, either search below or navigate the site using the sidebar.
          </p>
          <NavLink to="/about">About Us</NavLink>
        </header>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Filters filters={filters} setFilters={setFilters} />
          </div>

          <div className="relative w-full max-w-full pb-10">
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
              <div className="relative w-full max-w-full">
                <Input
                  iconLeft={<SearchIcon className="h-4 w-4" />}
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
          </div>
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
