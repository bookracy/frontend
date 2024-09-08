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

  const handleKeyUpInternal = useCallback(
    (event: KeyboardEvent) => {
      if (handleKeyUp) {
        handleKeyUp();
        return;
      }
      if (event.key === "ArrowRight") {
        prevPage();
      } else if (event.key === "ArrowLeft") {
        nextPage();
      }
    },
    [handleKeyUp, prevPage, nextPage],
  );

  const registerEvents = useCallback(
    (rendition: Rendition) => {
      rendition.on("locationChanged", onLocationChange);
      document.addEventListener("keyup", handleKeyUpInternal);
    },
    [handleKeyUpInternal, onLocationChange],
  );

  const initReader = useCallback(async () => {
    if (viewerRef.current && bookRef.current) {
      const rendition = bookRef.current.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
      });

      renditionRef.current = rendition;

      const { toc } = await bookRef.current.loaded.navigation;
      tocChanged?.(toc || []);

      if (typeof location === "string" || typeof location === "number") {
        rendition.display(`${location}`);
      } else if (toc.length > 0 && toc[0].href) {
        rendition.display(toc[0].href);
      } else {
        rendition.display();
      }

      registerEvents(rendition);
      getRendition?.(rendition);
    }
  }, [tocChanged, location, registerEvents, getRendition]);

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
    return () => {
      bookRef.current?.destroy();
      bookRef.current = null;
      renditionRef.current = null;
      document.removeEventListener("keyup", handleKeyUpInternal);
    };
  }, [handleKeyUpInternal, initBook]);

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
