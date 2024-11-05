import * as React from "react";
import { ReactNode } from "react";

interface IconButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export function IconButton({ children, onClick }: IconButtonProps) {
  return (
    <button onClick={onClick} className="cursor-pointer rounded-md transition-colors duration-200 hover:scale-110">
      {children}
    </button>
  );
}
