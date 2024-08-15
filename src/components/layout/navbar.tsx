import { useEffect } from "react";
import { SheetMenu } from "./sheet-menu";
import { useLayout } from "@/hooks/use-layout";
import { useLayoutStore } from "@/stores/layout";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const { pageTitle } = useLayout();
  const pageTitleFromStore = useLayoutStore((state) => state.page.title);
  const setPageTitle = useLayoutStore((state) => state.page.setTitle);

  useEffect(() => {
    if (pageTitle) setPageTitle(pageTitle);
  }, [pageTitle, setPageTitle]);

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary sticky top-0 z-10 w-full shadow backdrop-blur">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{pageTitle ?? pageTitleFromStore}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
