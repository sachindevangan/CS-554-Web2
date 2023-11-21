import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid,CardHeader } from '@mui/material';
import { GET_COMIC_DETAILS } from '../queries.js';
import noImage from '../img/download.jpeg';
import { useDispatch, useSelector } from 'react-redux';
import { collectComic, giveUpComic, selectSubCollection } from '../actions.js';
import { Button } from '@mui/material';

const Comic = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_COMIC_DETAILS, {
    variables: { id },
  });

  const dispatch = useDispatch();
  const subCollections = useSelector((state) => state.subCollections.subCollections);
  const selectedSubCollectionId = useSelector((state) => state.subCollections.selectedSubCollectionId);

  const isComicInSelectedSubCollection = () => {
    const selectedSubCollection = subCollections.find(
      (subCollection) => subCollection.id === selectedSubCollectionId
    );

    return selectedSubCollection
      ? selectedSubCollection.collection.some((comic) => comic.id === comicDetails.id)
      : false;
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
  

  const titleLimit = 30;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error('Error fetching comic details:', error);
  
    if (error.message) {
      return (
        <div>
          <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error.message}</p>
          <Link to='/marvel-comics/page/1'>Back to all comics...</Link>
        </div>
      );
    } else if (error.networkError && error.networkError.result) {
      const { code, status } = error.networkError.result;
      if (code && status) {
        return (
          <div>
            <p style={{ color: 'red', fontWeight: 'bold' }}>Error {code}: {status}</p>
            <Link to='/marvel-comics/page/1'>Back to all comics...</Link>
          </div>
        );
      }
    }
  
    return <p>Error fetching comic details</p>;
  }
  

  const comicDetails = data.comic;

  const thumbnailPath = comicDetails.thumbnail?.path;
  const thumbnailExtension = comicDetails.thumbnail?.extension;

  const imageVariant = 'portrait_uncanny';

  const imagePath = thumbnailPath && thumbnailExtension ? `${thumbnailPath}/${imageVariant}.${thumbnailExtension}` : noImage;

  return (
    <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
      <Card
        variant='outlined'
        sx={{
          maxWidth: 550,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 10,
          border: '1px solid #000000',
          boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
        }}
      >
      <CardHeader
        title={comicDetails.title}
        sx={{
          borderBottom: '1px solid #000000',
          fontWeight: 'bold'
        }}
      />
        <CardMedia
          sx={{
            height: 500,
            width: '100%',
            objectFit: 'cover',
          }}
          component='img'
          image={imagePath}
          alt={`Thumbnail for ${comicDetails.title}`}
        />
   <CardContent className='background-color'>
  <Typography
    variant='body2'
    color='textSecondary'
    component='div'
    sx={{
      borderBottom: '1px solid #000000',
      fontWeight: 'bold'
    }}
  >
    <dl className='description-list'>
      <div>
        <dt className='title'>Title:</dt>
        <dd>
          {comicDetails.title.length > titleLimit
            ? `${comicDetails.title.substring(0, titleLimit)}...`
            : comicDetails.title}
        </dd>
      </div>
      <div>
        <dt className='title'>description :</dt>
        <dd>{comicDetails.description  || 'N/A'}</dd>
      </div>
      <div>
        <dt className='title'>Issue Number:</dt>
        <dd>{comicDetails.issueNumber || 'N/A'}</dd>
      </div>
      <div>
        <dt className='title'>isbn :</dt>
        <dd>{comicDetails.isbn  || 'N/A'}</dd>
      </div>
      <div>
        <dt className='title'>format  :</dt>
        <dd>{comicDetails.format   || 'N/A'}</dd>
      </div>
      <div>
        <dt className='title'>pageCount :</dt>
        <dd>{comicDetails.pageCount  || 'N/A'}</dd>
      </div>
      <div>
        <dt className='title'>textObjects  :</dt>
        <dd>{comicDetails.textObjects   || 'N/A'}</dd>
      </div>
      <div>
        <dt className='title'>resourceURI  :</dt>
        <dd>{comicDetails.resourceURI   || 'N/A'}</dd>
      </div>
      <div>
        <dt className='title'>series  :</dt>
        <dd>{comicDetails.series   || 'N/A'}</dd>
      </div>
      <div>
        <dt className='title'>collections  :</dt>
        <dd>{comicDetails.collections   || 'N/A'}</dd>
      </div>
      <div>
        <dt className='title'>prices   :</dt>
        <dd>{comicDetails.isbn   || 'N/A'}</dd>
      </div>
    </dl>
    <Link to='/marvel-comics/page/1'>Back to all comics...</Link>
    <div>
              {!isComicInSelectedSubCollection() && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCollect(comicDetails.id)}
                  sx={{ marginRight: 1 }}
                >
                  Collect
                </Button>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleGiveUp(comicDetails.id)}
              >
                Give Up
              </Button>
            </div>
            
  </Typography>
</CardContent>

      </Card>
    </Grid>
  );
};

export default Comic;
