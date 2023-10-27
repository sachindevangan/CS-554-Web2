// // import React, { useEffect, useState } from 'react';
// // import { Link, useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import ArtListCard from './ArtListCard';
// // import { Grid } from '@mui/material';

// // const CollectionPage = () => {
// //   const { page } = useParams();
// //   const [objects, setObjects] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [totalPages, setTotalPages] = useState(1);

// //   useEffect(() => {
// //     async function fetchObjectsForPage() {
// //       try {
// //         const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(page - 1) * 50}&limit=5`);
// //         console.log(response.data);
// //         const totalObjects = response.data.total;
// //         const calculatedTotalPages = Math.ceil(totalObjects / 50);
// //         setTotalPages(calculatedTotalPages);
// //         setObjects(response.data.objectIDs);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching objects:', error);
// //         setLoading(false);
// //       }
// //     }

// //     fetchObjectsForPage();
// //   }, [page]);

// // return (
// //   <div>
// //     <h1>Collections - Page {page}</h1>
// //     {loading && <p>Loading...</p>}
// //     {!loading && objects.length === 0 && <p>No objects found.</p>}
// //     {!loading && objects.length > 0 && (
// //       <div>
// //         {/* Render objects for the current page */}
// //         <Grid container spacing={2}>
// //           {objects.slice(0, 50).map(objectID => (
// //             <ArtListCard key={objectID} objectID={objectID} />
// //           ))}
// //         </Grid>
// //         {/* Pagination logic to show next/previous buttons based on current page */}
// //         {page > 1 && <Link to={`/collection/page/${parseInt(page) - 1}`}>Previous</Link>}
// //         {page < totalPages && <Link to={`/collection/page/${parseInt(page) + 1}`}>Next</Link>}
// //       </div>
// //     )}
// //   </div>
// // );
// // };

// // export default CollectionPage;


// // import React, { useEffect, useState } from 'react';
// // import { Link, useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import ArtListCard from './ArtListCard';
// // import { Grid } from '@mui/material';
// // import SearchArts from './SearchArts'; // Import the SearchArts component

// // const CollectionPage = () => {
// //   const { page } = useParams();
// //   const [objects, setObjects] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [searchTerm, setSearchTerm] = useState(''); // State to store the search term

// //   useEffect(() => {
// //     // Fetch objects based on the page and search term
// //     async function fetchObjectsForPage() {
// //       try {
// //         setLoading(true);
// //         let apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(page - 1) * 50}&limit=5`;
        
// //         // If searchTerm is present, modify the API URL for search
// //         if (searchTerm) {
// //           apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
// //         }

// //         const response = await axios.get(apiUrl);
// //         console.log(response.data);
// //         const totalObjects = response.data.total;
// //         const calculatedTotalPages = Math.ceil(totalObjects / 50);
// //         setTotalPages(calculatedTotalPages);
// //         setObjects(response.data.objectIDs);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching objects:', error);
// //         setLoading(false);
// //       }
// //     }

// //     fetchObjectsForPage();
// //   }, [page, searchTerm]);

// //   // Function to handle search term change
// //   const handleSearch = (value) => {
// //     setSearchTerm(value);
// //   };

// //   return (
// //     <div>
// //       <h1>Collections - Page {page}</h1>
// //       {/* Search input */}
// //       <SearchArts searchValue={handleSearch} />

// //       {loading && <p>Loading...</p>}
// //       {!loading && objects.length === 0 && <p>No objects found.</p>}
// //       {!loading && objects.length > 0 && (
// //         <div>
// //           {/* Render objects for the current page */}
// //           <Grid container spacing={2}>
// //             {objects.slice(0, 50).map((objectID) => (
// //               <ArtListCard key={objectID} objectID={objectID} />
// //             ))}
// //           </Grid>
// //           {/* Pagination logic to show next/previous buttons based on current page */}
// //           {page > 1 && <Link to={`/collection/page/${parseInt(page) - 1}`}>Previous</Link>}
// //           {page < totalPages && <Link to={`/collection/page/${parseInt(page) + 1}`}>Next</Link>}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CollectionPage;


// // import React, { useEffect, useState } from 'react';
// // import { Link, useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import ArtListCard from './ArtListCard';
// // import { Grid } from '@mui/material';
// // import SearchArts from './SearchArts'; // Import the SearchArts component

// // const CollectionPage = () => {
// //   const { page } = useParams();
// //   const [objects, setObjects] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [searchTerm, setSearchTerm] = useState(''); // State to store the search term

// //   useEffect(() => {
// //     // Fetch objects based on the page and search term
// //     async function fetchObjectsForPage() {
// //       try {
// //         setLoading(true);
// //         let apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(page - 1) * 50}&limit=50`;
        
