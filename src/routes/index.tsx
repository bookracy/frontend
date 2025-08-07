import { useGetBooksQuery, useExternalDownloadsForBooksQuery } from "@/api/backend/search/search";
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
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { getTrendingBooksQueryOptions, getTrendingExternalDownloadsQueryOptions } from "@/api/backend/trending/trending";
import { BookItemWithExternalDownloads } from "@/api/backend/types";

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

  // Fetch books immediately
  const {
    data: booksData,
    error: searchError,
    isLoading: isSearchLoading,
  } = useGetBooksQuery({
    query: debouncedQ,
    lang: language,
    limit: filters.perPage,
  });

  // Fetch external downloads separately in the background
  const { data: externalDownloadsData } = useExternalDownloadsForBooksQuery(booksData?.results ?? [], Boolean(booksData?.results?.length));

  // Show books immediately when available, update when external downloads arrive
  const displayBooks: BookItemWithExternalDownloads[] = useMemo(() => {
    if (!booksData?.results) return [];

    return booksData.results.map((book) => {
      const externalDownload = externalDownloadsData?.find((ed) => ed.md5 === book.md5);
      return {
        ...book,
        externalDownloads: externalDownload?.external_downloads,
        ipfs: externalDownload?.ipfs,
        // Add a flag to indicate if external downloads have been fetched for this book
        externalDownloadsFetched: externalDownloadsData !== undefined,
      };
    });
  }, [booksData?.results, externalDownloadsData]);

  // Fetch trending books immediately
  const { data: trendingBooksData } = useSuspenseQuery(getTrendingBooksQueryOptions);

  // Fetch trending external downloads separately in the background
  const { data: trendingExternalDownloadsData } = useQuery(getTrendingExternalDownloadsQueryOptions(trendingBooksData));

  // Combine trending books with external downloads when available
  const trendingData = useMemo(() => {
    if (!trendingBooksData) return null;

    return Object.fromEntries(
      Object.entries(trendingBooksData).map(([category, books]) => [
        category,
        books.map((book) => {
          const externalDownload = trendingExternalDownloadsData?.find((ed) => ed.md5 === book.md5);
          return {
            ...book,
            externalDownloads: externalDownload?.external_downloads,
            ipfs: externalDownload?.ipfs,
            // Add a flag to indicate if external downloads have been fetched for this book
            externalDownloadsFetched: trendingExternalDownloadsData !== undefined,
          };
        }),
      ]),
    );
  }, [trendingBooksData, trendingExternalDownloadsData]);

  const categories = useMemo(() => Object.keys(trendingBooksData ?? {}), [trendingBooksData]);

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

            {booksData?.results && booksData.results.length > 0 && filters.view === "list" && <BookList books={displayBooks} />}
            {booksData?.results && booksData.results.length > 0 && filters.view === "grid" && <BookGallery books={displayBooks} />}
          </div>
        )}

        {!q && trendingBooksData && (
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
                {trendingBooksData[category].length > 0 && <BookGallery books={trendingData?.[category] ?? trendingBooksData[category]} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
