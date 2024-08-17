import { ChevronLeft } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLayoutStore } from "@/stores/layout";
import { Link } from "@tanstack/react-router";
import { Menu } from "./menu";
import { useSettingsStore } from "@/stores/settingsStore";

import LogoHeader from "@/assets/logo_header.svg";
import LogoHeaderDark from "@/assets/logo_header_dark.svg";
import Logo from "@/assets/logo.svg";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="invisible absolute -right-[16px] top-[12px] z-20 lg:visible">
      <Button onClick={() => setIsOpen?.()} className="h-8 w-8 rounded-md" variant="outline" size="icon">
        <ChevronLeft className={cn("h-4 w-4 transition-transform duration-700 ease-in-out", isOpen === false ? "rotate-180" : "rotate-0")} />
      </Button>
    </div>
  );
}

export function Sidebar() {
  const theme = useSettingsStore((state) => state.theme);
  const sidebar = useLayoutStore((state) => state.sidebar);

  return (
    <aside className={cn("fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0", sidebar?.isOpen === false ? "w-[90px]" : "w-72")}>
      <SidebarToggle isOpen={sidebar.isOpen} setIsOpen={sidebar.setIsOpen} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Button className={cn("mb-1 transition-transform duration-300 ease-in-out", sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0")} variant="link" asChild>
          <Link to="/" className="m-1 flex items-center gap-2" search={{ q: "" }}>
            {theme === "dark" ? (
              <img src={sidebar.isOpen ? LogoHeader : Logo} className="h-13 transition-transform duration-200 hover:scale-110" />
            ) : (
              <img src={sidebar.isOpen ? LogoHeaderDark : Logo} className="h-13 transition-transform duration-200 hover:scale-110" />
            )}
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
