import React, { ReactNode } from "react";
import Footer from "./Footer";

interface BannerProps {
  children: ReactNode;
  className?: string;
}

const Layout: React.FC<BannerProps> = ({ children, className }) => {
  return (
    <div className="app">
      <div className={`main-content ${className}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
