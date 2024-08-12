import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="flex justify-between mx-4">
        <div className="flex flex-row gap-3">
          <Link to="/">
            [Home]
          </Link>
          <Link to="/about">
            [About]
          </Link>
          <Link to="/featured">
            [Featured]
          </Link>
          <Link to="/random">
            [Random]
          </Link>
          <Link to="/contact">
            [Contact]
          </Link>
          <Link to="/settings">
            [Settings]
          </Link>
        </div>
        <div className="flex flex-row gap-3">
          <Link to="https://github.com/bookracy">
            <img src="src/assets/github_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" />
          </Link>
          <Link to="https://discord.gg/X5kCn84KaQ">
            <img src="src/assets/discord_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" />
          </Link>
          <Link to="https://x.com/bookracy">
            <img src="src/assets/twitter_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" />
          </Link>
          <Link to="/contact">
            <img src="src/assets/email_logo.png" width="24px" height="auto" className="hover:scale-110 transition 0.15s" />
          </Link>
        </div>
      </div>
      <div>
        <p>
          &copy; {new Date().getFullYear()} Bookracy.
        </p>
      </div>
    </footer>
  );
}

export default Footer;