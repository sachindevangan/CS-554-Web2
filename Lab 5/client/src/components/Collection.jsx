import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/client';
import { GET_COMICS_PAGE, SEARCH_COMICS } from '../queries.js';
import ComicCard from './ComicCard';
import './component.css';
import SearchArts from './SearchArts.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { collectComic, giveUpComic, selectSubCollection } from '../actions.js';
import { RotatingLines } from 'react-loader-spinner';
import { Grid } from '@mui/material';

const Collection = () => {
  const { pageNum } = useParams();
  const navigate = useNavigate();
  const [comics, setComics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(pageNum ? parseInt(pageNum) : 1); 
  const client = useApolloClient();
  const [lastPage, setLastPage] = useState(1);

  const dispatch = useDispatch();
  const selectedSubCollectionId = useSelector((state) => state.subCollections.selectedSubCollectionId);
  const subCollections = useSelector((state) => state.subCollections.subCollections);

  const { loading: comicsPageLoading, error: comicsPageError, data: comicsPageData } = useQuery(GET_COMICS_PAGE, {
    variables: { pageNum: currentPage },
  });

  const { loading: searchLoading, error: searchError, data: searchResult } = useQuery(SEARCH_COMICS, {
    variables: { searchTerm, pageNum: currentPage },
    skip: !searchTerm,
  });

  useEffect(() => {
    if (!searchTerm && comicsPageData) {
      setComics(comicsPageData.comicsPage);
    } else if (searchResult) {
      setComics(searchResult.searchComics);
    }
  }, [searchTerm, comicsPageData, searchResult]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPageNum = currentPage - 1;
      setCurrentPage(prevPageNum);
      navigate(`/marvel-comics/page/${prevPageNum}${searchTerm ? `?searchTerm=${searchTerm}` : ''}`);
    }
  };

  const handleNextPage = () => {
    const nextPageNum = currentPage + 1;
    setCurrentPage(nextPageNum);
    navigate(`/marvel-comics/page/${nextPageNum}${searchTerm ? `?searchTerm=${searchTerm}` : ''}`);
  };

  const handleCollect = (comicId) => {
    if (!selectedSubCollectionId) {
      console.log('Please select a sub-collection before collecting comics.');
      return;
    }
    dispatch(collectComic(comicId, selectedSubCollectionId));
  };

  const handleGiveUp = (comicId) => {
    if (!selectedSubCollectionId) {
      console.log('Please select a sub-collection before giving up comics.');
      return;
    }
    dispatch(giveUpComic(comicId, selectedSubCollectionId));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); 
    navigate(`/marvel-comics/page/1${value ? `?searchTerm=${value}` : ''}`);
  };

  const handleSubCollectionChange = (selectedSubCollectionId) => {
    dispatch(selectSubCollection(selectedSubCollectionId));
  };

   const renderError = (error) => {
    if (error.networkError && error.networkError.result) {
      const { code, status } = error.networkError.result.data || {};
      if (code !== undefined && status !== undefined) {
        return (
          <div>
            <p>Error {code}: {status}</p>
          </div>
        );
      }
    }
    return <p>Error: {error.message}</p>;
  };

  return (
    <div>
      <div>
        <label>Select Sub-Collection:</label>
        <select value={selectedSubCollectionId || ''} onChange={(e) => handleSubCollectionChange(e.target.value)}>
          <option value="">Select Sub-Collection</option>
          {subCollections.map((subCollection) => (
            <option key={subCollection.id} value={subCollection.id}>
              {subCollection.name}
            </option>
          ))}
        </select>
      </div>

      <SearchArts searchValue={handleSearch} />
      <div style={{ marginBottom: '20px' }}>
      <button onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous Page
      </button>
      <button onClick={handleNextPage}>Next Page</button>
      </div>
     {(comicsPageLoading || searchLoading) && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width={96}
            visible={true}
          />
          <p>Loading...</p>
        </div>
      )}
      {(comicsPageError || searchError) && (
  <div style={{ color: 'red' }}>
    <p style={{ fontWeight: 'bold' }}>
      {renderError(comicsPageError || searchError)}
    </p>
  </div>
)}

      {!comicsPageLoading && !comicsPageError && (
        <div>
        <Grid container spacing={2}>
        {comics.map((comic) => (
          <Grid key={comic.id} item xs={12} sm={6} md={4} lg={3} xl={2}>
            <ComicCard comicId={comic.id} handleCollect={handleCollect} handleGiveUp={handleGiveUp} />
          </Grid>
        ))}
      </Grid>
        </div>
      )}
    </div>
  );
};

export default Collection;
