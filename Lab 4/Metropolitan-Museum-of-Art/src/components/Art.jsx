import React , {useState, useEffect} from 'react'
import axios from 'axios'
import  '../App.css'
import {Link, useParams} from 'react-router-dom'
import noImage from '../img/download.jpeg'
import { useNavigate } from 'react-router-dom';


import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader
} from '@mui/material'
import { red } from '@mui/material/colors'



function Art(props) {
  const {id} = useParams()
  const [artData, setArtData] = useState(undefined)
  const [loading, setLoading] = useState(true)

  const tConvert = (time) => {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  };
  const formatDate = (showdate) => {
    var year = showdate.substring(0, 4);
    var month = showdate.substring(5, 7);
    var day = showdate.substring(8, 10);
    return month + '/' + day + '/' + year;
  };

  const navigate = useNavigate();

  useEffect(() =>{
    console.log("Show useEffect fired!")
    const fetchData = async() =>{
      try{
        // Check if id is less than 1, treat it as an invalid request and redirect to 400 page
      const parsedId = parseInt(id);
      if (isNaN(parsedId) || parsedId < 1) {
        navigate('/400');
        return;
      }
        const {data} = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
        setArtData(data)
        setLoading(false)
        console.log(data)
      }catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    )
  } else {
  return (
    <div>
       <Card
      variant='outlined'
      sx={{
        maxWidth: 550,
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderRadius: 5,
        border: '1px solid #000000',
        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
      }}
    >
      <CardHeader
        title={artData.title}
        sx={{
          borderBottom: '1px solid #000000',
          fontWeight: 'bold'
        }}
      />
      <CardMedia
        component='img'
        image={artData.primaryImage || (artData.additionalImages && artData.additionalImages.length > 0 ? artData.additionalImages[0] : noImage)}
        title={artData.title}
      />

      <CardContent className='background-color'>
        <Typography
          variant='body2'
          color='textSecondary'
          component='span'
          sx={{
            borderBottom: '1px solid #000000',
            fontWeight: 'bold'
          }}
        >
          <dl>
            <p>
              <dt className='title'>Artist Name</dt>
              <dd>{artData.artistDisplayName || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Artist Bio:</dt>
              <dd>{artData.artistDisplayBio || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Artist Gender:</dt>
              <dd>{artData.artistGender || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Object Date:</dt>
              <dd>{artData.objectDate || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Department:</dt>
              <dd>{artData.department || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Medium:</dt>
              <dd>{artData.medium || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Classification:</dt>
              <dd>{artData.classification || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Culture:</dt>
              <dd>{artData.culture || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Dimensions:</dt>
              <dd>{artData.dimensions || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Medium:</dt>
              <dd>{artData.medium || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Credit Line:</dt>
              <dd>{artData.creditLine || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Geography Type:</dt>
              <dd>{artData.geographyType || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Repository:</dt>
              <dd>{artData.repository || 'N/A'}</dd>
            </p>
            <p>
              <dt className='title'>Object URL:</dt>
              <dd>
                <a href={artData.objectURL} target='_blank' rel='noopener noreferrer'>
                  {artData.objectURL || 'N/A'}
                </a>
              </dd>
            </p>
            <p>
              <dt className='title'>Wikidata URL:</dt>
              <dd>
                <a href={artData.objectWikidata_URL} target='_blank' rel='noopener noreferrer'>
                  {artData.objectWikidata_URL || 'N/A'}
                </a>
              </dd>
            </p>
            <p>
              <dt className='title'>Gallery Number:</dt>
              <dd>{artData.GalleryNumber || 'N/A'}</dd>
            </p>
          </dl>
          <Link to='/collection/page/1'>Back to all artworks...</Link>
        </Typography>
      </CardContent>
    </Card>

    </div>
  )
}
}

export default Art
