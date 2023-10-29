// import React, { useState, useEffect } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import ArtListCard from './ArtListCard';
// import { Grid } from '@mui/material';
// import SearchArts from './SearchArts';
// import './component.css';

// const CollectionPage = () => {
//   const navigate = useNavigate();
//   const { page } = useParams();
//   const [objects, setObjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     console.log('Current Search Term:', searchTerm);
//     const fetchObjectsForPage = async () => {
//       try {
//         setLoading(true);
//         let apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(currentPage - 1) * 50}&limit=50`;
//         if (searchTerm !== undefined && searchTerm !== null && searchTerm !== '') {
//           apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(searchTerm)}&limit=20`;
//         }
//         console.log('SearchTerm URL', apiUrl)
    
//         const response = await axios.get(apiUrl);
//         const allObjects = response.data.objectIDs;
//         const totalObjects = allObjects.length;
//         const calculatedTotalPages = Math.ceil(totalObjects / 50);
//         setTotalPages(calculatedTotalPages);

//         // Slice the object IDs for the current page
//         const startIndex = (currentPage - 1) * 50;
//         const endIndex = Math.min(startIndex + 50, totalObjects);
//         const objectsForCurrentPage = allObjects.slice(startIndex, endIndex);

//         setObjects(objectsForCurrentPage);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching objects:', error);
//         setLoading(false);

//         if (error.response && error.response.status === 404) {
//           navigate('/404');
//         }
//         // Handle 400 error
//         else if (error.response && error.response.status === 400) {
//           navigate('/400');
//         }
//       }
//     };

//     // Check if currentPage is below 1 or above totalPages
//     if (currentPage < 1 || currentPage > totalPages) {
//       navigate('/404'); // Redirect to the 404 page
//     } else {
//       fetchObjectsForPage();
//     }
//   }, [currentPage, searchTerm, navigate, totalPages]);

//   const visibleObjects = objects.slice(0, 50); // Display the first 50 objects from the search results

//   const handleFirstPage = () => {
//     setCurrentPage(1);
//   };

//   const handleNextPage = () => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   };

//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => prevPage - 1);
//   };

//   const handleLastPage = () => {
//     setCurrentPage(totalPages);
//   };

//   const handleSearch = (value) => {
//     console.log('Search Term:', value);
//     setSearchTerm(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div>
//       <div className="pagination-buttons">
//         {currentPage > 1 && <Link to={`/collection/page/1`} onClick={handleFirstPage}>First Page</Link>}
//         {currentPage > 1 && <Link to={`/collection/page/${currentPage - 1}`} onClick={handlePreviousPage}>Previous Page</Link>}
//         {currentPage < totalPages && <Link to={`/collection/page/${currentPage + 1}`} onClick={handleNextPage}>Next Page</Link>}
//         {currentPage !== totalPages && <Link to={`/collection/page/${totalPages}`} onClick={handleLastPage}>Last Page</Link>}
//       </div>
//       <div className="collection-page">
//         <h1>Collections - Page {currentPage}</h1>
//         <SearchArts searchValue={handleSearch} />

