import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useSettingsStore } from "@/stores/settings";
import { cn } from "@/lib/utils";
import { useRouteContext } from "@tanstack/react-router";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle(props: ThemeToggleProps) {
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const auth = useRouteContext({
    from: "__root__",
  }).auth;

  if (auth.isLoggedIn) return null;

  return (
    <TooltipProvider disableHoverableContent>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button className={cn("bg-background h-8 w-8 rounded-full", props.className)} variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-transform duration-500 ease-in-out dark:scale-100 dark:rotate-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-1000 rotate-0 transition-transform duration-500 ease-in-out dark:scale-0 dark:-rotate-90" />
            <span className="sr-only">Switch Theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">Switch Theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
