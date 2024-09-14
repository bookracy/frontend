import { Link } from "@tanstack/react-router";
import { ReactNode } from "react";
import { FileRouteTypes } from "@/routeTree.gen";

interface NavLinkProps {
  to: FileRouteTypes["fullPaths"] | (string & {});
  target?: string;
  children: ReactNode;
}

function isExternalLink(url: string): boolean {
  return /^(https?:)?\/\//.test(url);
}

export function NavLink({ to, target, children }: NavLinkProps) {
  if (isExternalLink(to)) {
    return (
      <a href={to} target={target} className="text-blue-500 transition-colors duration-300 hover:underline" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <div>
      <Link to={to} target={target} className="text-blue-500 transition-colors duration-300 hover:underline" rel="noreferrer">
        {children}
      </Link>
    </div>
  );
}
