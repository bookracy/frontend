import * as React from "react"
import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";

interface NavLinkProps {
  to: string;
  children: ReactNode;
}

function isExternalLink(url: string): boolean {
  return /^(https?:)?\/\//.test(url);
}

export function NavLink({ to, children }: NavLinkProps) {
  if (isExternalLink(to)) {
    return (
      <a href={to} className="text-blue-500 hover:text-blue-600 transiton-color duration-100 inline-block">
        {children}
      </a>
    );
  }

  return (
    <Link to={to} className="text-blue-500 hover:text-blue-600 transiton-color duration-100 inline-block">
      {children}
    </Link>
  );
}