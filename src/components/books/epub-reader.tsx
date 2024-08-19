import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { AArrowDown, AArrowUp, DownloadIcon, X } from "lucide-react";
import { ThemeToggle } from "../layout/theme-toggle";
import { IReactReaderStyle, ReactReader, ReactReaderStyle } from "react-reader";
import { useSettingsStore } from "@/stores/settings";
import { saveAs } from "@/lib/saveAs";
import Rendition from "epubjs/types/rendition";
import { ClipBoardButton } from "../layout/clipboard-button";

interface EpubReaderProps {
  title: string;
  link: string;
  setIsOpen: (isOpen: boolean) => void;
}

const lightReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  readerArea: {
    ...ReactReaderStyle.readerArea,
    transition: undefined,
  },
};

const darkReaderTheme: IReactReaderStyle = {
  ...ReactReaderStyle,
  arrow: {
    ...ReactReaderStyle.arrow,
    color: "white",
  },
  arrowHover: {
    ...ReactReaderStyle.arrowHover,
    color: "#ccc",
  },
  readerArea: {
    ...ReactReaderStyle.readerArea,
    backgroundColor: "#111",
    color: "#ccc",
    transition: undefined,
  },
  titleArea: {
    ...ReactReaderStyle.titleArea,
    color: "#ccc",
  },
  tocArea: {
    ...ReactReaderStyle.tocArea,
    background: "#111",
  },
  tocButtonExpanded: {
    ...ReactReaderStyle.tocButtonExpanded,
    background: "#222",
  },
  tocButtonBar: {
    ...ReactReaderStyle.tocButtonBar,
    background: "#fff",
  },
  tocButton: {
    ...ReactReaderStyle.tocButton,
    color: "white",
  },
  toc: {
    ...ReactReaderStyle.reader,
    color: "white",
  },
};

export function EpubReader(props: EpubReaderProps) {
  const [location, setLocation] = useState<string | number>(0);
  const [fontSize, setFontSize] = useState(16);
  const theme = useSettingsStore((state) => state.theme);
  const renditionRef = useRef<Rendition | null>(null);

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
    <Dialog>
      <DialogContent className="relative h-screen max-w-full p-0">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="flex-1 truncate text-lg font-semibold">{props.title}</h2>
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
          <div className="relative flex-1 overflow-hidden">
            <ReactReader
              url={props.link}
              location={location}
              locationChanged={(newLocation) => setLocation(newLocation)}
              readerStyles={theme === "dark" ? darkReaderTheme : lightReaderTheme}
              getRendition={(rendition) => {
                rendition.themes.override("color", theme === "dark" ? "#fff" : "#050505");
                rendition.themes.override("background", theme === "dark" ? "#050505" : "#fff");
                renditionRef.current = rendition;
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
