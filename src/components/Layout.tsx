import React, { ReactNode } from 'react';
import Footer from './Footer';

interface BannerProps {
  children: ReactNode;
  className?: string;
}

const Layout: React.FC<BannerProps> = ({ children, className }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className={`flex-grow m-2 text-white ${className}`}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;