import React, { useCallback, useState } from "react";
import { Layout } from "@/components/Layout";
import { useSettingsStore } from "@/stores/settingsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush, faBookOpen } from "@fortawesome/free-solid-svg-icons";

export const Settings: React.FC = () => {
  const { theme, setTheme, booksPerSearch, setBooksPerSearch } = useSettingsStore();
  const [error, setError] = useState<string | null>(null);

  const handleThemeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  }, [setTheme]);

  const handleBooksPerSearchChange = useCallback((value: number) => {
    if (value < 1 || value > 10) {
      setError("Please enter a number between 1 and 10.");
    } else {
      setError(null);
      setBooksPerSearch(value);
    }
  }, [setBooksPerSearch]);

  return (
    <Layout className="bg-[#252525] text-white">
      <br/>
      <br/>
      <h1 className="text-3xl font-bold mb-6 text-gray-200">
        <span role="img" aria-label="settings">⚙️</span> Settings
      </h1>
      <div className="mb-8 p-4 bg-grey-900 rounded-lg shadow-md">
        <label htmlFor="theme" className="flex items-center mb-2 font-medium text-gray-300">
          <FontAwesomeIcon icon={faPaintBrush} className="mr-2" />
          Theme
        </label>
        <select id="theme" value={theme} onChange={handleThemeChange} className="input w-full p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-black">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      <div className="mb-8 p-4 bg-grey-900 rounded-lg shadow-md">
        <label htmlFor="booksPerSearch" className="flex items-center mb-2 font-medium text-gray-300">
          <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
          Books per search (1-10)
        </label>
        <input
          id="booksPerSearch"
          type="number"
          value={booksPerSearch}
          onChange={(e) => handleBooksPerSearchChange(parseInt(e.target.value, 10))}
          className={`input w-full p-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 ${error ? "border-red-500" : ""}`}
          min={1}
          max={10}
        />
        <input
          type="range"
          min="1"
          max="10"
          value={booksPerSearch}
          onChange={(e) => handleBooksPerSearchChange(parseInt(e.target.value, 10))}
          className="w-full mt-2"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </Layout>
  );
};