//         {loading && <p>Loading...</p>}
//         {!loading && visibleObjects.length === 0 && <p>No objects found.</p>}
//         {!loading && visibleObjects.length > 0 && (
//           <div>
//             <Grid container spacing={2}>
//               {visibleObjects.map((objectID) => (
//                 <ArtListCard key={objectID} objectID={objectID} />
//               ))}
//             </Grid>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CollectionPage;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams , Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ArtListCard from './ArtListCard';
import { Grid } from '@mui/material';
import SearchArts from './SearchArts';
import './component.css';

  const CollectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const departmentId = queryParams.get('departmentIds');
  const { page, departmentId: departmentIdParam } = useParams();
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const [searchTerm, setSearchTerm] = useState('');

  
const isDepartmentSearch = !!departmentId; 

  const pageTitle = isDepartmentSearch
  ? `Department ${departmentId} - Page ${currentPage}`
  : `Search Results for "${searchTerm}" - Page ${currentPage}`;

  useEffect(() => {
    const fetchObjectsForPage = async () => {
      try {
        setLoading(true);
        let apiUrl = '';
        if (departmentId) {
        apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}&offset=${(currentPage - 1) * 50}`;
        } else {
        apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(currentPage - 1) * 50}`;
        if (searchTerm !== undefined && searchTerm !== null && searchTerm !== '') {
        apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${(searchTerm)}`;
         }
        }

        const response = await axios.get(apiUrl);
        console.log("These are the objects", response.data)
        const allObjects = response.data.objectIDs;
        const totalObjects = allObjects.length;
        const calculatedTotalPages = Math.ceil(totalObjects / 50);
        setTotalPages(calculatedTotalPages);

      
        const startIndex = (currentPage - 1) * 50;
        const endIndex = Math.min(startIndex + 50, totalObjects);
        const objectsForCurrentPage = allObjects.slice(startIndex, endIndex);

        setObjects(objectsForCurrentPage);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching objects:', error);
        setLoading(false);

        if (error.response && error.response.status === 404) {
          navigate('/404');
        } else if (error.response && error.response.status === 400) {
          navigate('/400');
        }
      }
    };
    fetchObjectsForPage();

    // if (currentPage < 1 ) {
    //   navigate('/400'); 
    // } else if (currentPage > totalPages) {
    //   navigate('/404'); 
    // } else{
    //   fetchObjectsForPage();
    // }
  }, [currentPage, searchTerm, departmentId, navigate, totalPages,  isDepartmentSearch]);

  const visibleObjects = objects.slice(0, 50); 

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    const url = `/collection/page/${nextPage}${isDepartmentSearch ? `?departmentIds=${departmentId}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`;
    navigate(url);
  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      const url = `/collection/page/${prevPage}${isDepartmentSearch ? `?departmentIds=${departmentId}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`;
      navigate(url);
    }
  };
  
  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    // Explicitly set searchTerm in the URL if you need it
    navigate(`/collection/page/1${isDepartmentSearch ? `?departmentIds=${departmentId}` : ''}&searchTerm=${value}`);
    setCurrentPage(1);
  };
  

  return (
    <div>
    <div className="pagination-buttons">{currentPage > 1 && (<Link to={`/collection/page/1${isDepartmentSearch ? `?departmentIds=${departmentId}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`}
      onClick={handleFirstPage}
    >
      First Page
    </Link>
  )}
  {currentPage > 1 && (
    <Link
      to={`/collection/page/${currentPage - 1}${isDepartmentSearch ? `?departmentIds=${departmentId}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`}
      onClick={handlePreviousPage}
    >
      Previous Page
    </Link>
  )}
  {currentPage < totalPages && (
    <Link
      to={`/collection/page/${currentPage + 1}${isDepartmentSearch ? `?departmentIds=${departmentId}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`}
      onClick={handleNextPage}
    >
      Next Page
    </Link>
  )}
  {currentPage !== totalPages && (
    <Link
      to={`/collection/page/${totalPages}${isDepartmentSearch ? `?departmentIds=${departmentId}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`}
      onClick={handleLastPage}
    >
      Last Page
    </Link>
  )}
</div>
{isDepartmentSearch && <h1>Department {departmentId} - Page {currentPage}</h1>}
{!isDepartmentSearch && searchTerm && (
  <div className="collection-page">
    <h1>Search Results for "{searchTerm}" - Page {currentPage}</h1>
    <SearchArts searchValue={handleSearch} />
  </div>
)}
{!isDepartmentSearch && !searchTerm && (
  <div className="collection-page">
    <h1>Art Collections - Page {currentPage}</h1>
    <SearchArts searchValue={handleSearch} />
  </div>
)}

    {!loading && visibleObjects.length === 0 && <p>No objects found.</p>}
    {!loading && visibleObjects.length > 0 && (
      <div>
        <Grid container spacing={2}>
          {visibleObjects.map((objectID) => (
            <ArtListCard key={objectID} objectID={objectID} />
          ))}
        </Grid>
      </div>
    )}
  </div>
);
};

export default CollectionPage;
