import { BookItem, BookItemWithExternalDownloads } from "@/api/backend/types";
import { BookItemCard } from "./book-item";

interface BookListProps {
  books: BookItemWithExternalDownloads[] | BookItem[];
}

export function BookList({ books }: BookListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {books.map((book) => (
        <BookItemCard key={book.md5} {...book} />
      ))}
    </div>
  );
}
