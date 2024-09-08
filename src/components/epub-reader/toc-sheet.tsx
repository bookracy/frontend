import { NavItem } from "epubjs";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { TableOfContents } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";
import { Button } from "../ui/button";

type TocSheetProps = {
  toc: NavItem[];
  setLocation: (value: string) => void;
};

type TocSheetItemProps = {
  data: NavItem;
  setLocation: (value: string) => void;
  setIsOpen: (value: boolean) => void;
};

const TocSheetItem = ({ data, setLocation, setIsOpen }: TocSheetItemProps) => (
  <div>
    <Button
      onClick={() => {
        setLocation(data.href);
        setIsOpen(false);
      }}
      variant="ghost"
      className="w-full justify-start"
    >
      <span className="truncate">{data.label}</span>
    </Button>
    {data.subitems && data.subitems.length > 0 && (
      <div className="pl-3">
        {data.subitems.map((item, i) => (
          <TocSheetItem key={i} data={item} setLocation={setLocation} setIsOpen={setIsOpen} />
        ))}
      </div>
    )}
  </div>
);

export const TocSheet = ({ toc, setLocation }: TocSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <TableOfContents className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle>Table of contents</SheetTitle>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div>
            {toc.map((item, i) => (
              <TocSheetItem key={i} data={item} setLocation={setLocation} setIsOpen={setIsOpen} />
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
