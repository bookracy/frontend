import { queryOptions } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { BookItem } from "../types";
import { getExternalDownloads } from "../downloads/external";

export const getTrending = async () => {
  return ofetch<Record<string, BookItem[]>>("https://raw.githubusercontent.com/bookracy/static/main/trending.json", {
    parseResponse: (response) => JSON.parse(response),
  });
};

export const getTrendingQueryOptions = queryOptions({
  queryKey: ["trending"],
  queryFn: async () => {
    const categoriesWithBooks = await getTrending();
    const md5s = Object.values(categoriesWithBooks)
      .flat()
      .map((book) => book.md5);
    const externalDownloads = await getExternalDownloads(md5s);

    return Object.fromEntries(
      Object.entries(categoriesWithBooks).map(([category, books]) => [
        category,
        books.map((book) => ({
          ...book,
          externalDownloads: externalDownloads.find((b) => b.md5 === book.md5)?.external_downloads,
          ipfs: externalDownloads.find((b) => b.md5 === book.md5)?.ipfs,
        })),
      ]),
    );
  },
});
