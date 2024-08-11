import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className="button my-2" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
