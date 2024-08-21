import { BookItem, SkeletonBookItem } from "@/components/books/book-item";
import { useState, useEffect } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/featured")({
  component: Feature,
});

function Feature() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/bookracy/static/main/trending.json")
      .then(response => response.json())
      .then(data => setBooks(data.results))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex w-full flex-col">
        {books.length > 0 ? (
          <div className="flex flex-col gap-4">
            {books.map((book) => (
              <BookItem key={book.md5} {...book} />
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
              <CardDescription className="flex flex-col gap-8">
                Please wait while we fetch the data.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}