import React from "react";
import { useNavigate } from "react-router-dom";

interface HyperlinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  ariaLabel?: string;
}

interface ClickLinkProps {
  onClick: () => void;
  href?: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  ariaLabel?: string;
}

export const Hyperlink: React.FC<HyperlinkProps> = ({
  href,
  children,
  className,
  title,
  ariaLabel
}) => {
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
      title={title}  
      aria-label={ariaLabel || title} 
      rel='nofollow noreferrer target="_blank"'
    >
      {children}
    </a>
  );
};

export const Clicklink: React.FC<ClickLinkProps> = ({
  onClick,
  href,
  children,
  className,
  title,
  ariaLabel
}) => {
  return (
    <a
      className={className}
      href={href}
      onClick={onClick}
      title={title}  // Adding title for SEO
      aria-label={ariaLabel || title}  // Adding aria-label for accessibility
    >
      {children}
    </a>
  );
};
