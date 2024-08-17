import React, { useState } from "react";
import { SearchResultItem } from "@/api/search/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { saveAs } from "@/lib/saveAs";
import PlaceholderImage from "@/assets/placeholder.png";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";
import { BookOpen, DownloadIcon } from "lucide-react";
import { EpubReader } from "./epub-reader";

type BookItemProps = SearchResultItem;

export function BookItem(props: BookItemProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const isEpub = Boolean(props.link?.toLowerCase().endsWith(".epub"));

  return (
    <Card className="shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <div className="mx-2 w-[100px]">
            <AspectRatio ratio={1 / 2} className="flex items-center">
              <img src={props.book_image ?? PlaceholderImage} alt={props.title} className="rounded-lg object-cover transition-transform duration-300 hover:scale-110 hover:shadow-xl" />
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold">{props.title}</h2>
              <p className="text-md dark:text-gray-400">By {props.authors}</p>
              <p className="mt-2 text-sm dark:text-gray-400">{props.book_content}</p>
              <p className="mt-2 text-sm dark:text-gray-400">Language: {props.book_lang}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-5">
              <Button disabled={!props.link} onClick={() => saveAs(props.link)} className="flex items-center gap-2">
                <DownloadIcon className="text-lg" />
                Download ({props.book_size})
              </Button>
              {isEpub && (
                <Button onClick={() => setIsReaderOpen(true)} className="flex items-center gap-2">
                  <BookOpen className="text-lg" />
                  Read Online
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      {isEpub && isReaderOpen && <EpubReader title={props.title} link={props.link} setIsOpen={setIsReaderOpen} />}
    </Card>
  );
}

export function SkeletonBookItem() {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <Skeleton className="h-[280px] w-full rounded-lg md:w-1/4" />
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Skeleton className="mb-2 h-8 w-3/4 rounded" />
              <Skeleton className="h-5 w-1/2 rounded" />
              <Skeleton className="mt-2 h-4 w-full rounded" />
              <Skeleton className="mt-2 h-4 w-1/3 rounded" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-10 w-32 rounded" />
              <Skeleton className="h-10 w-32 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
