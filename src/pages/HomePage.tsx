import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import debounce from "lodash/debounce";
import { useSettingsStore } from "?/stores/settingsStore";
import { Button } from "?/components/Button";
import { Banner } from "?/components/Banner";
import { Layout } from "?/components/Layout";
import { TransparentButton } from "?/components/TransparentButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Hyperlink } from "?/components/Hyperlink";

const BACKEND_URL = "https://backend.bookracy.org";

interface SearchResultItem {
  id: string;
  title: string;
  book_image?: string;
  authors: string[] | string;
  description?: string;
  link?: string;
}

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

export const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [newsWidget, setNewsWidget] = useState(true);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalData, setModalData] = useState<SearchResultItem | null>(null);
  const { booksPerSearch } = useSettingsStore();
  const [buttonText, setButtonText] = useState("Download");
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuery, setCurrentQuery] = useState<string>("");

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("query");
    if (query) {
      setCurrentQuery(query);
    }
  }, [location.search]);

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

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (query && query !== currentQuery) {
        setLoading(true);
        setIsVisible(false);
        setTimeout(async () => {
          const fetchedResults = await fetchSearchResults(query, booksPerSearch);
          console.log("Fetched results:", fetchedResults);
          setResults(fetchedResults);
          setLoading(false);
          setIsVisible(true);
          navigate(`/search/${query}`);
        }, 2000);
      } else {
        setResults([]);
        setIsVisible(false);
      }
    }, 900),
    [fetchSearchResults, booksPerSearch, setResults, navigate, currentQuery]
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

  const toggleResultsVisibility = () => {
    setIsVisible(!isVisible);
  };

  const toggleNewsWidget = () => {
    setNewsWidget(!newsWidget);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  return (
    <Layout>
      <Banner>
        <h1 className="text-2xl text-white">Welcome to <strong>Bookracy</strong>📚</h1>
        <p className="mt-2 text-white">
          Bookracy is a free and open-source web app that allows you to read and download your favorite books, comics, and manga.
          <br />
          <div className="flex flex-row gap-4 my-4">
            <Hyperlink href="/contact">[Contact]</Hyperlink>
            <Hyperlink href="/discord">[Discord]</Hyperlink>
            <Hyperlink href="/about">[About]</Hyperlink>
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
          {loading ? (
            <img src="src/assets/loading.png" width="50" className="animate-spin mx-4" />
          ) : (
            <div className="results-container bg-dropdown-primary rounded-[0.2em] flex flex-col gap-3 p-2">
              {searchQuery ? (
                <div className="flex justify-end">
                  <TransparentButton onClick={toggleResultsVisibility}>
                    <FontAwesomeIcon
                      icon={!isVisible && faChevronDown || faChevronUp}
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
                    <p>
                      Hi! you're one of the first people to use Bookracy. 
                      We are still very much in development and I have no life so please share suggestions in the discord. 
                      Bookracy is also looking for developers, join the discord server and feel free to DM me to help. 
                      btw chat this is a news widget
                    </p>
                    <Button onClick={() => navigate("/discord")}>
                      Join Discord
                    </Button>
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
                    onClick={() => openModal(item)}
                  >
                    <div className="flex justify-between w-full">
                      <div className="flex flex-row gap-3">
                        <img
                          className="rounded"
                          width="150"
                          src={item.book_image}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.src = "src/assets/placeholder.png";
                          }}
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
