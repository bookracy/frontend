import { useQuery } from "@tanstack/react-query";
import { BaseRequest, client } from "../base";
import { BookItemResponse } from "../types";
import { SearchParams } from "./types";

export const getBooks = (params: SearchParams) => {
  return client<BaseRequest<BookItemResponse>>("/books", {
    query: params,
  });
};

export const useGetBooksQuery = (params: SearchParams) =>
  useQuery({
    queryKey: ["search", params],
    queryFn: () => getBooks(params),
    enabled: params.query !== "",
  });
