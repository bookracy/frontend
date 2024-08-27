import { BookItemResponse } from "@/api/backend/types";
import { BookItem } from "./book-item";

interface BookListProps {
  books: BookItemResponse[];
  className?: string;
}

export function BookList({ books, className = "flex flex-col gap-4 md:grid md:grid-cols-2" }: BookListProps) {
  return (
    <div className={className}>
      {books.map((book) => (
        <BookItem key={book.md5} {...book} />
      ))}
    </div>
  );
}
