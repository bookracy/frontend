import { useQuery } from "@tanstack/react-query";
import { BaseRequest, client } from "../base";
import { BookItem } from "../types";
import { SearchParams } from "./types";
import { getExternalDownloads } from "../downloads/external";
import { ExternalDownloadResponse } from "../downloads/types";

export const getBooks = (params: SearchParams) => {
  return client<BaseRequest<BookItem>>("/books", {
    query: params,
  });
};

export const useGetBooksQuery = (params: SearchParams) =>
  useQuery({
    queryKey: ["search", params],
    queryFn: () => getBooks(params),
    enabled: params.query !== "",
  });

export const useGetBooksQueryWithExternalDownloads = (params: SearchParams) => {
  return useQuery({
    queryKey: ["search", params],
    queryFn: async () => {
      const books = await getBooks(params);
      const externalDownloads: ExternalDownloadResponse = [];
      for (let i = 0; i < params.limit; i += 10) {
        const batch = books.results.slice(i, i + 3).map((book) => book.md5);
        const batchExternalDownloads = await getExternalDownloads(batch);
        externalDownloads.push(...batchExternalDownloads);
      }
      return {
        ...books,
        results: books.results.slice(0, params.limit).map((book) => ({
          ...book,
          externalDownloads: externalDownloads.find((b) => b.md5 === book.md5)?.external_downloads,
          ipfs: externalDownloads.find((b) => b.md5 === book.md5)?.ipfs,
        })),
      };
    },
    enabled: params.query !== "",
  });
};

export const useGetBooksByMd5sQuery = (md5s: string[]) => {
  return useQuery({
    queryKey: ["search", md5s],
    queryFn: async () => {
      const books: BookItem[] = [];
      for (const md5 of md5s) {
        const response = await getBooks({ query: md5, lang: "all", limit: 1 });
        books.push(response.results[0]);
      }
      return books;
    },
    enabled: md5s.length > 0,
  });
};
