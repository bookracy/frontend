import React, { useState } from "react";
import { BookItem, BookItemWithExternalDownloads } from "@/api/backend/types";
import { Card, CardContent } from "../ui/card";
import PlaceholderImage from "@/assets/placeholder.png";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";
import { EpubReader } from "./epub-reader";
import { BookmarkButton } from "./bookmark";
import { BookDownloadButton } from "./download-button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

type BookItemProps = BookItemWithExternalDownloads | BookItem;

export function BookItemCard(props: BookItemProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const isEpub = Boolean(props.link?.toLowerCase().endsWith(".epub"));
  return (
    <Card className="shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="relative p-4 md:p-6">
        <div className="absolute right-4 top-4">
          <BookmarkButton book={props} />
        </div>

        <div className="flex flex-col gap-4 pt-12 sm:pt-0 md:flex-row md:gap-6">
          <div className="mx-2 w-full max-w-[200px] md:w-1/4">
            <AspectRatio ratio={5 / 8} className="flex items-center">
              <img
                src={props.book_image ?? PlaceholderImage}
                alt={props.title}
                className="rounded-lg object-cover transition-transform duration-300 hover:scale-110 hover:shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = PlaceholderImage;
                }}
                onClick={() => setIsReaderOpen(true)}
              />
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="max-w-[90%] text-2xl font-bold">{props.title}</h2>
                <p className="text-md dark:text-gray-400">By {props.authors}</p>
              </div>
              <p className="line-clamp-3 text-sm dark:text-gray-400">{props.description}</p>
              <p className="text-sm dark:text-gray-400">{props.book_content}</p>
              <p className="text-sm dark:text-gray-400">Language: {props.book_lang}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-5">
              {"externalDownloads" in props && <BookDownloadButton externalDownloads={props.externalDownloads} primaryLink={props.link} />}
              {isEpub && <EpubReader title={props.title} link={props.link} open={isReaderOpen} setIsOpen={setIsReaderOpen} />}
            </div>
          </div>
        </div>
      </CardContent>
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

export function BookItemDialog(props: BookItemProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const isEpub = Boolean(props.link?.toLowerCase().endsWith(".epub"));

  return (
    <Dialog>
      <div className="flex flex-col">
        <Card>
          <CardContent>
            <div className="relative flex flex-col pt-6">
              <DialogTrigger asChild>
                <AspectRatio ratio={10 / 16}>
                  <img
                    src={props.book_image ?? PlaceholderImage}
                    alt={props.title}
                    className="h-full w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                    onError={(e) => {
                      e.currentTarget.src = PlaceholderImage;
                    }}
                  />
                </AspectRatio>
              </DialogTrigger>
              <div className="absolute right-1 top-7">
                <BookmarkButton book={props} />
              </div>
            </div>
          </CardContent>
        </Card>
        <h2 className="line-clamp-2 text-lg font-semibold">{props.title}</h2>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>By {props.authors}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p>{props.description}</p>
          <p>{props.book_content}</p>
          <p>Language: {props.book_lang}</p>
        </div>

        <DialogFooter className="flex flex-row justify-between md:justify-end">
          {"externalDownloads" in props && <BookDownloadButton externalDownloads={props.externalDownloads} primaryLink={props.link} />}

          {isEpub && <EpubReader title={props.title} link={props.link} open={isReaderOpen} setIsOpen={setIsReaderOpen} />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
