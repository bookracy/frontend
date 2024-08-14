import React from "react";
import { Hyperlink } from "@/components/Hyperlink";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="flex flex-col md:flex-row justify-between mx-4">
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          <Hyperlink href="/">[Home]</Hyperlink>
          <Hyperlink href="/featured">[Featured]</Hyperlink>
          <Hyperlink href="/random">[Random]</Hyperlink>
          <Hyperlink href="/contact">[Contact]</Hyperlink>
          <Hyperlink href="/settings">[Settings]</Hyperlink>
        </div>
        <div className="flex justify-center md:justify-end gap-3 mt-4 md:mt-0">
          <Hyperlink href="https://github.com/bookracy">
            <img src="src/assets/github_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" />
          </Hyperlink>
          <Hyperlink href="/discord">
            <img src="src/assets/discord_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" />
          </Hyperlink>
          <Hyperlink href="https://x.com/bookracy">
            <img src="src/assets/twitter_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" />
          </Hyperlink>
          <Hyperlink href="/contact">
            <img src="src/assets/email_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" />
          </Hyperlink>
        </div>
      </div>
      <div className="text-center mt-4">
        <p>&copy; {new Date().getFullYear()} Bookracy.</p>
      </div>
    </footer>
  );
}
