import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { getTrendingBooksQueryOptions, getTrendingExternalDownloadsQueryOptions } from "@/api/backend/trending/trending";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { BookList } from "@/components/books/book-list";
import { BookItemWithExternalDownloads } from "@/api/backend/types";

export const Route = createFileRoute("/featured")({
  component: Feature,
  async beforeLoad(ctx) {
    await ctx.context.queryClient.ensureQueryData(getTrendingBooksQueryOptions);
  },
});

function Feature() {
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
    <div className="flex h-full w-full justify-center">
      <div className="flex w-full flex-col">
        {categories.map((category: string) => (
          <div key={category} className="mb-8">
            <h1 className="mb-4 text-2xl font-bold">
              {category
                .replace("_", " ")
                .split(" ")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h1>
            <div>{trendingBooksData[category].length > 0 ? <BookList books={trendingData?.[category] ?? trendingBooksData[category]} /> : null}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
