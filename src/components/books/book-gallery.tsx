import { BookItem, BookItemWithExternalDownloads } from "@/api/backend/types";
import { BookItemDialog } from "./book-item";

interface BookGalleryProps {
  books: BookItemWithExternalDownloads[] | BookItem[];
}

export function BookGallery({ books }: BookGalleryProps) {
  return (
    <div className="grid gap-4 sm:gap-8 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookItemDialog key={book.md5} {...book} />
      ))}
    </div>
  );
}
