import React from "react";
import { useNavigate } from "react-router-dom";

interface HyperlinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
}

interface ClickLinkProps {
  onClick: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
}

export const Hyperlink: React.FC<HyperlinkProps> = ({ href, children, className }) => {
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (href && href.startsWith("/")) {
      event.preventDefault();
      navigate(href);
    }
  };

  return (
    <a
      className={className}
      href={href}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export const Clicklink: React.FC<ClickLinkProps> = ({ onClick, href, children, className }) => {
  return (
    <a
      className={className}
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  );
};