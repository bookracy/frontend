import { LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLayout } from "@/hooks/use-layout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Link, useRouteContext } from "@tanstack/react-router";
import { CollapseMenuButton } from "./collapse-menu-button";
import { useAuth } from "@/hooks/auth/use-auth";
import { useMemo } from "react";

interface MenuProps {
  isOpen: boolean | undefined;
  closeSheetMenu?: () => void;
}

export function Menu({ isOpen, closeSheetMenu }: MenuProps) {
  const { menuList } = useLayout();
  const { handleLogout } = useAuth();
  const routeContext = useRouteContext({
    from: "__root__",
  });

  const menuListFilteredAuth = useMemo(() => {
    return menuList
      .map((group) => ({
        ...group,
        menus: group.menus.filter((menu) => {
          return !menu.authRequired || (menu.authRequired && routeContext.auth.isLoggedIn);
        }),
      }))
      .filter((group) => group.menus.length > 0);
  }, [menuList, routeContext.auth.isLoggedIn]);

  return (
    <ScrollArea className="flex-1 [&>div>div[style]]:block!">
      <nav className="flex h-full w-full flex-col">
        <ul className="flex flex-1 flex-col items-start space-y-1 px-2">
          {menuListFilteredAuth.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {isOpen && <p className="text-muted-foreground max-w-[248px] truncate px-4 pb-2 text-sm font-medium">{groupLabel}</p>}
              {menus.map(({ href, label, icon: Icon, active, submenus, disabled }, index) =>
                submenus.length === 0 ? (
                  <div className="w-full" key={index}>
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Link to={href} disabled={disabled} onClick={() => closeSheetMenu?.()}>
                            <Button variant={active ? "secondary" : "ghost"} className="pointer-events-auto! mb-1 h-10 w-full justify-start" disabled={disabled}>
                              <span
                                className={cn({
                                  "mr-4": isOpen === true,
                                })}
                              >
                                <Icon size={18} />
                              </span>
                              <p
                                className={cn("max-w-[200px] truncate", {
                                  "translate-x-0 opacity-100": isOpen === true,
                                  "-translate-x-96 opacity-0": isOpen === false,
                                })}
                              >
                                {label}
                              </p>
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        {isOpen === false && <TooltipContent side="right">{label}</TooltipContent>}
                        {disabled && <TooltipContent side="right">Coming soon</TooltipContent>}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <div className="w-full" key={index}>
                    <CollapseMenuButton icon={Icon} label={label} active={active} submenus={submenus} isOpen={isOpen} />
                  </div>
                ),
              )}
            </li>
          ))}

          {routeContext.auth.isLoggedIn ? (
            <li className="flex w-full grow items-end">
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button onClick={handleLogout} variant="outline" className="mt-5 h-10 w-full justify-center">
                      <span className={cn(isOpen === false ? "" : "mr-4")}>
                        <LogOut size={18} />
                      </span>
                      <p className={cn("whitespace-nowrap", isOpen === false ? "hidden opacity-0" : "opacity-100")}>Log out</p>
                    </Button>
                  </TooltipTrigger>
                  {isOpen === false && <TooltipContent side="right">Log out</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </li>
          ) : null}
        </ul>
      </nav>
    </ScrollArea>
  );
}
