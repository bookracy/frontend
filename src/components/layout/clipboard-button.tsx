import { ClipboardCheck, Clipboard } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface ClipBoardButtonProps {
  content: string;
}

export function ClipBoardButton(props: ClipBoardButtonProps) {
  const [clickedOnClipBoard, setClickedOnClipBoard] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(props.content);
    setClickedOnClipBoard(true);

    toast.success("Link copied to clipboard");

    setTimeout(() => {
      setClickedOnClipBoard(false);
    }, 2000);
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <ClipboardCheck
        className={cn("rotate-90 scale-0 transition-transform duration-500 ease-in-out", {
          "rotate-0 scale-100": clickedOnClipBoard,
        })}
      />
      <Clipboard
        className={cn("scale-1000 absolute rotate-0 transition-transform duration-500 ease-in-out", {
          "-rotate-90 scale-0": clickedOnClipBoard,
        })}
      />
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  );
}
