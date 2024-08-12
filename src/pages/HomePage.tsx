import React, { useState, useEffect, useCallback } from "react";
import useSettingsStore from "../stores/settingsStore";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Banner from "../components/Banner";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const BACKEND_URL = "https://backend.bookracy.org";

// debounce function with types
function debounce<F extends (...args: any[]) => void>(func: F, delay: number) {
  let timeoutId: NodeJS.Timeout | undefined;
  return (...args: Parameters<F>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

// Type for search result item
interface SearchResultItem {
  id: string;
  title: string;
  book_image?: string;
  authors: string[] | string;
  description?: string;
  link?: string;
}

// Define the type of data fetched from the API
interface FetchResult {
  results: SearchResultItem[];
}

async function fetchSearchResults(query: string, booksPerSearch: number): Promise<SearchResultItem[]> {
  console.log(`Fetching results for query: ${query}`);
  try {
    const response = await fetch(`${BACKEND_URL}/api/books?query=${query}&limit=${booksPerSearch}`);
    console.log(`${BACKEND_URL}/api/books?query=${query}&limit=${booksPerSearch}`)

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: FetchResult = await response.json();
    console.log("Fetched data:", data);

    return data.results || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

const HomePage: React.FC = () => {
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalData, setModalData] = useState<SearchResultItem | null>(null);
  const { booksPerSearch } = useSettingsStore();

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query) {
        const fetchedResults = await fetchSearchResults(query, booksPerSearch);
        setResults(fetchedResults);
      } else {
        setResults([]);
      }
    }, 900),
    []
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const openModal = (item: SearchResultItem) => {
    setModalData(item);
  };

  const closeModal = () => {
    setModalData(null);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Layout>
      <Banner>
        <h1 className="text-2xl text-white">Welcome to <strong>Bookracy</strong>🎉</h1>
        <p className="mt-2 text-white">
          Bookracy is a free and open-source web app that allows you to read and download your favorite books, comics, and manga.
          <br />
          <div className="flex flex-row gap-4 my-4">
            <a href="/contact">[Contact]</a>
            <a href="https://discord.gg/X5kCn84KaQ">[Discord]</a>
            <a href="/about">[About]</a>
          </div>
          To get started, either search below or navigate the site using the sidebar.
        </p>
        <div className="relative w-5/12 my-3">
          <input
            id="searchInput"
            type="text"
            className="input w-full"
            placeholder="Search for books, comics, or manga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute bg-transparent right-2 top-1/2 hover:bg-transparent transform -translate-y-1/2"
              onClick={clearSearch}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                className="card flex flex-row"
                onClick={() => openModal(item)}
              >
                <div className="flex justify-between w-full">
                  <div className="flex flex-row gap-3">
                    <img
                      id="modalImage"
                      className="rounded"
                      src={item.book_image || "src/assets/placeholder.png"}
                      alt={item.title || "Unknown Title"}
                      width="150"
                    />
                    <div>
                      <h4>
                        {item.title ? (item.title.length > 46 ? item.title.substring(0, 46) + "..." : item.title) : "Unknown Title"}
                      </h4>
                      <p>Author: {Array.isArray(item.authors) ? item.authors.join(", ") : item.authors || "Unknown Author"}</p>
                      <p>Description: {item.description || "No description available."}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <Button 
                      className="bg-[#7948ea] hover:bg-[#8a5fec] py-1 px-2 flex items-center justify-center" 
                      onClick={() => window.open(item.link || "#", "_blank")}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            null
          )}
        </div>
      </Banner>
    </Layout>
  );
};

export default HomePage;
