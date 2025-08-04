import { useState, useMemo } from "react";
import { BookItem, BookItemWithExternalDownloads } from "@/api/backend/types";
import { Card, CardContent } from "../ui/card";
import PlaceholderImage from "@/assets/placeholder.png";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";
import { EpubReader } from "../epub-reader/epub-reader";
import { BookmarkButton } from "./bookmark";
import { BookDownloadButton } from "./download-button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useReadingProgressStore } from "@/stores/progress";
import { Loader2 } from "lucide-react";

type BookItemProps = BookItemWithExternalDownloads | BookItem;

export function BookItemCard(props: BookItemProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const findReadingProgress = useReadingProgressStore((state) => state.findReadingProgress);

  const isEpub = Boolean(props.link?.toLowerCase().endsWith(".epub"));
  const hasExternalDownloads = "externalDownloads" in props;

  const progress = useMemo(() => {
    const progress = findReadingProgress(props.md5);
    if (progress && progress.totalPages > 0) {
      return (progress.currentPage / progress.totalPages) * 100;
    }
  }, [props.md5, findReadingProgress]);

  return (
    <Card className="shadow-md transition-shadow duration-300 hover:shadow-lg">
      <CardContent className="relative flex h-full w-full items-center p-4 md:p-6">
        <div className="absolute top-4 right-4">
          <BookmarkButton book={props} />
        </div>

        <div className="flex w-full flex-col gap-4 pt-12 sm:pt-0 md:flex-row md:gap-6">
          <div className="mx-2 flex w-full max-w-[200px] flex-col items-center justify-center md:w-1/4">
            <AspectRatio ratio={5 / 8} className="flex items-center">
              <img
                src={props.book_image ?? PlaceholderImage}
                alt={props.title}
                className="h-full w-full rounded-lg object-cover transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                onError={(e) => {
                  e.currentTarget.src = PlaceholderImage;
                }}
                onClick={() => setIsReaderOpen(true)}
              />
            </AspectRatio>
            {progress != null && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Progress value={progress} className="mt-2" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-muted-foreground text-xs">Progress: {progress!.toFixed(2)}%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="max-w-[90%] text-2xl font-bold">{props.title}</h2>
                <p className="text-md text-muted-foreground">By {props.author}</p>
              </div>
              <p className="text-muted-foreground line-clamp-3 text-sm break-all">{props.description}</p>
              <p className="text-muted-foreground text-sm">File size: {props.book_size}</p>
              <p className="text-muted-foreground text-sm">File type: {props.book_filetype}</p>
              <p className="text-muted-foreground text-sm">MD5: {props.md5}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-5">
              {hasExternalDownloads ? (
                props.externalDownloadsFetched ? (
                  props.externalDownloads && props.externalDownloads.length > 0 ? (
                    <BookDownloadButton title={props.title} extension={props.book_filetype} externalDownloads={props.externalDownloads} primaryLink={props.link} />
                  ) : (
                    <div className="text-muted-foreground py-2 text-sm">No downloads available</div>
                  )
                ) : (
                  <div className="flex items-center gap-2 py-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking download options...
                  </div>
                )
              ) : (
                <BookDownloadButton title={props.title} extension={props.book_filetype} primaryLink={props.link} />
              )}
              {isEpub && <EpubReader title={props.title} md5={props.md5} link={props.link} open={isReaderOpen} setIsOpen={setIsReaderOpen} />}
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

export function SkeletonBookItemGrid() {
  return (
    <Card className="h-full transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <CardContent className="h-full">
        <div className="relative flex h-full flex-col gap-2 pt-6">
          <Skeleton className="aspect-10/16 w-full rounded-lg" />
          <div className="absolute top-7 right-1">
            <Skeleton className="rounded-half h-10 w-10" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-3 w-1/4 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BookItemDialog(props: BookItemProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const isEpub = Boolean(props.link?.toLowerCase().endsWith(".epub"));
  const hasExternalDownloads = "externalDownloads" in props;

  return (
    <Dialog>
      <div className="flex flex-col">
        <Card className="h-full transition-transform duration-300 hover:scale-105 hover:shadow-xl">
          <CardContent className="h-full">
            <div className="relative flex h-full flex-col gap-2 pt-6">
              <DialogTrigger asChild>
                <AspectRatio ratio={10 / 16}>
                  <img
                    src={props.book_image ?? PlaceholderImage}
                    alt={props.title}
                    className="h-full w-full rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = PlaceholderImage;
                    }}
                  />
                </AspectRatio>
              </DialogTrigger>
              <div className="absolute top-7 right-1">
                <BookmarkButton book={props} />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="line-clamp-2 text-lg font-semibold">{props.title}</h2>
                <p className="text-muted-foreground text-sm">By {props.author}</p>
                <p className="text-muted-foreground text-xs">{props.book_filetype}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>By {props.author}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <div className="flex flex-col gap-4">
            <p>File size: {props.book_size}</p>
            <p>File type: {props.book_filetype}</p>
            <p>MD5: {props.md5}</p>
            <p className="break-all">{props.description}</p>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-row justify-between md:justify-end">
          {hasExternalDownloads ? (
            props.externalDownloadsFetched ? (
              props.externalDownloads && props.externalDownloads.length > 0 ? (
                <BookDownloadButton title={props.title} extension={props.book_filetype} externalDownloads={props.externalDownloads} primaryLink={props.link} />
              ) : (
                <div className="text-muted-foreground py-y text-sm">No downloads available</div>
              )
            ) : (
              <div className="flex items-center gap-2 py-1">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking download options...
              </div>
            )
          ) : (
            <BookDownloadButton title={props.title} extension={props.book_filetype} primaryLink={props.link} />
          )}

          {isEpub && <EpubReader title={props.title} md5={props.md5} link={props.link} open={isReaderOpen} setIsOpen={setIsReaderOpen} />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
