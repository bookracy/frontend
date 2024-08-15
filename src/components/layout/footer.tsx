import { Link } from "@tanstack/react-router";
import { MailPlus } from "lucide-react";
import GitHubLogo from "@/assets/github_logo.svg";
import DiscordLogo from "@/assets/discord_logo.svg";
import XLogo from "@/assets/x_logo.svg";

export function Footer() {
  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 z-20 h-[56px] w-full shadow backdrop-blur">
      <div className="flex h-full items-center justify-center gap-4 px-8">
        <p className="text-sm font-semibold">© {new Date().getFullYear()} Bookracy</p>
        <div className="flex-1" />

        <a target="_blank" href="https://github.com/bookracy" className="h-6 w-6">
          <img src={GitHubLogo} alt="Discord" className="h-6 w-6 dark:invert" />
        </a>
        <a target="_blank" href="https://discord.gg/X5kCn84KaQ">
          <img src={DiscordLogo} alt="Discord" className="h-6 w-6 dark:invert" />
        </a>
        <a target="_blank" href="https://x.com/bookracy">
          <img src={XLogo} alt="Twitter" className="h-6 w-6 dark:invert" />
        </a>

        <Link to="/contact">
          <MailPlus className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}
