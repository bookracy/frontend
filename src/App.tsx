import React from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "?/components/Sidebar";
import { HomePage } from "?/pages/HomePage";
import { Featured } from "?/pages/Featured";
import { Random } from "?/pages/Random";
import { Settings } from "?/pages/Settings";
import { Upload } from "?/pages/Upload";
import { Contact } from "?/pages/Contact";
import { Account } from "?/pages/Account";
import { About } from "?/pages/About";
import { Discord } from "?/pages/Discord";

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
          <Route path="/discord" element={<Discord />} />
        </Routes>
      </div>
    </div>
  );
};
