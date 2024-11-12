import { useAuthStore } from "@/stores/auth";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

export const useAuth = () => {
  const reset = useAuthStore((state) => state.reset);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    reset();
    navigate({
      to: "/login",
      search: {
        redirect: "/",
      },
      replace: true,
    });
  }, [reset, navigate]);

  return { handleLogout } as const;
};
