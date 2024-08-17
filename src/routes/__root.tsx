import * as React from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/layout";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const sidebar = useLayoutStore((state) => state.sidebar);

  return (
    <>
      <Sidebar />
      <main className={cn("flex min-h-[calc(100vh_-_56px)] flex-col transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900", sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72")}>
        <Navbar />
        <div className="flex flex-1 p-8 [&>*]:w-full">
          <Outlet />
        </div>
      </main>
      <footer className={cn("transition-[margin-left] duration-300 ease-in-out", sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72")}>
        <Footer />
      </footer>
      <TanStackRouterDevtools />
    </>
  );
}
