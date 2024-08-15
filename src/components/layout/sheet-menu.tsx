import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetHeader, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@tanstack/react-router";
import { Menu } from "./menu";
import { useLayoutStore } from "@/stores/layout";

import LogoHeader from "@/assets/logo_header.svg";
import Logo from "@/assets/logo.svg";

export function SheetMenu() {
  const sidebar = useLayoutStore((state) => state.sidebar);
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button className="flex items-center justify-center pb-2 pt-1" variant="link" asChild>
            <Link to="/" className="flex items-center gap-2" search={{ q: "" }}>
              <img src={sidebar.isOpen ? LogoHeader : Logo} className="h-10" />
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
