import React from "react";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children, className }) => {
  return (
    <button className={`button my-2 ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;