import { Link } from "@tanstack/react-router";
import { MailPlus } from "lucide-react";
import GitHubLogo from "@/assets/github_logo.svg";
import DiscordLogo from "@/assets/discord_logo.svg";
import XLogo from "@/assets/x_logo.svg";
import { DISCORD_URL, GITHUB_URL, X_URL } from "@/constants";

export function Footer() {
  return (
    <div className="z-20 h-[56px] w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-center gap-4 px-8">
        <Link to="/about">
          <p className="text-sm font-semibold">© {new Date().getFullYear()} Bookracy</p>
        </Link>
        <div className="flex-1" />

        <a target="_blank" href={GITHUB_URL} rel="noreferrer" className="h-6 w-6 hover:scale-110 transition-transform duration-150">
          <img src={GitHubLogo} alt="Github" className="h-6 w-6 dark:invert" />
        </a>
        <a target="_blank" rel="noreferrer" href={DISCORD_URL} className="hover:scale-110 transition-transform duration-150">
          <img src={DiscordLogo} alt="Discord" className="h-6 w-6 dark:invert" />
        </a>
        <a target="_blank" rel="noreferrer" href={X_URL} className="hover:scale-110 transition-transform duration-150">
          <img src={XLogo} alt="Twitter" className="h-6 w-6 dark:invert" />
        </a>

        <Link to="/contact" className="hover:scale-110 transition-transform duration-150">
          <MailPlus className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
