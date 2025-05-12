import { LogOut, Moon, Sun } from "lucide-react";
import { useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/auth/use-auth";
import Logo from "@/assets/logo.svg";
import { useRouteContext } from "@tanstack/react-router";
import { useSettingsStore } from "@/stores/settings";

export function UserNav() {
  const { handleLogout } = useAuth();
  const theme = useSettingsStore((state) => state.theme);
  const setTheme = useSettingsStore((state) => state.setTheme);

  const auth = useRouteContext({
    from: "__root__",
  }).auth;

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "q" && (e.ctrlKey || e.metaKey)) {
        handleLogout();
      }
    });

    return () => {
      window.removeEventListener("keydown", () => {});
    };
  });

  if (!auth.isLoggedIn) return null;

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={auth.user?.pfp} />
                  <AvatarFallback>
                    <img src={Logo} className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{auth.user?.username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:cursor-pointer" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="mr-3 h-4 w-4 text-muted-foreground" /> : <Moon className="mr-3 h-4 w-4 text-muted-foreground" />}
            <span>Switch theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:cursor-pointer" onClick={handleLogout}>
            <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
            <span>Log out</span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
