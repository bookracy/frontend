import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import md5 from "md5";

interface BookProgress {
  title: string;
  link: string;
  location: string;
  currentPage: number;
  totalPages: number;
}

export function ContinueReading() {
  const [books, setBooks] = useState<BookProgress[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("book-progress-"));
    const savedBooks = keys.map((key) => JSON.parse(localStorage.getItem(key) || "{}"));
    setBooks(savedBooks);
  }, []);

  return (
    <div className="continue-reading">
      <h2 className="text-lg font-semibold">Continue Reading</h2>
      {books.length === 0 ? (
        <p>No books to continue reading.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={md5(book.link)} className="mb-4">
              <h3 className="text-md font-medium">{book.title}</h3>
              <p>
                Page {book.currentPage} of {book.totalPages}
              </p>
              <Button as="a" href={`/reader?title=${encodeURIComponent(book.title)}&link=${encodeURIComponent(book.link)}&location=${encodeURIComponent(book.location)}`}>
                Continue Reading
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