// //         // If searchTerm is present, modify the API URL for search
// //         if (searchTerm) {
// //           apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
// //         }

// //         const response = await axios.get(apiUrl);
// //         console.log(response.data);
// //         const totalObjects = response.data.total;
// //         const calculatedTotalPages = Math.ceil(totalObjects / 50);
// //         setTotalPages(calculatedTotalPages);
// //         setObjects(response.data.objectIDs);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching objects:', error);
// //         setLoading(false);
// //       }
// //     }

// //     fetchObjectsForPage();
// //   }, [page, searchTerm]);

// //   // Function to handle search term change
// //   const handleSearch = (value) => {
// //     setSearchTerm(value);
// //   };

// //   return (
// //     <div>
// //       <h1>Collections - Page {page}</h1>
// //       {/* Search input */}
// //       <SearchArts searchValue={handleSearch} />

// //       {loading && <p>Loading...</p>}
// //       {!loading && objects.length === 0 && <p>No objects found.</p>}
// //       {!loading && objects.length > 0 && (
// //         <div>
// //           {/* Render objects for the current page */}
// //           <Grid container spacing={2}>
// //             {objects.slice(0, 50).map((objectID) => (
// //               <ArtListCard key={objectID} objectID={objectID} />
// //             ))}
// //           </Grid>
// //           {/* Pagination logic to show next/previous buttons based on current page */}
// //           {page > 1 && <Link to={`/collection/page/${parseInt(page) - 1}`}>Previous</Link>}
// //           {page < totalPages && <Link to={`/collection/page/${parseInt(page) + 1}`}>Next</Link>}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CollectionPage;


// // import React, { useEffect, useState } from 'react';
// // import { Link, useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import ArtListCard from './ArtListCard';
// // import { Grid } from '@mui/material';
// // import SearchArts from './SearchArts'; // Import the SearchArts component

// // const CollectionPage = () => {
// //   const { page } = useParams();
// //   const [objects, setObjects] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1); // Use currentPage state
// //   const [searchTerm, setSearchTerm] = useState(''); // State to store the search term

// //   useEffect(() => {
// //     // Fetch objects based on the page and search term
// //     async function fetchObjectsForPage() {
// //       try {
// //         setLoading(true);
// //         let apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(currentPage - 1) * 50}&limit=50`;
        
// //         // If searchTerm is present, modify the API URL for search
// //         if (searchTerm) {
// //           apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
// //         }

// //         const response = await axios.get(apiUrl);
// //         const totalObjects = response.data.total;
// //         const calculatedTotalPages = Math.ceil(totalObjects / 50);
// //         setTotalPages(calculatedTotalPages);
// //         setObjects(response.data.objectIDs);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching objects:', error);
// //         setLoading(false);
// //       }
// //     }

// //     fetchObjectsForPage();
// //   }, [currentPage, searchTerm]); // Update on currentPage change

// //   // Function to handle search term change
// //   const handleSearch = (value) => {
// //     setSearchTerm(value);
// //     setCurrentPage(1); // Reset currentPage to 1 when performing a new search
// //   };

// //   return (
// //     <div>
// //       <h1>Collections - Page {currentPage}</h1>
// //       {/* Search input */}
// //       <SearchArts searchValue={handleSearch} />

// //       {loading && <p>Loading...</p>}
// //       {!loading && objects.length === 0 && <p>No objects found.</p>}
// //       {!loading && objects.length > 0 && (
// //         <div>
// //           {/* Render objects for the current page */}
// //           <Grid container spacing={2}>
// //             {objects.slice(0, 50).map((objectID) => (
// //               <ArtListCard key={objectID} objectID={objectID} />
// //             ))}
// //           </Grid>
// //           {/* Pagination logic to show next/previous buttons based on current page */}
// //           {currentPage > 1 && <Link to={`/collection/page/${currentPage - 1}`}>Previous</Link>}
// //           {currentPage < totalPages && <Link to={`/collection/page/${currentPage + 1}`}>Next</Link>}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CollectionPage;



// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import ArtListCard from './ArtListCard';
// import { Grid } from '@mui/material';
// import SearchArts from './SearchArts'; // Import the SearchArts component

// const CollectionPage = () => {
//   const { page } = useParams();
//   const [objects, setObjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchObjectsForPage = async () => {
//       try {
//         setLoading(true);
//         let apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(currentPage - 1) * 50}&limit=50`;
//         if (searchTerm) {
//           apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
//         }
//         const response = await axios.get(apiUrl);
//         const totalObjects = response.data.total;
//         const calculatedTotalPages = Math.ceil(totalObjects / 50);
//         setTotalPages(calculatedTotalPages);
//         setObjects(response.data.objectIDs);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching objects:', error);
//         setLoading(false);
//       }
//     };

