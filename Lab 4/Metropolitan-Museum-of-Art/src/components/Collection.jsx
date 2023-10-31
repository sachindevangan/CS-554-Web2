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

        if ((isDepartmentSearch && (!departmentId || departmentId < 1)) || currentPage <= 0) {
          navigate('/400');
          return;
        }
  
        if (currentPage <= 0) {
          navigate('/400'); 
          return;
        }

        if (currentPage > totalPages && totalPages > 1) {
          navigate('/404'); 
          return;
        }

        setLoading(true);
        let apiUrl = '';
        let objectsPerPage = 50;

        if (isDepartmentSearch && departmentId > 0) {
          apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}&offset=${(currentPage - 1) * 50}`;
        } else {
          apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects?offset=${(currentPage - 1) * 50}`;
          if (searchTerm !== undefined && searchTerm !== null && searchTerm !== '') {
            objectsPerPage = 30;
            apiUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchTerm}`;
          }
        }

        const response = await axios.get(apiUrl);
        if (isDepartmentSearch && departmentId && !response.data || (response.data && response.data.total == 0)) {
          navigate('/404')
          return;
        }
        console.log("These are the objects", response.data)
        const allObjects = response.data.objectIDs;
        if (allObjects === null) {
          setTotalPages(0);
          setObjects([]);
          setLoading(false);
          return;
        }
        const totalObjects = allObjects.length;
        const calculatedTotalPages = Math.ceil(totalObjects / 50);
        setTotalPages(calculatedTotalPages);

      
        const startIndex = (currentPage - 1) * objectsPerPage;
        const endIndex = startIndex + objectsPerPage;
        const visibleObjects = allObjects.slice(startIndex, endIndex);

        setObjects(visibleObjects);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching objects:', error);
        setLoading(false);
      }
    };
    fetchObjectsForPage();
  }, [currentPage, searchTerm, departmentId, navigate, totalPages,  isDepartmentSearch]);

  const visibleObjects = objects.slice(0, 50); 

  const handleFirstPage = () => {
    setCurrentPage(1);
    const url = `/collection/page/1${isDepartmentSearch ? `?departmentIds=${departmentIdParam}` : ''}${searchTerm ? `&searchTerm=${searchTerm}` : ''}`;
    navigate(url);
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
    navigate(`/collection/page/1${isDepartmentSearch ? `?departmentIds=${departmentId}` : ''}&searchTerm=${value}`);
    setCurrentPage(1);
  };

  return (
    <div>
    <div className="pagination-buttons">
        {currentPage > 1 && (
          <button className="pagination-button" onClick={handleFirstPage}>
            First Page
          </button>
        )}
        {currentPage > 1 && (
          <button className="pagination-button" onClick={handlePreviousPage}>
            Previous Page
          </button>
        )}
        {currentPage < totalPages && (
          <button className="pagination-button" onClick={handleNextPage}>
            Next Page
          </button>
        )}
        {currentPage !== totalPages && (
          <button className="pagination-button" onClick={handleLastPage}>
            Last Page
          </button>
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

  {!loading && visibleObjects.length === 0 && (<p style={{ fontSize: '25px', fontWeight: 'bold' }}>No objects found.</p>)}
  {!loading && visibleObjects.length > 0 && (
  <div>
      <Grid container spacing={2}>
        {visibleObjects.map((objectID) => (
        <ArtListCard key={objectID} objectID={objectID} /> ))}
      </Grid>
  </div>
    )}
    {loading && (<p style={{ fontSize: '25px', fontWeight: 'bold' }}>Loading.....</p>)}
  </div>
);
};

export default CollectionPage;
