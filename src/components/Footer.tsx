import React from "react";
import { Hyperlink } from "@/components/Hyperlink";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="flex flex-col md:flex-row justify-between mx-4">
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          <Hyperlink href="/" title="Go to Home Page" ariaLabel="Home Page">
            Home
          </Hyperlink>
          <Hyperlink href="/featured" title="View Featured Content" ariaLabel="Featured Content">
            Featured
          </Hyperlink>
          <Hyperlink href="/random" title="Discover Random Content" ariaLabel="Random Content">
            Random
          </Hyperlink>
          <Hyperlink href="/contact" title="Contact Us" ariaLabel="Contact Us">
            Contact
          </Hyperlink>
          <Hyperlink href="/settings" title="Account Settings" ariaLabel="Settings">
            Settings
          </Hyperlink>
        </div>
        <div className="flex justify-center md:justify-end gap-3 mt-4 md:mt-0">
          <Hyperlink href="https://github.com/bookracy" title="Visit our GitHub" ariaLabel="GitHub">
            <img src="src/assets/github_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" alt="GitHub Logo" />
          </Hyperlink>
          <Hyperlink href="/discord" title="Join our Discord" ariaLabel="Discord">
            <img src="src/assets/discord_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" alt="Discord Logo" />
          </Hyperlink>
          <Hyperlink href="https://x.com/bookracy" title="Follow us on Twitter" ariaLabel="Twitter">
            <img src="src/assets/twitter_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" alt="Twitter Logo" />
          </Hyperlink>
          <Hyperlink href="/contact" title="Send us an Email" ariaLabel="Email">
            <img src="src/assets/email_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" alt="Email Logo" />
          </Hyperlink>
        </div>
      </div>
      <div className="text-center mt-4">
        <p>&copy; {new Date().getFullYear()} Bookracy.</p>
      </div>
    </footer>
  );
}
