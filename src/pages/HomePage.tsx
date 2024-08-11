import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import Banner from '../components/Banner';
import Layout from '../components/Layout';

const BACKEND_URL = `https://backend.bookracy.org`;

// hackish debounce logic
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

    // handle null results
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (data.results.length > 0) {
      document.getElementById('searchContainer').classList.add('scrolled');
    } else {
      document.getElementById('searchContainer').classList.remove('scrolled');
    }

    data.results.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card', 'loading');

      const title = item.title || 'Unknown Title';
      let author;
      if (Array.isArray(item.authors)) {
        author = item.authors.join(', ');
      } else if (typeof item.authors === 'string') {
        author = item.authors;
      } else {
        author = 'Unknown Author';
      }

      const coverImage = item.book_image || 'https://via.placeholder.com/200x300?text=No+Image';
      card.innerHTML = `
        <div class="loader"></div>
        <img src="${coverImage}" alt="${title}">
        <h3>${title}</h3>
        <p>${author}</p>
      `;
      resultsContainer.appendChild(card);

      const img = card.querySelector('img');
      img.onload = () => {
        card.classList.remove('loading');
        card.classList.add('loaded');
      };

      card.addEventListener('click', () => openModal(item));
    });
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('results').innerHTML = 'Failed to fetch results. Please try again later.';
  }
}

function openModal(item) {
  const modal = document.getElementById('bookModal');
  document.getElementById('modalImage').src = item.book_image || 'https://via.placeholder.com/200x300?text=No+Image';
  document.getElementById('modalTitle').innerText = item.title || 'Unknown Title';
  document.getElementById('modalAuthor').innerText = `Author: ${item.authors ? (Array.isArray(item.authors) ? item.authors.join(', ') : item.authors) : 'Unknown Author'}`;
  document.getElementById('modalDescription').innerText = `Description: ${item.description || 'No description available.'}`;
  document.getElementById('downloadBtn').href = item.link || '#';
  modal.style.display = 'flex';
}

const HomePage: React.FC = () => {
  useEffect(() => {
    const modal = document.getElementById('bookModal');
    modal.style.display = 'none';

    const span = document.getElementsByClassName('close')[0];
    span.onclick = () => {
      modal.style.display = 'none';
    };

    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce((event) => {
      const query = event.target.value;
      if (query) {
        fetchSearchResults(query);
      } else {
        document.getElementById('results').innerHTML = '';
        document.getElementById('searchContainer').classList.remove('scrolled');
      }
    }, 900));

    return () => {
      searchInput.removeEventListener('input', debounce);
    };
  }, []);
  // yea that was chatgpt what abt it 

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
        <input id="searchInput" type="text" className="input w-5/12 my-3" placeholder="Search for books, comics, or manga..." />
        <div id="results" className="results"></div>
      </Banner>
      <div id="bookModal" className="modal">
        <span className="close">&times;</span>
        <div className="modal-content">
          <img id="modalImage" src="" alt="Book Cover" />
          <h3 id="modalTitle"></h3>
          <p id="modalAuthor"></p>
          <p id="modalDescription"></p>
          <a id="downloadBtn" href="#" className="button">Download</a>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;