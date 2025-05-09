import { cn } from "@/lib/utils";
import { useLayout } from "@/hooks/use-layout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import { CollapseMenuButton } from "./collapse-menu-button";

interface MenuProps {
  isOpen: boolean | undefined;
  closeSheetMenu?: () => void;
}

export function Menu({ isOpen, closeSheetMenu }: MenuProps) {
  const { menuList } = useLayout();

  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className="mt-4 h-full w-full">
        <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {isOpen && <p className="max-w-[248px] truncate px-4 pb-2 text-sm font-medium text-muted-foreground">{groupLabel}</p>}
              {menus.map(({ href, label, icon: Icon, active, submenus, disabled }, index) =>
                submenus.length === 0 ? (
                  <div className="w-full" key={index}>
                    <TooltipProvider>
                      <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                          <Link to={href} disabled={disabled} onClick={() => closeSheetMenu?.()}>
                            <Button variant={active ? "secondary" : "ghost"} className="!pointer-events-auto mb-1 h-10 w-full justify-start" disabled={disabled}>
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
        </ul>
      </nav>
    </ScrollArea>
  );
}