//     fetchObjectsForPage();
//   }, [currentPage, searchTerm]);

//   useEffect(() => {
//     const fetchObjectsWithSearch = async () => {
//       try {
//         setLoading(true);
//         const apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
//         const response = await axios.get(apiUrl);
//         const totalObjects = response.data.total;
//         const calculatedTotalPages = Math.ceil(totalObjects / 50);
//         setTotalPages(calculatedTotalPages);
//         setObjects(response.data.objectIDs);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching objects with search:', error);
//         setLoading(false);
//       }
//     };

//     if (searchTerm) {
//       fetchObjectsWithSearch();
//     } else {
//       setCurrentPage(1);
//     }
//   }, [searchTerm]);

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//   };

//   return (
//     <div>
//       <h1>Collections - Page {currentPage}</h1>
//       <SearchArts searchValue={handleSearch} />

//       {loading && <p>Loading...</p>}
//       {!loading && objects.length === 0 && <p>No objects found.</p>}
//       {!loading && objects.length > 0 && (
//         <div>
//           <Grid container spacing={2}>
//             {objects.slice(0, 50).map((objectID) => (
//               <ArtListCard key={objectID} objectID={objectID} />
//             ))}
//           </Grid>
//           {currentPage > 1 && <Link to={`/collection/page/${currentPage - 1}`}>Previous</Link>}
//           {currentPage < totalPages && <Link to={`/collection/page/${currentPage + 1}`}>Next</Link>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollectionPage;


// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import ArtListCard from './ArtListCard';
// import { Grid } from '@mui/material';
// import SearchArts from './SearchArts'; // Import the SearchArts component

// const CollectionPage = () => {
//   const { page } = useParams();
//   const [objects, setObjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchObjectsForPage = async () => {
//       try {
//         setLoading(true);
//         let apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(currentPage - 1) * 50}&limit=50`;
//         if (searchTerm) {
//           apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
//         }
//         const response = await axios.get(apiUrl);
//         const totalObjects = response.data.total;
//         const calculatedTotalPages = Math.ceil(totalObjects / 50);
//         setTotalPages(calculatedTotalPages);
//         setObjects(response.data.objectIDs);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching objects:', error);
//         setLoading(false);
//       }
//     };

//     fetchObjectsForPage();
//   }, [currentPage, searchTerm]);

//   const handleNextPage = () => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   };

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div>
//       <h1>Collections - Page {currentPage}</h1>
//       <SearchArts searchValue={handleSearch} />

//       {loading && <p>Loading...</p>}
//       {!loading && objects.length === 0 && <p>No objects found.</p>}
//       {!loading && objects.length > 0 && (
//         <div>
//           <Grid container spacing={2}>
//             {objects.slice(0, 50).map((objectID) => (
//               <ArtListCard key={objectID} objectID={objectID} />
//             ))}
//           </Grid>
//           {currentPage > 1 && <Link to={`/collection/page/${currentPage - 1}`}>Previous</Link>}
//           {currentPage < totalPages && <Link to={`/collection/page/${currentPage + 1}`} onClick={handleNextPage}>Next</Link>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollectionPage;


// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import ArtListCard from './ArtListCard';
// import { Grid } from '@mui/material';
// import SearchArts from './SearchArts';

// const CollectionPage = () => {
//   const { page } = useParams();
//   const [objects, setObjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchObjectsForPage = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects`);
//         const allObjects = response.data.objectIDs;
//         const totalObjects = allObjects.length;
//         const calculatedTotalPages = Math.ceil(totalObjects / 50);
//         setTotalPages(calculatedTotalPages);
//         setObjects(allObjects);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching objects:', error);
//         setLoading(false);
//       }
//     };

//     fetchObjectsForPage();
//   }, []);

//   const visibleObjects = objects.slice((currentPage - 1) * 50, currentPage * 50);

//   const handleNextPage = () => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   };
//   const handlePreviousPage = () => {
//     setCurrentPage((prevPage) => prevPage - 1);
//   }

//   const handleSearch = (value) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div>
//       <h1>Collections - Page {currentPage}</h1>
//       <SearchArts searchValue={handleSearch} />

