import React from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "src/components/Sidebar";
import { HomePage } from "src/pages/HomePage";
import { Featured } from "src/pages/Featured";
import { Random } from "src/pages/Random";
import { Settings } from "src/pages/Settings";
import { Upload } from "src/pages/Upload";
import { Contact } from "src/pages/Contact";
import { Account } from "src/pages/Account";
import { About } from "src/pages/About";

export const App: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:query?" element={<HomePage />} />
          <Route path="/featured" element={<Featured />} />
          <Route path="/about" element={<About />} />
          <Route path="/random" element={<Random />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
    </div>
  );
};
