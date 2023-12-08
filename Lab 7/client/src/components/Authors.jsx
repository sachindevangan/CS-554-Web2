import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_AUTHORS,
  ADD_AUTHOR,
  EDIT_AUTHOR,
  DELETE_AUTHOR,
} from '../queries.js'; 
import './component.css'
import { useNavigate } from 'react-router-dom';

const Authors = () => {
  const { loading, error, data } = useQuery(GET_AUTHORS);
  console.log("DATA",data)
  
  const [addAuthor] = useMutation(ADD_AUTHOR,{
    refetchQueries: [{ query: GET_AUTHORS }],
  });
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });
  const [deleteAuthor] = useMutation(DELETE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [authorData, setAuthorData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    hometownCity: '',
    hometownState: '',
    numOfBooks: '',
  });
  
  const handleAddClick = () => {
    setFormMode('add');
    setShowModal(true);
  };
  
  const handleEditClick = (authorId) => {
    setFormMode('edit');
    setShowModal(true);
    const selectedAuthor = data.authors.find(author => author._id === authorId);
    if (selectedAuthor) {
      setAuthorData({
        id: selectedAuthor._id,
        firstName: selectedAuthor.first_name,
        lastName: selectedAuthor.last_name,
        dateOfBirth: selectedAuthor.date_of_birth || '', 
        hometownCity: selectedAuthor.hometownCity || '',
        hometownState: selectedAuthor.hometownState || '',
        numOfBooks: selectedAuthor.numOfBooks || '',
      });
    }
  };
  
  const handleDeleteClick = async (authorId) => {
    try {
      await deleteAuthor({ variables: { id: authorId } });
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setAuthorData({
      id: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      hometownCity: '',
      hometownState: '',
      numOfBooks: '',
    });
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!authorData.firstName.trim() || !authorData.lastName.trim()) {
        console.error('First name and last name are required');
        return;
      }
      
      if (formMode === 'add') {
        const { data: { addAuthor: addedAuthor } } = await addAuthor({
          variables: {
            firstName: authorData.firstName,
            lastName: authorData.lastName,
            dateOfBirth: authorData.dateOfBirth,
            hometownCity: authorData.hometownCity,
            hometownState: authorData.hometownState,
            numOfBooks: authorData.numOfBooks,
          },
        });
        
        if (addedAuthor) {
          handleCloseModal();
        } else {
          console.error('Failed to add author');
        }
      } else if (formMode === 'edit') {
        const { data: { editAuthor: editedAuthor } } = await editAuthor({
          variables: {
            id: authorData.id,
            firstName: authorData.firstName,
            lastName: authorData.lastName,
            dateOfBirth: authorData.dateOfBirth,
            hometownCity: authorData.hometownCity,
            hometownState: authorData.hometownState,
            numOfBooks: authorData.numOfBooks,
          },
        });
        
        if (editedAuthor) {
          handleCloseModal();
        } else {
          console.error('Failed to edit author');
        }
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return (
    <div className="authors-container">
      <h1>Authors</h1>
      <button className="add-author-button" onClick={handleAddClick}>
        Add Author
      </button>
      {data.authors.map((author) => (
        <div className="author-card" key={author._id}>
        <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '5px', cursor: 'pointer' }} onClick={() => navigate(`/authors/${author._id}`)}>
        <span>
    Name - {author.first_name} {author.last_name}
  </span>
        <br />
        HomeTown City - {author.hometownCity}
        <br />
        Number of Books - {author.numOfBooks} books
      </p>
          <div className="author-buttons">
            <button className="edit-button" onClick={() => handleEditClick(author._id)}>
              Edit
            </button>
            <button className="delete-button" onClick={() => handleDeleteClick(author._id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
      {showModal && (
        <div className={`modal ${showModal ? 'active' : ''}`}>
          <button className="close-button" onClick={handleCloseModal}>
            Close
          </button>
          <h2>{formMode === 'add' ? 'Add' : 'Edit'} Author</h2>
          <form onSubmit={handleFormSubmit}>
            <label>
              First Name:
              <input
                type="text"
                value={authorData.firstName}
                onChange={(e) => setAuthorData({ ...authorData, firstName: e.target.value })}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={authorData.lastName}
                onChange={(e) => setAuthorData({ ...authorData, lastName: e.target.value })}
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="text"
                value={authorData.dateOfBirth}
                onChange={(e) => setAuthorData({ ...authorData, dateOfBirth: e.target.value })}
              />
            </label>
            <label>
              Hometown City:
              <input
                type="text"
                value={authorData.hometownCity}
                onChange={(e) => setAuthorData({ ...authorData, hometownCity: e.target.value })}
              />
            </label>
            <label>
              Hometown State:
              <input
                type="text"
                value={authorData.hometownState}
                onChange={(e) => setAuthorData({ ...authorData, hometownState: e.target.value })}
              />
            </label>
            <button type="submit">{formMode === 'add' ? 'Add' : 'Save'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authors;
