import * as React from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/stores/layout";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { QueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const Route = createRootRouteWithContext<{
  auth: {
    isLoggedIn: boolean;
  };
  queryClient: QueryClient;
}>()({
  component: Root,
  notFoundComponent: () => (
    <div className="flex h-full flex-col items-center justify-center">
      <Alert variant="default" className="w-1/2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Page not found</AlertTitle>
        <AlertDescription>
          You have reached a page that does not exist.{" "}
          <Link to="/" search={{ q: "" }} className="underline">
            Click here to go back to the main page.
          </Link>
        </AlertDescription>
      </Alert>
    </div>
  ),
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
