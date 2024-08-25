import { queryOptions } from "@tanstack/react-query";
import { ofetch } from "ofetch";
import { BookItemResponse } from "../types";

export const getTrending = async () => {
  return ofetch<Record<string, BookItemResponse[]>>("https://raw.githubusercontent.com/bookracy/static/main/trending.json", {
    parseResponse: (response) => JSON.parse(response),
  });
};

export const getTrendingQueryOptions = queryOptions({
  queryKey: ["trending"],
  queryFn: getTrending,
});
