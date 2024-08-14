import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface SidebarButtonsProps {
  to?: string;
  label: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const SidebarButtons: React.FC<SidebarButtonsProps> = ({ to, label, children, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {to ? (
        <Link to={to} className="SidebarButtons no-underline" onClick={onClick}>
          {label}
        </Link>
      ) : (
        <button className="SidebarButtons flex justify-between items-center" onClick={() => { toggleOpen(); if (onClick) onClick(); }}>
          {label}
          <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
        </button>
      )}
      {isOpen && children && (
        <div className="pl-4">
          {children}
        </div>
      )}
    </>
  );
};
