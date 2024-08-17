import * as React from "react";
import { Link, RoutePaths } from "@tanstack/react-router";
import { ReactNode } from "react";
import { routeTree } from "@/routeTree.gen";

interface NavLinkProps {
  to: RoutePaths<typeof routeTree> | (string & {});
  target?: string;
  children: ReactNode;
}

function isExternalLink(url: string): boolean {
  return /^(https?:)?\/\//.test(url);
}

export function NavLink({ to, target, children }: NavLinkProps) {
  if (isExternalLink(to)) {
    return (
      <a href={to} target={target} className="transiton-color inline-block text-blue-500 duration-100 hover:text-blue-600" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link to={to} target={target} className="transiton-color inline-block text-blue-500 duration-100 hover:text-blue-600" rel="noreferrer">
      {children}
    </Link>
  );
}
