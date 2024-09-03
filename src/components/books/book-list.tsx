import { BookItem } from "@/api/backend/types";
import { BookItemCard } from "./book-item";

interface BookListProps {
  books: BookItem[];
  className?: string;
}

export function BookList({ books, className = "flex flex-col gap-4 md:grid md:grid-cols-2" }: BookListProps) {
  return (
    <div className={className}>
      {books.map((book) => (
        <BookItemCard key={book.md5} {...book} />
      ))}
    </div>
  );
}
