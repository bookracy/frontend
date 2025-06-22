import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      className={cn("fixed right-4 bottom-14 z-50 transition-opacity duration-300", {
        "opacity-100": isVisible,
        "pointer-events-none z-0 opacity-0": !isVisible,
      })}
    >
      <Button onClick={scrollToTop} size="icon">
        <ArrowUpIcon className="h-6 w-6" />
      </Button>
    </div>
  );
}
