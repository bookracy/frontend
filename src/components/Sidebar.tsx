import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SidebarButtons from "./SidebarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHamburger, setShowHamburger] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleNavigation = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        setShowHamburger(false);
      } else {
        // Scrolling up
        setShowHamburger(true);
      }

      // Update lastScrollTop
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <>
      {!isOpen && (
        <div className="bg-[#fff]">
          <button 
            className={`hamburger md:hidden ${showHamburger ? "opacity-100" : "opacity-0"} p-2 ml-3 text-2xl`} 
            onClick={toggleSidebar}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <Link to="/" className="flex justify-center items-center mb-4 mt-1" onClick={handleNavigation}>
          <img src="src/assets/logo_header.png" className="mx-4 hover:scale-105 transition-transform duration-150" alt="Banner" />
        </Link>

        <div className="flex flex-col gap-2 mx-2 items-center flex-grow">
          <SidebarButtons label="Featured ⭐" to="/featured" onClick={handleNavigation}>Featured ⭐</SidebarButtons>
          <SidebarButtons label="Random ️‍🔀" to="/random" onClick={handleNavigation}>Random ️‍🔀</SidebarButtons>
          <SidebarButtons label="Upload ️‍📤" to="/upload" onClick={handleNavigation}>Upload ️‍📤</SidebarButtons>
          <hr />
          <SidebarButtons label="Account 🏡" to="/account" onClick={handleNavigation}>Account 🏡</SidebarButtons>
          <SidebarButtons label="Settings ⚙️" to="/settings" onClick={handleNavigation}>Settings ⚙️</SidebarButtons>
          <hr className="md:hidden"/>
          <button 
            className="SidebarButtons flex justify-between md:hidden items-center"
            onClick={toggleSidebar}
          >
            Close ✖️
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
