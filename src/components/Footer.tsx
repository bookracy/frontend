import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="flex justify-between mx-4">
        <div className="flex flex-row gap-3">
          <Link to="/">
            [Home]
          </Link>
          <Link to="/featured">
            [Featured]
          </Link>
          <Link to="/random">
            [Random]
          </Link>
          <Link to="/settings">
            [Settings]
          </Link>
        </div>
        <div className="flex flex-row gap-3">
          <Link to="https://example.com">
            <img src="src/assets/discord_logo.png" width="24px" height="auto" />
          </Link>
          <Link to="https://example.com">
            <img src="src/assets/twitter_logo.png" width="24px" height="auto" />
          </Link>
          <Link to="https://example.com">
            <img src="src/assets/email_logo.png" width="24px" height="auto" />
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