import React, { useState, useEffect } from 'react';
import axios from 'axios';
import noImage from '../img/download.jpeg';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Grid } from '@mui/material';

function ArtListCard({ objectID }) {
  console.log("Received Object ID", objectID);
  const [artDetails, setArtDetails] = useState(null);

  useEffect(() => {
    async function fetchArtDetails() {
      try {
        const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);
        setArtDetails(response.data);
        console.log("thisis response data",response.data)
      } catch (error) {
        console.error('Error fetching art details:', error);
      }
    }

    fetchArtDetails();
  }, [objectID]);

  if (!artDetails) {
    return null; // or loading indicator
  }

  const artistDisplayName = artDetails.artistDisplayName || 'Unknown Artist'; // Get artist display name or set to 'Unknown Artist'

  return (
    <>
    <Grid item xs={12} sm={7} md={5} lg={4} xl={3}>
      <Card
        variant='outlined'
        sx={{ 
          maxWidth: 250,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 10,
          border: '1px solid #000000;',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardActionArea>
          <Link to={`/collection/${objectID}`}>
            <CardMedia
              sx={{
                height: 200, // Set height for the image
                width: '100%',
                objectFit: 'cover', // Ensure the image covers the area without stretching
              }}
              component='img'
              image={artDetails.primaryImage ? artDetails.primaryImage : noImage}
              title={artDetails.title}
            />
            <CardContent>
              <Typography
                sx={{
                  borderBottom: '1px solid #000000',
                  fontWeight: 'bold',
                }}
                gutterBottom
                variant='h6'
                component='h3'
              >
                {artDetails.title}
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                Artist: {artistDisplayName}<br />
                {artDetails.objectDate ? `Date: ${artDetails.objectDate}` : 'Date: Unknown Date'}
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
    </>
  );
}


export default ArtListCard;
