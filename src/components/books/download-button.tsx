import { useDownloadMutation, useExternalDownloadsQuery } from "@/api/backend/downloads/external";
import { Button } from "../ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { saveAs } from "@/lib/saveAs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface BookDownloadButtonProps {
  primaryLink?: string;
  md5: string;
}

export function BookDownloadButton(props: BookDownloadButtonProps) {
  const { data, isLoading, isError } = useExternalDownloadsQuery(props.md5);
  const { mutate, isPending: isDownloading } = useDownloadMutation();

  if (data?.external_downloads.length === 0 || !props.primaryLink) return null;

  console.log(isLoading, isError, isDownloading, props.primaryLink);

  return (
    <div className="flex items-center">
      <Button
        className={cn({
          "rounded-r-none border-r-0": data?.external_downloads.length ?? 0 > 0,
        })}
        onClick={() =>
          mutate(props.primaryLink!, {
            onSuccess: (url) => saveAs(url),
          })
        }
      >
        {isDownloading && <Loader2 className="animate-spin" />}
        {!isDownloading ? "Download" : ""}
      </Button>
      {!isLoading && !isError && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-l-none border-l-0 px-2">
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {data?.external_downloads.map((download) => (
              <DropdownMenuItem
                key={download.link}
                onClick={() =>
                  mutate(download.link, {
                    onSuccess: (url) => saveAs(url),
                  })
                }
                className="w-full text-left"
              >
                {download.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
