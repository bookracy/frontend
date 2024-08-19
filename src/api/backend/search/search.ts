import { useQuery } from "@tanstack/react-query";
import { BaseRequest, client } from "../base";
import { SearchParams, SearchResultItem } from "./types";

export const getBooks = (params: SearchParams) => {
  return client<BaseRequest<SearchResultItem>>("/books", {
    query: params,
  });
};

export const useGetBooksQuery = (params: SearchParams) =>
  useQuery({
    queryKey: ["search", params],
    queryFn: () => getBooks(params),
    enabled: params.query !== "",
  });
