import React from "react";
import { Layout } from "?/components/Layout";
import { useSettingsStore } from "?/stores/settingsStore";

export const Settings: React.FC = () => {
  const { booksPerSearch, setBooksPerSearch } = useSettingsStore();

  const handleBooksPerSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBooksPerSearch(parseInt(e.target.value, 10));
  };

  return (
    <Layout>
      <h1>Settings Page</h1>
      <p>This is the Settings page content.</p>
      <div>
        <label htmlFor="booksPerSearch">Books per search:</label>
        <input
          id="booksPerSearch"
          type="number"
          value={booksPerSearch}
          onChange={handleBooksPerSearchChange}
          max={11}
        />
      </div>
    </Layout>
  );
};
