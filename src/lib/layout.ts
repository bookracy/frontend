import { routeTree } from "@/routeTree.gen";
import { RoutePaths } from "@tanstack/react-router";
import { Blocks, House, LucideIcon, Pickaxe, Star, Upload } from "lucide-react";

export type Submenu = {
  href: RoutePaths<typeof routeTree>;
  label: string;
  active: boolean;
};

type Menu = {
  href: RoutePaths<typeof routeTree>;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: RoutePaths<typeof routeTree> | string): Group[] {
  return [
    {
      groupLabel: "General",
      menus: [
        {
          href: "/featured",
          label: "Featured",
          active: pathname === "/featured",
          icon: Star,
          submenus: [],
        },
        {
          href: "/random",
          label: "Random",
          active: pathname === "/random",
          icon: Pickaxe,
          submenus: [],
        },
        {
          href: "/upload",
          label: "Upload",
          active: pathname === "/upload",
          icon: Upload,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Account",
      menus: [
        {
          href: "/account",
          label: "Account",
          active: pathname === "/account",
          icon: House,
          submenus: [],
        },
        {
          href: "/settings",
          label: "Settings",
          active: pathname === "/settings",
          icon: Blocks,
          submenus: [],
        },
      ],
    },
  ];
}
