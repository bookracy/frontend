import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { BookCard, SkeletonBookCard } from "@/components/books/book-card";

export const Route = createFileRoute("/featured")({
  component: Feature,
});

function Feature() {
  const [books, setBooks] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/bookracy/static/main/trending.json")
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        setCategories(Object.keys(data));
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="flex h-full w-full justify-center">
      <div className="flex w-full flex-col">
        {categories.map((category: string) => (
          <div key={category} className="mb-8">
            <h1 className="text-2xl font-bold mb-4">
              {category.replace("_", " ").split(" ").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </h1>
            <div className="grid grid-cols-2 gap-4">
              {books[category].length > 0 ? (
                books[category].map((book: any) => (
                  <BookCard key={book.md5} {...book} />
                ))
              ) : (
                Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonBookCard key={i} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
