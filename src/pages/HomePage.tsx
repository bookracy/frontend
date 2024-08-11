import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import Banner from '../components/Banner';
import Layout from '../components/Layout';

const BACKEND_URL = 'https://backend.bookracy.org';

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
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Fetched data:', data);

    return data.results || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

const HomePage = () => {
  const [results, setResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalData, setModalData] = useState(null);

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

  return (
    <Layout>
      <Banner>
        <h1 className="text-2xl text-white">Welcome to <strong>Bookracy</strong>🎉</h1>
        <p className="mt-2 text-white">
          Bookracy is a free and open-source web app that allows you to read and download your favorite books, comics, and manga.
          <br />
          <div className="flex flex-row gap-4 my-4">
            <a href="/contact">[Contact]</a>
            <a href="/discord">[Discord]</a>
            <a href="/api">[API]</a>
          </div>
          To get started, either search below or navigate the site using the sidebar.
        </p>
        <input
          id="searchInput"
          type="text"
          className="input w-5/12 my-3"
          placeholder="Search for books, comics, or manga..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div id="results" className="results">
          {results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                className="card"
                onClick={() => openModal(item)}
              >
                <img
                  src={item.book_image || 'https://via.placeholder.com/200x300?text=No+Image'}
                  alt={item.title || 'Unknown Title'}
                />
                <h3>{item.title || 'Unknown Title'}</h3>
                <p>{Array.isArray(item.authors) ? item.authors.join(', ') : item.authors || 'Unknown Author'}</p>
              </div>
            ))
          ) : (
            <p>No results found</p>
          )}
        </div>
      </Banner>
      {modalData && (
        <div id="bookModal" className="modal">
          <span className="close" onClick={closeModal}>&times;</span>
          <div className="modal-content">
            <img
              id="modalImage"
              src={modalData.book_image || 'https://via.placeholder.com/200x300?text=No+Image'}
              alt={modalData.title || 'Unknown Title'}
            />
            <h3 id="modalTitle">{modalData.title || 'Unknown Title'}</h3>
            <p id="modalAuthor">Author: {Array.isArray(modalData.authors) ? modalData.authors.join(', ') : modalData.authors || 'Unknown Author'}</p>
            <p id="modalDescription">Description: {modalData.description || 'No description available.'}</p>
            <a id="downloadBtn" href={modalData.link || '#'} className="button">Download</a>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