//       {loading && <p>Loading...</p>}
//       {!loading && visibleObjects.length === 0 && <p>No objects found.</p>}
//       {!loading && visibleObjects.length > 0 && (
//         <div>
//           <Grid container spacing={2}>
//             {visibleObjects.map((objectID) => (
//               <ArtListCard key={objectID} objectID={objectID} />
//             ))}
//           </Grid>
//           {currentPage > 1 && <Link to={`/collection/page/${currentPage - 1}`} onClick={handlePreviousPage}>Previous</Link>}
//           {currentPage < totalPages && <Link to={`/collection/page/${currentPage + 1}`} onClick={handleNextPage}>Next</Link>}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollectionPage;

// import React, { useState, useEffect } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import ArtListCard from './ArtListCard';
// import { Grid } from '@mui/material';
// import SearchArts from './SearchArts';
// import './component.css'

// const CollectionPage = () => {
//   const { page } = useParams();
//   const [objects, setObjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);
//   const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchObjectsForPage = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects`);
//         const allObjects = response.data.objectIDs;
//         const totalObjects = allObjects.length;
//         const calculatedTotalPages = Math.ceil(totalObjects / 50);
//         setTotalPages(calculatedTotalPages);
//         setObjects(allObjects);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching objects:', error);
//         setLoading(false);
//       }
//     };

//     fetchObjectsForPage();
//   }, []);

//   const visibleObjects = objects.slice((currentPage - 1) * 50, currentPage * 50);

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
//     setSearchTerm(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div>
//     <div className="pagination-buttons">
//     {currentPage > 1 && <Link to={`/collection/page/1`} onClick={handleFirstPage}>First Page</Link>}
//     {currentPage > 1 && <Link to={`/collection/page/${currentPage - 1}`} onClick={handlePreviousPage}>Previous Page</Link>}
//     {currentPage < totalPages && <Link to={`/collection/page/${currentPage + 1}`} onClick={handleNextPage}>Next Page</Link>}
//     {currentPage !== totalPages && <Link to={`/collection/page/${totalPages}`} onClick={handleLastPage}>Last Page</Link>}
//   </div>
//     <div className="collection-page">
//       <h1>Collections - Page {currentPage}</h1>
//       <SearchArts searchValue={handleSearch} />

//       {loading && <p>Loading...</p>}
//       {!loading && visibleObjects.length === 0 && <p>No objects found.</p>}
//       {!loading && visibleObjects.length > 0 && (
//         <div>
//           <Grid container spacing={2}>
//             {visibleObjects.map((objectID) => (
//               <ArtListCard key={objectID} objectID={objectID} />
//             ))}
//           </Grid>
//         </div>
//       )}
//     </div>
//     </div>
//   );
// };

// export default CollectionPage;

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArtListCard from './ArtListCard';
import { Grid } from '@mui/material';
import SearchArts from './SearchArts';
import './component.css';

const CollectionPage = () => {
  const navigate = useNavigate();
  const { page } = useParams();
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page ? parseInt(page) : 1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchObjectsForPage = async () => {
      try {
        setLoading(true);
        let apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(currentPage - 1) * 50}&limit=50`;
        if (searchTerm) {
          apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
        }

        const response = await axios.get(apiUrl);
        const allObjects = response.data.objectIDs;
        const totalObjects = allObjects.length;
        const calculatedTotalPages = Math.ceil(totalObjects / 50);
        setTotalPages(calculatedTotalPages);
        setObjects(allObjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching objects:', error);
        setLoading(false);

        // Handle 404 error
        if (error.response && error.response.status === 404) {
          navigate('/404');
        }
        // Handle 400 error
        else if (error.response && error.response.status === 400) {
          navigate('/400');
        }
      }
    };
    if (currentPage > totalPages) {
      navigate('/404'); // Redirect to the 404 page
    }
    

    // Check if currentPage is below 1 or above 9706
    if (currentPage < 1 ) {
      navigate('/400');
    } else {
      fetchObjectsForPage();
    }
  }, [currentPage, searchTerm, navigate]);


  const visibleObjects = objects.slice(0, 50); // Display the first 50 objects from the search results

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="pagination-buttons">
        {currentPage > 1 && <Link to={`/collection/page/1`} onClick={handleFirstPage}>First Page</Link>}
        {currentPage > 1 && <Link to={`/collection/page/${currentPage - 1}`} onClick={handlePreviousPage}>Previous Page</Link>}
        {currentPage < totalPages && <Link to={`/collection/page/${currentPage + 1}`} onClick={handleNextPage}>Next Page</Link>}
        {currentPage !== totalPages && <Link to={`/collection/page/${totalPages}`} onClick={handleLastPage}>Last Page</Link>}
      </div>
      <div className="collection-page">
        <h1>Collections - Page {currentPage}</h1>
        <SearchArts searchValue={handleSearch} />

        {loading && <p>Loading...</p>}
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
    </div>
  );
};

export default CollectionPage;
