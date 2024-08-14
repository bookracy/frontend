import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Hyperlink } from "@/components/Hyperlink";
import debounce from "lodash/debounce";
import { useSettingsStore } from "@/stores/settingsStore";
import { Button } from "@/components/Button";
import { Banner } from "@/components/Banner";
import { Layout } from "@/components/Layout";
import { TransparentButton } from "@/components/TransparentButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loadingImage from "@/assets/loading.png";
import placeholderImage from "@/assets/placeholder.png";
import { faTimes, faChevronDown, faChevronUp, faSearch } from "@fortawesome/free-solid-svg-icons";

const BACKEND_URL = "https://backend.bookracy.org";

interface SearchResultItem {
  id: string;
  title: string;
  book_image?: string;
  authors: string[] | string;
  description?: string;
  link?: string;
}

// Optimized fetch function with caching
const fetchSearchResults = (() => {
  const cache: { [key: string]: SearchResultItem[] } = {};
  return async (query: string, booksPerSearch: number): Promise<SearchResultItem[]> => {
    const cacheKey = `${query}-${booksPerSearch}`;
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/books?query=${query}&limit=${booksPerSearch}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: { results: SearchResultItem[] } = await response.json();
      cache[cacheKey] = data.results || [];
      return cache[cacheKey];
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };
})();

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [newsWidget, setNewsWidget] = useState(true);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { booksPerSearch } = useSettingsStore();
  const [buttonText, setButtonText] = useState("Download");

  // Function to handle updating the URL when a search query is entered
  const updateURL = (query: string) => {
    if (query) {
      navigate(`/search/${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
  };

  // Function to handle the actual search operation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query) {
        setResults([]);
        setIsVisible(false);
        return;
      }
      setLoading(true);
      try {
        const fetchedResults = await fetchSearchResults(query, booksPerSearch);
        setResults(fetchedResults);
        setIsVisible(true);
      } finally {
        setLoading(false);
      }
    }, 300),
    [booksPerSearch]
  );

  // Effect to handle search query updates
  useEffect(() => {
    const query = decodeURIComponent(location.pathname.split("/search/")[1] || "");
    setSearchQuery(query);
    handleSearch(query);
  }, [location.pathname, handleSearch]);

  // Handle input change and update both the search state and the URL
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateURL(query);
  };

  const handleDownloadClick = async (itemLink: string) => {
    setButtonText("Getting link...");
    const link = document.createElement("a");
    link.href = itemLink || "#";
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setButtonText("Download");
  };

  const toggleResultsVisibility = () => setIsVisible((prev) => !prev);

  const toggleNewsWidget = () => setNewsWidget((prev) => !prev);

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    updateURL("");
  };

  return (
    <Layout>
      <Banner>
        <h1 className="text-2xl text-white">
          Welcome to <strong>Bookracy</strong>📚
        </h1>
        <p className="mt-2 text-white">
          Bookracy is a free and open-source web app that allows you to read and download your favorite books, comics, and manga.
        </p>
        <div className="flex flex-row gap-4 my-4">
          <Hyperlink href="/contact">[Contact]</Hyperlink>
          <Hyperlink href="/discord">[Discord]</Hyperlink>
          <Hyperlink href="/about">[About]</Hyperlink>
        </div>
        <p className="text-white">
          To get started, either search below or navigate the site using the sidebar.
        </p>
        <div className="relative w-full sm:w-9/12 lg:w-5/12 my-3">
          <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            id="searchInput"
            type="text"
            className="input w-full pl-10"
            placeholder="Search for books, comics, or manga..."
            value={searchQuery}
            onChange={handleInputChange}
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
          {loading ? (
            <img src={loadingImage} width="50" className="animate-spin mx-4" alt="Loading..." />
          ) : (
            <div className="results-container bg-dropdown-primary rounded-[0.2em] flex flex-col gap-3 p-2">
              {searchQuery ? (
                <div className="flex justify-end">
                  <TransparentButton onClick={toggleResultsVisibility}>
                    <FontAwesomeIcon
                      icon={!isVisible ? faChevronDown : faChevronUp}
                      className="mx-4 my-1"
                    />
                  </TransparentButton>
                </div>
              ) : (
                newsWidget ? (
                  <div>
                    <div className="flex justify-between">
                      <h4>Grand Opening 🎉</h4>
                      <TransparentButton onClick={toggleNewsWidget}>
                        <FontAwesomeIcon icon={faTimes} />
                      </TransparentButton>
                    </div>
                    <div>
                      Hi! you're one of the first people to use Bookracy. 
                      We are still very much in development, so please share suggestions in the discord. 
                      Bookracy is also looking for developers; join the discord server and feel free to DM me to help. 
                      btw chat this is a news widget
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <h4>No results found...</h4>
                  </div>
                ))}
              {isVisible && (
                results.map((item) => (
                  <div
                    key={item.id}
                    className="card flex flex-row"
                  >
                    <div className="flex justify-between w-full">
                      <div className="flex flex-row gap-3">
                        <img
                          id="modalImage"
                          className="rounded"
                          src={item.book_image || `${placeholderImage}`}
                          alt={item.title || "Unknown Title"}
                          width="150"
                          onError={(e) => {
                            e.currentTarget.src = placeholderImage; // Set the placeholder if the image fails to load
                          }}
                        />
                        <div>
                          <h4>
                            {item.title ? (item.title.length > 46 ? `${item.title.substring(0, 46)}...` : item.title) : "Unknown Title"}
                          </h4>
                          <p>Author: {Array.isArray(item.authors) ? item.authors.join(", ") : item.authors || "Unknown Author"}</p>
                          <p>Description: {item.description || "No description available."}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <Button 
                          className="bg-button-accent hover:bg-button-accentHover py-1 px-2 flex items-center justify-center" 
                          onClick={() => handleDownloadClick(item.link || "")}
                        >
                          {buttonText}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Banner>
    </Layout>
  );
};