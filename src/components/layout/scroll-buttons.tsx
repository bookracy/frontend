import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollButtons() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    toggleVisibility();

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Scroll to top button */}
      <Button
        onClick={scrollToTop}
        size="icon"
        variant="outline"
        className={cn("transition-opacity duration-300", {
          "opacity-100": isVisible,
          "pointer-events-none opacity-0": !isVisible,
        })}
      >
        <ArrowUpIcon className="h-4 w-4" />
      </Button>

      {/* Scroll to bottom button */}
      <Button
        onClick={scrollToBottom}
        size="icon"
        variant="outline"
        className={cn("transition-opacity duration-300", {
          "opacity-100": isVisible,
          "pointer-events-none opacity-0": !isVisible,
        })}
      >
        <ArrowDownIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
