import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/auth/use-auth";
import { useAuthStore } from "@/stores/auth";
import Logo from "@/assets/logo.svg";
import { useRouteContext } from "@tanstack/react-router";

export function UserNav() {
  const { handleLogout } = useAuth();
  const displayName = useAuthStore((state) => state.displayName);

  const routeContext = useRouteContext({
    from: "__root__",
  });

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

  if (!routeContext.auth.isLoggedIn) return null;

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={Logo} />
                  <AvatarFallback>BR</AvatarFallback>
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
            <p className="text-sm font-medium leading-none">{displayName}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
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
