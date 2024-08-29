import * as React from "react";
import { StrictMode, useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Toaster } from "@/components/ui/sonner";
import { useSettingsStore } from "./stores/settings";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "./styles/global.css";
import { useAuthStore } from "./stores/auth";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error) {
        if ("status" in error && error.status === 404) return false;
        if (failureCount < 2) return true;
        return false;
      },
    },
    mutations: {
      retry(failureCount, error) {
        if ("status" in error && error.status === 404) return false;
        if (failureCount < 2) return true;
        return false;
      },
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    auth: {
      isLoggedIn: false,
    },
    queryClient: queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: () => <div>404</div>,
  defaultPendingMinMs: 1,
  defaultPendingMs: 100,
  defaultPendingComponent: () => {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const theme = useSettingsStore((state) => state.theme);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const routerContext = useMemo(() => {
    return {
      auth: {
        isLoggedIn,
      },
      queryClient: queryClient,
    };
  }, [isLoggedIn]);

  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && (
        <div className="absolute right-5 top-14">
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="relative" />
        </div>
      )}
      <RouterProvider router={router} context={routerContext} />
      <Toaster />
    </QueryClientProvider>
  );
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
