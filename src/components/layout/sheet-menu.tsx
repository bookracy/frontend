import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetHeader, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { Menu } from "./menu";

import LogoHeader from "@/assets/logo_header.svg";
import LogoHeaderDark from "@/assets/logo_header_dark.svg";
import { useSettingsStore } from "@/stores/settings";
import { useState } from "react";

export function SheetMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useSettingsStore((state) => state.theme);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button className="mt-3 flex items-center justify-center" variant="link" asChild>
            <Link to="/" className="flex items-center gap-2" search={{ q: "" }} onClick={() => setIsOpen(false)}>
              {theme === "dark" ? <img src={LogoHeader} className="h-13" /> : <img src={LogoHeaderDark} className="h-13" />}
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen closeSheetMenu={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
