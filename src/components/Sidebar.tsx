import React, { useState } from "react";
import { Link } from "react-router-dom";
import SidebarButtons from "./SidebarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

{/* Featured Section with Accordion Subpages
<SidebarButtons label="Featured ⭐">
  <SidebarButtons to="/featured" label="Featured Main" onClick={handleNavigation} />
  <SidebarButtons to="/featured1" label="Featured 1" onClick={handleNavigation} />
</SidebarButtons> */}

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleNavigation = () => setIsOpen(false);

  return (
    <>
      <button className="hamburger md:hidden" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
      
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <Link to="/" className="flex justify-center items-center mb-4 mt-1" onClick={handleNavigation}>
          <img src="src/assets/logo_header.png" className="mx-4 hover:scale-105 transition 0.15s" alt="Banner" />
        </Link>
        
        <div className="flex flex-col gap-2 mx-2 items-center">
          <SidebarButtons label="Featured ⭐" to="/featured" onClick={handleNavigation}>Featured ️⭐</SidebarButtons>
          <SidebarButtons label="Random ️‍🔀" to="/random" onClick={handleNavigation}>Random ️‍🔀</SidebarButtons>
          <SidebarButtons label="Upload ️‍📤" to="/upload" onClick={handleNavigation}>Upload ️‍📤</SidebarButtons>
          <hr />
          <SidebarButtons label="Account 🏡" to="/account" onClick={handleNavigation}>Account 🏡</SidebarButtons>
          <SidebarButtons label="Settings ⚙️" to="/settings" onClick={handleNavigation}>Settings ⚙️</SidebarButtons>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
