import { SearchResultItem } from "@/api/search/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { saveAs } from "@/lib/saveAs";
import PlaceholderImage from "@/assets/placeholder.png";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";

type BookItemProps = SearchResultItem;

export function BookItem(props: BookItemProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="w-[200px]">
            <AspectRatio ratio={5 / 8} className="flex items-center">
              <img src={props.book_image ?? PlaceholderImage} alt={props.title} className="rounded-md object-cover" />
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-4">
            <h2>{props.title}</h2>
            <p>Authors: {props.authors}</p>
            <p>Content: {props.book_content}</p>
            <p>Language: {props.book_lang}</p>
          </div>
          <div className="flex flex-col justify-end">
            <Button disabled={!props.link} onClick={() => saveAs(props.link)}>
              Download ({props.book_size})
            </Button>
          </div>
        </div>
      </CardContent>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
