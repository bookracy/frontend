import React from "react";

interface TransparentButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const TransparentButton: React.FC<TransparentButtonProps> = ({ onClick, children, className }) => {
  return (
    <i className={`cursor-pointer text-2xl ${className}`} onClick={onClick}>
      {children}
    </i>
  );
};
