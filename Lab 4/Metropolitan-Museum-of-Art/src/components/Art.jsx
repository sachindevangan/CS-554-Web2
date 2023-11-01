import React , {useState, useEffect} from 'react'
import axios from 'axios'
import  '../App.css'
import {Link, useParams} from 'react-router-dom'
import noImage from '../img/download.jpeg'
import { useNavigate } from 'react-router-dom';
import {Card,CardContent,CardMedia,Typography,CardHeader} from '@mui/material'

const Art = (props)  =>{

  const {id} = useParams()
  const [artData, setArtData] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() =>{
    console.log("Show useEffect fired!")
    const fetchData = async() =>{
      try{
      const parsedId = parseInt(id);
      if (isNaN(parsedId) || parsedId < 1) {
        navigate('/400');
        return;
      }
        const {data} = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)

        if (data && data.title) {
        setArtData(data)
         setLoading(false);
        } else {
          navigate('/404');
        }
      } catch (error) {
        navigate('/404');
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
          component='div'
          sx={{
            borderBottom: '1px solid #000000',
            fontWeight: 'bold'
          }}
        >
          <dl className='description-list'>
            <div>
              <dt className='title'>Artist Name</dt>
              <dd>{artData.artistDisplayName || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Artist Bio:</dt>
              <dd>{artData.artistDisplayBio || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Artist Gender:</dt>
              <dd>{artData.artistGender || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Object Date:</dt>
              <dd>{artData.objectDate || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Department:</dt>
              <dd>{artData.department || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Medium:</dt>
              <dd>{artData.medium || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Classification:</dt>
              <dd>{artData.classification || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Culture:</dt>
              <dd>{artData.culture || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Dimensions:</dt>
              <dd>{artData.dimensions || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Period:</dt>
              <dd>{artData.period || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Credit Line:</dt>
              <dd>{artData.creditLine || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Geography Type:</dt>
              <dd>{artData.geographyType || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Repository:</dt>
              <dd>{artData.repository || 'N/A'}</dd>
            </div>
            <div>
              <dt className='title'>Object URL:</dt>
              <dd>
                <a href={artData.objectURL} target='_blank' rel='noopener noreferrer'>
                  {artData.objectURL || 'N/A'}
                </a>
              </dd>
            </div>
            <div>
              <dt className='title'>Wikidata URL:</dt>
              <dd>
                <a href={artData.objectWikidata_URL} target='_blank' rel='noopener noreferrer'>
                  {artData.objectWikidata_URL || 'N/A'}
                </a>
              </dd>
            </div>
            <div>
              <dt className='title'>Gallery Number:</dt>
              <dd>{artData.GalleryNumber || 'N/A'}</dd>
            </div>
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