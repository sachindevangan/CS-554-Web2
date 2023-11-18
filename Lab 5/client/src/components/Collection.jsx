import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_COMICS_PAGE } from '../queries.js';

const Collection = () => {
  const { pageNum } = useParams();
console.log('pageNum:', pageNum);

  if (!pageNum) {
    return <p>Error: Page number is not defined</p>;
  }
  const navigate = useNavigate();
  const [comics, setComics] = useState([]);
  const { loading, error, data } = useQuery(GET_COMICS_PAGE, {
    variables: { pageNum: parseInt(pageNum) },
  });

  useEffect(() => {
    if (!loading && !error && data) {
      setComics(data.comicsPage);
    }
  }, [loading, error, data]);

  const handlePreviousPage = () => {
    const prevPageNum = parseInt(pageNum, 10) - 1;
    navigate(`/marvel-comics/page/${prevPageNum}`);
  };

  const handleNextPage = () => {
    const nextPageNum = parseInt(pageNum, 10) + 1;
    navigate(`/marvel-comics/page/${nextPageNum}`);
  };

  const handleCollect = (comicId) => {
    console.log(`Collecting comic with ID: ${comicId}`);
  };

  const handleGiveUp = (comicId) => {
    console.log(`Giving up comic with ID: ${comicId}`);
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && !error && (
        <div>
          {comics.map((comic) => (
            <div key={comic.id}>
              <p>{comic.title}</p>
              <p>{comic.description}</p>
              <button onClick={() => handleCollect(comic.id)}>Collect</button>
              <button onClick={() => handleGiveUp(comic.id)}>Give Up</button>
            </div>
          ))}
          <button onClick={handlePreviousPage} disabled={parseInt(pageNum, 10) === 1}>
            Previous Page
          </button>
          <button onClick={handleNextPage}>Next Page</button>
        </div>
      )}
    </div>
  );
};

export default Collection;
