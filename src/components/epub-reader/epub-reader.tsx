import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { AArrowDown, AArrowUp, BookOpen, DownloadIcon, X } from "lucide-react";
import { ThemeToggle } from "../layout/theme-toggle";
import { useSettingsStore } from "@/stores/settings";
import { saveAs } from "@/lib/saveAs";
import Rendition from "epubjs/types/rendition";
import { ClipBoardButton } from "../layout/clipboard-button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { TocSheet } from "./toc-sheet";
import { NavItem } from "epubjs";
import { EpubView, EpubViewInstance } from "./epub-view";
import { cn } from "@/lib/utils";
import { useSwipeable } from "react-swipeable";

interface EpubReaderProps {
  title: string;
  link: string;
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function EpubReader(props: EpubReaderProps) {
  const readerRef = useRef<EpubViewInstance>(null);
  const renditionRef = useRef<Rendition | null>(null);

  const [toc, setToc] = useState<NavItem[]>([]);
  const [location, setLocation] = useState<string | number>(1);
  const [fontSize, setFontSize] = useState(16);
  const [page, setPage] = useState({
    current: 1,
    total: 1,
  });

  const theme = useSettingsStore((state) => state.theme);

  const handlers = useSwipeable({
    onSwipedRight: () => readerRef.current?.prevPage(),
    onSwipedLeft: () => readerRef.current?.nextPage(),
    trackMouse: true,
  });

  const adjustFontSize = (adjustment: number) => {
    setFontSize((prev) => {
      const newSize = Math.max(12, Math.min(36, prev + adjustment));
      if (renditionRef.current) {
        renditionRef.current.themes.fontSize(`${newSize}px`);
      }
      return newSize;
    });
  };

  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.override("background", theme === "dark" ? "#050505" : "#fff");
      renditionRef.current.themes.override("color", theme === "dark" ? "#fff" : "#050505");
    }
  }, [theme]);

  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${fontSize}px`);
    }
  }, [fontSize]);

  return (
    <Dialog open={props.open} onOpenChange={props.setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex w-fit items-center gap-2">
          <BookOpen className="text-lg" />
          Open
        </Button>
      </DialogTrigger>
      <VisuallyHidden.Root>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogDescription>Read {props.title} in an interactive reader</DialogDescription>
      </VisuallyHidden.Root>
      <DialogContent className="max-w-screen h-screen p-0" includeClose={false}>
        <div className="flex h-full flex-col">
          <div className="flex w-full flex-col items-center justify-between gap-4 border-b p-4 md:flex-row md:gap-0">
            <div className="flex items-center gap-4">
              <TocSheet toc={toc} setLocation={setLocation} />
              <h2 className="line-clamp-1 text-lg font-semibold">{props.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <ClipBoardButton content={props.link ?? ""} />
              <Button onClick={() => saveAs(props.link)} variant="outline" size="icon">
                <DownloadIcon className="text-xl" />
              </Button>
              <Button onClick={() => adjustFontSize(4)} className="flex items-center" variant="outline" size="icon">
                <AArrowUp className="text-xl" />
              </Button>
              <Button onClick={() => adjustFontSize(-4)} className="flex items-center" variant="outline" size="icon">
                <AArrowDown className="text-xl" />
              </Button>
              <ThemeToggle className="h-10 w-10 rounded-md" />
              <Button onClick={() => props.setIsOpen(false)} variant="outline" size="icon">
                <X className="text-xl" />
              </Button>
            </div>
          </div>
          <div className="relative h-full">
            {/* Hack to have swipe events for the iframe */}
            <div {...handlers} className="absolute inset-0 z-10 bg-transparent" />
            <div
              className={cn("absolute inset-0 z-0", {
                "bg-white": theme === "light",
                "bg-[#050505]": theme === "dark",
              })}
            >
              <EpubView
                ref={readerRef}
                url={props.link}
                location={location}
                tocChanged={setToc}
                locationChanged={(loc) => {
                  setLocation(loc);
                  setPage({
                    current: renditionRef.current?.location.start.displayed.page || 1,
                    total: renditionRef.current?.location.start.displayed.total || 1,
                  });
                }}
                getRendition={(rendition) => {
                  rendition.themes.override("color", theme === "dark" ? "#fff" : "#050505");
                  rendition.themes.override("background", theme === "dark" ? "#050505" : "#fff");
                  renditionRef.current = rendition;
                }}
              />
            </div>

            <div className="absolute right-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {page.current}/{page.total}
              </span>
            </div>

            <div className="absolute bottom-1 z-10 flex w-full items-center justify-center gap-10">
              <Button variant="outline" onClick={() => readerRef.current?.prevPage()} className="w-32">
                Previous
              </Button>
              <Button variant="outline" onClick={() => readerRef.current?.nextPage()} className="w-32">
                Next
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
