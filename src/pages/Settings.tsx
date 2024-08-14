import React, { useCallback } from "react";
import { Layout } from "@/components/Layout";
import { useSettingsStore } from "@/stores/settingsStore";

export const Settings: React.FC = () => {
  const { theme, setTheme, booksPerSearch, setBooksPerSearch } = useSettingsStore();

  const handleThemeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  }, [setTheme]);

  const handleBooksPerSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setBooksPerSearch(value);
    }
  }, [setBooksPerSearch]);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="mb-6">
        <label htmlFor="theme" className="block font-medium mb-2">
          Theme
        </label>
        <select id="theme" value={theme} onChange={handleThemeChange} className="input w-full">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="booksPerSearch" className="block font-medium mb-2">
          Books per search (1-10)
        </label>
        <input
          id="booksPerSearch"
          type="number"
          value={booksPerSearch}
          onChange={handleBooksPerSearchChange}
          className="input w-full"
          min={1}
          max={10}
        />
      </div>
    </Layout>
  );
};
