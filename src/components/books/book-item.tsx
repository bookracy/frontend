import React, { useState } from "react";
import { SearchResultItem } from "@/api/search/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { saveAs } from "@/lib/saveAs";
import PlaceholderImage from "@/assets/placeholder.png";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";
import { ReactReader } from "react-reader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../ui/dialog";

type BookItemProps = SearchResultItem;

export function BookItem(props: BookItemProps) {
  const [location, setLocation] = useState<string | number>(0);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const handleOpenReader = () => {
    setIsReaderOpen(true);
  };

  const handleCloseReader = () => {
    setIsReaderOpen(false);
  };

  const isEpub = props.link?.endsWith(".epub");

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="w-[200px]">
            <AspectRatio ratio={5 / 8} className="flex items-center">
              <img
                src={props.book_image ?? PlaceholderImage}
                alt={props.title}
                className="rounded-md object-cover"
              />
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-4">
            <h2>{props.title}</h2>
            <p>Authors: {props.authors}</p>
            <p>Content: {props.book_content}</p>
            <p>Language: {props.book_lang}</p>
          </div>
          <div className="flex flex-col justify-end gap-2">
            <Button disabled={!props.link} onClick={() => saveAs(props.link)}>
              Download ({props.book_size})
            </Button>
            {isEpub && (
              <Button onClick={handleOpenReader}>
                Open in Inbuilt Reader
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      {isEpub && isReaderOpen && (
        <Dialog open={isReaderOpen} onOpenChange={setIsReaderOpen}>
          <DialogContent className="fixed inset-0 flex flex-col bg-gray-900 text-white">
            <DialogHeader className="flex items-center justify-between p-4 bg-gray-800">
              <DialogTitle>{props.title}</DialogTitle>
              <DialogClose onClick={handleCloseReader} />
            </DialogHeader>
            <div className="flex-1" style={{ height: '100vh' }}>
              <ReactReader
                url={props.link}
                location={location}
                locationChanged={(epubcfi: string) => setLocation(epubcfi)}
              
            
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}

export function SkeletonBookItem() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Skeleton className="h-[280px] w-[200px] rounded-md" />
          <div className="flex flex-1 flex-col justify-center gap-4">
            <Skeleton className="h-6 rounded" />
            <Skeleton className="h-4 rounded" />
            <Skeleton className="h-4 rounded" />
            <div className="flex flex-col justify-end gap-2">
              <Skeleton className="h-10 w-32 rounded" />
              <Skeleton className="h-10 w-40 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
