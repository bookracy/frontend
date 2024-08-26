import { createFileRoute } from "@tanstack/react-router";
import React, { useMemo } from "react";
import { BookItem } from "@/components/books/book-item";
import { getTrendingQueryOptions } from "@/api/backend/trending/trending";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/featured")({
  component: Feature,
  async beforeLoad(ctx) {
    await ctx.context.queryClient.ensureQueryData(getTrendingQueryOptions);
  },
});

function Feature() {
  const { data } = useSuspenseQuery(getTrendingQueryOptions);

  const categories = useMemo(() => Object.keys(data ?? {}), [data]);

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
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">{data[category].length > 0 ? data[category].map((book) => <BookItem key={book.md5} {...book} />) : null}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
