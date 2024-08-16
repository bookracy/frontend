/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { SearchResultItem } from "@/api/search/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { saveAs } from "@/lib/saveAs";
import PlaceholderImage from "@/assets/placeholder.png";
import { AspectRatio } from "../ui/aspect-ratio";
import { Dialog, DialogContent } from "../ui/dialog";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faBookOpen, faTimes, faFont, faMoon, faSun, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { ReactReader } from "react-reader";
import { Skeleton } from "../ui/skeleton";

type BookItemProps = SearchResultItem;

export function BookItem(props: BookItemProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [location, setLocation] = useState<string | number>(0);
  const [theme, setTheme] = useState('light');
  const renditionRef = useRef<any>(null);

  const isEpub = Boolean(props.link?.toLowerCase().endsWith(".epub"));

  const handleOpenReader = () => {
    setIsReaderOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseReader = () => {
    setIsReaderOpen(false);
    document.body.style.overflow = "auto";
  };

  const adjustFontSize = (adjustment: number) => {
    setFontSize((prev) => {
      const newSize = Math.max(12, Math.min(36, prev + adjustment));
      if (renditionRef.current) {
        renditionRef.current.themes.fontSize(`${newSize}px`);
      }
      return newSize;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const onLocationChanged = (newLocation: string) => {
    setLocation(newLocation);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(props.link ?? '');
    alert('Link copied to clipboard!');
  };

  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${fontSize}px`);
    }
  }, [fontSize]);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="w-full md:w-1/4">
            <AspectRatio ratio={5 / 8} className="flex items-center">
              <img
                src={props.book_image ?? PlaceholderImage}
                alt={props.title}
                className="rounded-lg object-cover hover:opacity-80 transition-opacity duration-300"
              />
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{props.title}</h2>
              <p className="text-md text-gray-700">By {props.authors}</p>
              <p className="text-sm text-gray-600 mt-2">{props.book_content}</p>
              <p className="text-sm text-gray-600 mt-2">Language: {props.book_lang}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                disabled={!props.link} 
                onClick={() => saveAs(props.link)} 
                className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <FontAwesomeIcon icon={faDownload} className="text-lg" /> 
                Download ({props.book_size})
              </Button>
              {isEpub && (
                <Button 
                  onClick={handleOpenReader} 
                  className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="text-lg" /> 
                  Read Online
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {isEpub && isReaderOpen && (
        <Dialog>
          <DialogContent className={`relative max-w-full p-0 h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold truncate flex-1">{props.title}</h2>
                <div className="flex items-center gap-2">
                  <Button onClick={handleShare} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    <FontAwesomeIcon icon={faShareAlt} className="text-xl" />
                  </Button>
                  <Button onClick={() => saveAs(props.link)} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    <FontAwesomeIcon icon={faDownload} className="text-xl" />
                  </Button>
                  <Button
                    onClick={toggleTheme}
                    className={`p-3 rounded-full border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} transition-transform transform flex items-center justify-center`}
                  >
                    <FontAwesomeIcon
                      icon={theme === 'light' ? faMoon : faSun}
                      className={`text-2xl transition-transform duration-500 ${theme === 'light' ? 'rotate-0' : 'rotate-180'}`}
                    />
                  </Button>
                  <Button onClick={() => adjustFontSize(4)} className="p-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center">
                    <FontAwesomeIcon icon={faFont} className="text-xl" />
                    <span className="ml-1 text-lg">A+</span>
                  </Button>
                  <Button onClick={() => adjustFontSize(-4)} className="p-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center">
                    <FontAwesomeIcon icon={faFont} className="text-xl" />
                    <span className="ml-1 text-lg">A-</span>
                  </Button>
                  <Button onClick={handleCloseReader} className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <ReactReader
                  url={props.link}
                  location={location}
                  locationChanged={onLocationChanged}
                  getRendition={(rendition) => {
                    renditionRef.current = rendition;
                    rendition.themes.default({
                      body: {
                        color: theme === 'dark' ? '#fff' : '#000',
                        fontSize: `${fontSize}px`,
                        lineHeight: "1.6",
                        padding: "20px",
                        fontFamily: "'Roboto', sans-serif",
                      },
                    });
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}



export function SkeletonBookItem() {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <Skeleton className="h-[280px] w-full md:w-1/4 rounded-lg" />
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Skeleton className="h-8 w-3/4 rounded mb-2" />
              <Skeleton className="h-5 w-1/2 rounded" />
              <Skeleton className="h-4 w-full rounded mt-2" />
              <Skeleton className="h-4 w-1/3 rounded mt-2" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Skeleton className="h-10 w-32 rounded" />
              <Skeleton className="h-10 w-32 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
