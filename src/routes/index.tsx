import { useGetBooksQueryWithExternalDownloads } from "@/api/backend/search/search";
import { SkeletonBookItem, SkeletonBookItemGrid } from "@/components/books/book-item";
import { useDebounce } from "@/hooks/use-debounce";
import { useSettingsStore } from "@/stores/settings";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { NavLink } from "@/components/ui/nav-link";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { Filters, FilterProps } from "@/components/books/filters";
import { BookList } from "@/components/books/book-list";
import { BookGallery } from "@/components/books/book-gallery";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getTrendingQueryOptions } from "@/api/backend/trending/trending";

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

  const {
    data: searchData,
    error: searchError,
    isLoading: isSearchLoading,
  } = useGetBooksQueryWithExternalDownloads({
    query: debouncedQ,
    lang: language,
    limit: filters.perPage,
  });

  const { data: trendingData } = useSuspenseQuery(getTrendingQueryOptions);
  const categories = useMemo(() => Object.keys(trendingData ?? {}), [trendingData]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">
          Welcome to <span className="text-primary">Bookracy</span> 📚
        </h1>
        <div className="text-muted-foreground flex flex-col gap-2">
          <p className="text-lg">
            Bookracy is a free and open-source web app that allows you to read and download your favorite books, comics, and manga.
            <br />
            To get started, either search below or navigate the site using the sidebar.
          </p>
          <div className="text-primary hover:underline">
            <NavLink to="/about">About Us</NavLink>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Input
            iconLeft={<SearchIcon className="h-5 w-5" />}
            placeholder="Search for books, comics, or manga..."
            value={q}
            onChange={(e) =>
              navigate({
                search: {
                  q: e.target.value,
                },
              })
            }
            className="h-14 text-lg"
          />
        </div>

        {q && (
          <div className="flex flex-col gap-4">
            <Filters filters={filters} setFilters={setFilters} />

            {isSearchLoading && (
              <div className={filters.view === "grid" ? "grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-3 xl:grid-cols-4" : "flex flex-col gap-4"}>
                {Array.from({ length: filters.perPage }).map((_, i) => (filters.view === "grid" ? <SkeletonBookItemGrid key={i} /> : <SkeletonBookItem key={i} />))}
              </div>
            )}
            {searchError && <p className="text-red-500">Error: {searchError.message}</p>}

            {searchData && filters.view === "list" && <BookList books={searchData.results} />}
            {searchData && filters.view === "grid" && <BookGallery books={searchData.results} />}
          </div>
        )}

        {!q && trendingData && (
          <div className="flex flex-col gap-8">
            {categories.map((category: string) => (
              <div key={category} className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">
                  {category
                    .replace("_", " ")
                    .split(" ")
                    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h2>
                {trendingData[category].length > 0 && <BookGallery books={trendingData[category]} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
