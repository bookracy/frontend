import React, { useCallback, useState } from "react";
import { Layout } from "@/components/Layout";
import { useSettingsStore } from "@/stores/settingsStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush, faBookOpen, faGlobe, faLock } from "@fortawesome/free-solid-svg-icons";
import { FaExclamation, FaLock } from "react-icons/fa";
export const Settings: React.FC = () => {
  const {
    theme,
    setTheme,
    booksPerSearch,
    setBooksPerSearch,
    language,
    setLanguage,
    backendURL,
    setBackendURL,
  } = useSettingsStore();

  const [showWarning, setShowWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooksPerSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value < 1 || value > 10) {
      setError("Please enter a number between 1 and 10.");
    } else {
      setError(null);
      setBooksPerSearch(value);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleBackendURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowWarning(true);
    setBackendURL(e.target.value);
  };

  const languageOptions = [
    { label: "English", value: "en" },
    { label: "Russian", value: "ru" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Italian", value: "it" },
    { label: "Chinese", value: "zh" },
    { label: "French", value: "fr" },
    // Add other languages here
  ];

  return (
    <Layout className="bg-[#252525] text-white p-6">
      <div className="max-w-3xl mx-auto py-8 px-6">
        <h1 className="text-3xl font-bold text-gray-200 mb-8">
          <FontAwesomeIcon icon={faPaintBrush} className="mr-2" />
          Preferences
        </h1>

        {/* Theme Section */}
        <div className="bg-[#1a1a1a] bg-opacity-80 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            <FontAwesomeIcon icon={faPaintBrush} className="mr-2" />
            Theme
          </h2>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="block w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300"
          >
            <option value="dark">Dark</option>
            {/* Add more theme options here */}
          </select>
        </div>

        {/* Language Section */}
        <div className="bg-[#1a1a1a] bg-opacity-80 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Application Language</h2>
          <p className="text-gray-400 mb-4">
            Language applied to search results, and maybe, just maybe the entire application{" "}
            <span role="img" aria-label="smirk">😏</span>.
          </p>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="block w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Books Per Search Section */}
        <div className="bg-[#1a1a1a] bg-opacity-80 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
            Books Per Search
          </h2>
          <p className="text-gray-400 mb-4">Set the maximum number of books displayed per search.</p>
          <input
            id="booksPerSearch"
            type="number"
            value={booksPerSearch}
            onChange={handleBooksPerSearchChange}
            className={`block w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 ${error ? "border-red-500" : ""}`}
            min={1}
            max={10}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Backend URL Section */}
        <div className="bg-[#1a1a1a] bg-opacity-80 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Backend Settings</h2>
          <div className="flex items-center text-gray-400 mb-4">
            <FaLock className="w-5 h-5 text-[#8B5CF6] mr-2" />
            <span>Backend URL:</span>
          </div>
          <input
            id="backendURL"
            type="text"
            value={backendURL.replace(/^https?:\/\//, "")} // Remove http/https for display
            onChange={handleBackendURLChange}
            className="block w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300"
          />
          {showWarning && (
            <div className="mt-4 flex items-center text-yellow-500">
              <FaExclamation className="w-5 h-5 mr-2" />
              <span>Changing the backend URL can affect the application’s behavior.</span>
            </div>
          )}
        </div>

        {/* Generate Thumbnails Section */}
        <div className="bg-[#1a1a1a] bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Generate Thumbnails</h2>
          <p className="text-gray-400 mb-4">
            Most of the time, books don't have thumbnails. You can enable this setting to generate them on the fly but it may slow down the page.
          </p>
          <button className="mt-2 bg-[#8B5CF6] text-white py-2 px-4 rounded-md shadow hover:bg-[#7A4AE6] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] focus:ring-offset-2">
            Enable Thumbnail Generation
          </button>
        </div>

        {/* Application Info Section */}
        <div className="text-gray-400 mt-8 pt-4 border-t border-gray-700">
          <p>Hostname: <span className="text-gray-200">{window.location.hostname}</span></p>
          <p>Backend URL: <span className="text-[#8B5CF6]">{backendURL.replace(/^https?:\/\//, "")}</span></p>
        </div>
      </div>
    </Layout>
  );
};
