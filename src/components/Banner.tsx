import React, { ReactNode } from "react";

interface BannerProps {
  children: ReactNode;
}

const Banner: React.FC<BannerProps> = ({ children }) => {
  return (
    <div className="bg-[#252525] text-white rounded-sm p-4">
      {children}
    </div>
  );
};

export default Banner;
