import { useAuthStore } from "@/stores/auth";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

export const useAuth = () => {
  const router = useRouter();
  const reset = useAuthStore((state) => state.reset);
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    reset();
    router.invalidate();
    navigate({
      to: "/login",
      search: {
        redirect: "/",
      },
      replace: true,
    });
  }, [reset, navigate, router]);

  return { handleLogout } as const;
};
