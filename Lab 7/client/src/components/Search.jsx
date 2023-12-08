import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { BOOKS_BY_GENRE, SEARCH_AUTHORS_BY_NAME, BOOKS_BY_PRICE_RANGE } from '../queries';
import './search.css'
import { Link, useNavigate } from 'react-router-dom';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('genre');
  const [searchedGenre, setSearchedGenre] = useState('');
  const [searchedName, setSearchedName] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState('');
  const [priceSearchTriggered, setPriceSearchTriggered] = useState(false);

  const { data: genreData, loading: genreLoading, error: genreError, refetch: genreRefetch } = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: searchedGenre },
    skip: !searchedGenre,
  });

  const { data: authorData, loading: authorLoading, error: authorError, refetch: authorRefetch } = useQuery(SEARCH_AUTHORS_BY_NAME, {
    variables: { searchTerm: searchedName },
    skip: !searchedName,
  });

  const { data: priceData, loading: priceLoading, error: priceError, refetch: priceRefetch } = useQuery(BOOKS_BY_PRICE_RANGE, {
    variables: { min: parseFloat(minPrice), max: parseFloat(maxPrice) || null },
    skip: !priceSearchTriggered || (!minPrice && !maxPrice),
  });

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchType === 'genre') {
      setSearchedGenre(searchTerm);
      setSearchedName('');
      setMinPrice(0);
      setMaxPrice('');
      
    } else if (searchType === 'author') {
      setSearchedName(searchTerm);
      setSearchedGenre('');
      setMinPrice(0);
      setMaxPrice('');
    }
  };

  const handlePriceInputChange = (e) => {
    setPriceSearchTriggered(false);
    if (e.target.id === 'minPrice') {
      setMinPrice(e.target.value);
    } else if (e.target.id === 'maxPrice') {
      setMaxPrice(e.target.value);
    }
  };

  const handlePriceSearch = (e) => {
    e.preventDefault();
    setPriceSearchTriggered(true);
  };

  useEffect(() => {
    const clearSearchResults = () => {
      genreRefetch({ genre: null });
      authorRefetch({ searchTerm: null }); 
      priceRefetch({ min: null, max: null }); 
    };

    if (searchType === 'genre' && searchedGenre) {
      clearSearchResults();
      genreRefetch({ genre: searchedGenre });
    } else if (searchType === 'author' && searchedName) {
      clearSearchResults();
      authorRefetch({ searchTerm: searchedName });
    } else if (searchType === 'price' && (minPrice || maxPrice)) {
      clearSearchResults();
      priceRefetch({ min: parseFloat(minPrice), max: parseFloat(maxPrice) || null });
    }

    if (searchType === 'author') {
      setSearchTerm('');
    }
    

  }, [searchedGenre, searchedName, minPrice, maxPrice, genreRefetch, authorRefetch, priceRefetch, searchType]);

  let data, loading, error;
  if (searchType === 'genre') {
    data = genreData;
    loading = genreLoading;
    error = genreError;
  } else if (searchType === 'author') {
    data = authorData;
    loading = authorLoading;
    error = authorError;
  } else {
    data = priceData;
    loading = priceLoading;
    error = priceError;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <form onSubmit={handleSearch}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="genre">Search by Genre</option>
          <option value="author">Search by Author Name</option>
          <option value="price">Search by Price Range</option>
        </select>
        {searchType === 'price' ? (
          <div>
            <label htmlFor="minPrice">Min Price:</label>
            <input
              type="number"
              id="minPrice"
              placeholder="Enter Min Price"
              value={minPrice}
              onChange={handlePriceInputChange}
            />
            <label htmlFor="maxPrice">Max Price:</label>
            <input
              type="number"
              id="maxPrice"
              placeholder="Enter Max Price"
              value={maxPrice}
              onChange={handlePriceInputChange}
            />
            <button type="submit" onClick={handlePriceSearch}>Search</button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder={searchType === 'genre' ? 'Search by Genre' : 'Search by Author Name'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" >Search</button>
          </div>
        )}
      </form>
      {data && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {searchType === 'genre' && data.booksByGenre && (
              data.booksByGenre.map((book) => (
                <li key={book._id} className="searchResultItem">
                <Link
                to ={`/books/${book._id}`}
                onClick={() => navigate(`/books/${book._id}`)}
                >{`${book.title}`} </Link>
                </li>
              ))
            )}
            {searchType === 'author' && data.searchAuthorsByName && (
              data.searchAuthorsByName.map((author) => (
                <li key={author._id} className="searchResultItem">
                  <Link
                    to={`/authors/${author._id}`}
                    onClick={() => navigate(`/authors/${author._id}`)}
                  >{`${author.first_name} ${author.last_name}`}</Link>
                </li>
              ))
            )}
            {searchType === 'price' && data.booksByPriceRange && (
              data.booksByPriceRange.map((book) => (
                <li key={book._id} className="searchResultItem">
                <Link
                to ={`/books/${book._id}`}
                onClick={() => navigate(`/books/${book._id}`)}
                >{`${book.title}`} </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
