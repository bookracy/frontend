import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import Epub, { Book } from "epubjs";
import type { NavItem, Rendition, Location } from "epubjs";
import type { BookOptions } from "epubjs/types/book";

export type IEpubViewProps = {
  url: string | ArrayBuffer;
  epubInitOptions?: Partial<BookOptions>;
  location: string | number | null;
  locationChanged(value: string): void;
  tocChanged?(value: NavItem[]): void;
  getRendition?(rendition: Rendition): void;
  handleKeyUp?(): void;
};

export interface EpubViewInstance {
  nextPage: () => void;
  prevPage: () => void;
}

export const EpubView = forwardRef<EpubViewInstance, IEpubViewProps>(({ url, epubInitOptions = {}, location, locationChanged, tocChanged, getRendition, handleKeyUp }, ref) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<Book | null>(null);
  const renditionRef = useRef<Rendition | null>(null);

  const onLocationChange = useCallback(
    (loc: Location) => {
      locationChanged?.(`${loc.start}`);
    },
    [locationChanged],
  );

  const prevPage = useCallback(() => {
    renditionRef.current?.prev();
  }, []);

  const nextPage = useCallback(() => {
    renditionRef.current?.next();
  }, []);

  const handleKeys = useCallback(
    (event: KeyboardEvent) => {
      if (handleKeyUp) {
        handleKeyUp();
        return;
      }
      if (event.key === "ArrowRight") {
        nextPage();
      } else if (event.key === "ArrowLeft") {
        prevPage();
      }
    },
    [handleKeyUp, prevPage, nextPage],
  );

  const registerEvents = useCallback(
    (rendition: Rendition) => {
      rendition.on("locationChanged", onLocationChange);
    },
    [onLocationChange],
  );

  const getTotalPages = useCallback(async () => {
    if (bookRef.current) {
      await bookRef.current.locations.generate(1600); // placeholder lads
      const totalPages = bookRef.current.locations.total;
      console.log(`Total pages: ${totalPages}`);
      return totalPages;
    }
  }, []);

  const initReader = useCallback(async () => {
    if (viewerRef.current && bookRef.current) {
      const rendition = bookRef.current.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
      });

      renditionRef.current = rendition;

      const { toc } = await bookRef.current.loaded.navigation;
      tocChanged?.(toc);

      if (typeof location === "string" || typeof location === "number") {
        rendition.display(`${location}`);
      } else if (toc.length > 0 && toc[0].href) {
        rendition.display(toc[0].href);
      } else {
        rendition.display();
      }

      registerEvents(rendition);
      getRendition?.(rendition);
      await getTotalPages();
    }
  }, [tocChanged, location, registerEvents, getRendition, getTotalPages]);

  const initBook = useCallback(() => {
    if (bookRef.current) {
      bookRef.current.destroy();
    }

    const book = Epub(url, epubInitOptions);
    bookRef.current = book;
    initReader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    initBook();
    document.addEventListener("keyup", handleKeys);

    return () => {
      bookRef.current?.destroy();
      bookRef.current = null;
      renditionRef.current = null;
      document.removeEventListener("keyup", handleKeys);
    };
  }, [handleKeys, initBook]);

  useEffect(() => {
    if (renditionRef.current && location) {
      renditionRef.current.display(`${location}`);
    }
  }, [location]);

  useImperativeHandle(ref, () => ({
    nextPage,
    prevPage,
  }));

  return (
    <div className="relative h-full w-full">
      <div className="h-full pb-6" ref={viewerRef} />
    </div>
  );
});
