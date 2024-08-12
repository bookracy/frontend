import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Banner from "../components/Banner";
import Layout from "../components/Layout";

const BACKEND_URL = "https://backend.bookracy.org";

// debounce function
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

async function fetchSearchResults(query) {
  console.log(`Fetching results for query: ${query}`);
  try {
    const response = await fetch(`${BACKEND_URL}/api/books?query=${query}`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Fetched data:", data);

    return data.results || [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

const HomePage = () => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  const handleSearch = useCallback(
    debounce(async (query) => {
      if (query) {
        const fetchedResults = await fetchSearchResults(query);
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

  const openModal = (item) => {
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
              className="absolute bg-transparent hover:bg-transparent hover:scale-110 right-0 top-0 mr-3"
              onClick={clearSearch}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                className="card flex flex-row gap-4"
                onClick={() => openModal(item)}
              >
                <div className="flex justify-between w-full">
                  <div className="flex flex-row gap-3">
                    <img
                      id="modalImage"
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
                      className="bg-button-accent hover:bg-button-accentHover w-[9em] h-[2.5em] flex items-center justify-center" 
                      onClick={() => window.open(item.link || "#", "_blank")}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* null */
            <div className="flex flex-col gap-1">
              <img src="src/assets/apple_cat.png" width="200"/>
              <p>
                ^ Apple Cat. 🍎🐱
              </p>
            </div>
          )}
        </div>
      </Banner>
    </Layout>
  );
};

export default HomePage;
