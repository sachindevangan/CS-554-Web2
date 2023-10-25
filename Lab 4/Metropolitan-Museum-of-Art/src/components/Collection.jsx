import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ArtListCard from './ArtListCard';
import { Grid } from '@mui/material';

const CollectionPage = () => {
  const { page } = useParams();
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchObjectsForPage() {
      try {
        const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(page - 1) * 50}&limit=5`);
        console.log(response.data);
        const totalObjects = response.data.total;
        const calculatedTotalPages = Math.ceil(totalObjects / 50);
        setTotalPages(calculatedTotalPages);
        setObjects(response.data.objectIDs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching objects:', error);
        setLoading(false);
      }
    }

    fetchObjectsForPage();
  }, [page]);

return (
  <div>
    <h1>Collections - Page {page}</h1>
    {loading && <p>Loading...</p>}
    {!loading && objects.length === 0 && <p>No objects found.</p>}
    {!loading && objects.length > 0 && (
      <div>
        {/* Render objects for the current page */}
        <Grid container spacing={2}>
          {objects.slice(0, 50).map(objectID => (
            <ArtListCard key={objectID} objectID={objectID} />
          ))}
        </Grid>
        {/* Pagination logic to show next/previous buttons based on current page */}
        {page > 1 && <Link to={`/collection/page/${parseInt(page) - 1}`}>Previous</Link>}
        {page < totalPages && <Link to={`/collection/page/${parseInt(page) + 1}`}>Next</Link>}
      </div>
    )}
  </div>
);
};

export default CollectionPage;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ArtListCard from './ArtListCard';
// import { Grid } from '@mui/material';
// import { Link, useParams } from 'react-router-dom';

// const CollectionPage = () => {
//   const { page } = useParams();
//   const [objects, setObjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Effect for fetching objects based on the page number
//   useEffect(() => {
//     async function fetchObjectsForPage() {
//       try {
//         setLoading(true);
//         const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(page - 1) * 50}&limit=50`);
//         setObjects(response.data.objectIDs);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching objects:', error);
//         setLoading(false);
//       }
//     }

//     fetchObjectsForPage();
//   }, [page]);

//   // Effect for fetching objects based on the search term
//   useEffect(() => {
//     console.log('search useEffect fired');
//     async function fetchData() {
//       try {
//         setLoading(true);
//         const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`);
//         const objectIds = response.data.objectIDs;
//         const requests = objectIds.map(objectId =>
//           axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`)
//         );
//         const responses = await Promise.all(requests);
//         const objectData = responses.map(response => response.data);
//         setObjects(objectData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching objects:', error);
//         setObjects([]);
//         setLoading(false);
//       }
//     }

//     if (searchTerm) {
//       console.log("searchTerm is set")
//       fetchData();
//     }
//   }, [searchTerm]);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   return (
//     <div>
//       <h1>Collections - Page {page}</h1>
//       <input
//         type="text"
//         placeholder="Enter Art title."
//         value={searchTerm}
//         onChange={handleSearch}
//       />
//       {loading && <p>Loading...</p>}
//       {!loading && objects.length === 0 && <p>No objects found.</p>}
//       {!loading && objects.length > 0 && (
//         <div>
//           <Grid container spacing={2}>
//             {objects.slice(0,50).map(objectID => (
//               <ArtListCard key={objectID} objectID={objectID} />
//             ))}
//           </Grid>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollectionPage;



