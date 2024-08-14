import React, { useState } from "react";
import { Clicklink } from "?/components/Hyperlink";
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
        <Clicklink href={to} className="SidebarButtons no-underline hover:text-inherit" onClick={() => onClick}>
          {label}
        </Clicklink>
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
