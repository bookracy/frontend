import { useQuery } from "@tanstack/react-query";
import { BaseRequest, client } from "../base";
import { BookItem } from "../types";
import { SearchParams } from "./types";

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
