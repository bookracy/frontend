import React, { ReactNode } from "react";

interface BannerProps {
  children: ReactNode;
}

export const Banner: React.FC<BannerProps> = ({ children }) => {
  return (
    <div className="bg-banner-primary text-white p-4">
      {children}
    </div>
  );
};
