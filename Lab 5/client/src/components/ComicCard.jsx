import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid, Button } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_COMIC_DETAILS } from '../queries.js';
import noImage from '../img/download.jpeg';
import { useSelector } from 'react-redux';

const ComicCard = ({ comicId ,handleCollect, handleGiveUp}) => {
  const { loading, error, data } = useQuery(GET_COMIC_DETAILS, {
    variables: { id: comicId },
  });

  const selectedSubCollectionId = useSelector((state) => state.subCollections.selectedSubCollectionId);
  const subCollections = useSelector((state) => state.subCollections.subCollections);

  const isComicInSelectedSubCollection = () => {
    const selectedSubCollection = subCollections.find(
      (subCollection) => subCollection.id === selectedSubCollectionId
    );

    return selectedSubCollection
      ? selectedSubCollection.collection.some((comic) => comic.id === comicId)
      : false;
  };

  const noSubCollectionSelected = !selectedSubCollectionId;
 
  const titleLimit = 30;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error('Error fetching comic details:', error);
    return <p>Error fetching comic details</p>;
  }

  const comicDetails = data.comic;


  const thumbnailPath = comicDetails.thumbnail?.path;
  const thumbnailExtension = comicDetails.thumbnail?.extension;


  const imageVariant = 'portrait_uncanny';

  const imagePath = thumbnailPath && thumbnailExtension ? `${thumbnailPath}/${imageVariant}.${thumbnailExtension}` : noImage;


  const getFormattedDate = (type) => {
    const dateObject = comicDetails.dates?.find((date) => date.type === type);
    return dateObject ? new Date(dateObject.date).toLocaleDateString('en-US') : 'N/A';
  };

  const getPrice = (type) => {
    const priceObject = comicDetails.prices?.find((price) => price.type === type);
    return priceObject ? `$${priceObject.price}` : 'N/A';
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card
         variant='outlined'
          sx={{
            width: 300,
            height: 400, 
            borderRadius: 5,
            border: '1px solid #000000',
            boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
      >
      <CardContent>
        <Link to={`/marvel-comics/${comicDetails.id}`}>
          <CardMedia
            sx={{
              height: 250,
              width: '100%',
              objectFit: 'cover',
            }}
            component='img'
            image={imagePath}
            title={comicDetails.title}
          />
          
            <Typography
              sx={{
                borderBottom: '1px solid #000000',
                fontWeight: 'bold',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              gutterBottom
              variant='h6'
              component='h3'
            >
              {comicDetails.title.length > titleLimit
                ? `${comicDetails.title.substring(0, titleLimit)}...`
                : comicDetails.title}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              Issue Number: {comicDetails.issueNumber}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
               On Sale Date: {getFormattedDate('onsaleDate')}
            </Typography>
            <Typography variant='body2' color='textSecondary' component='p'>
              Print Price: {getPrice('printPrice')}
            </Typography>
            </Link>
            <div>
            {!noSubCollectionSelected && !isComicInSelectedSubCollection() && (
              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: 1 }}
                onClick={() => handleCollect(comicId)}
              >
                Collect
              </Button>
            )}
            {!noSubCollectionSelected && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleGiveUp(comicId)}
              >
                Give Up
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ComicCard;