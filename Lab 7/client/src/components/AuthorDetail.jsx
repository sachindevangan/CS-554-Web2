import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useNavigate,Link } from 'react-router-dom';
import { GET_AUTHOR_BY_ID, EDIT_AUTHOR, DELETE_AUTHOR, GET_AUTHORS } from '../queries.js';
import './component.css'


const AuthorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_AUTHOR_BY_ID, {
    variables: { id },
  });

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  const [deleteAuthor] = useMutation(DELETE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  const [showModal, setShowModal] = useState(false);
  const [authorData, setAuthorData] = useState({
    _id: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    hometownCity: '',
    hometownState: '',
    numOfBooks: 0,
    books: {
      title: '',
    },
  });

  useEffect(() => {
    if (data && data.getAuthorById) {
      setAuthorData(data.getAuthorById);
    }
  }, [data]);

  const handleEditAuthor = () => {
    setShowModal(true);
    if (data && data.getAuthorById) {
      setAuthorData({
        _id: data.getAuthorById._id,
        first_name: data.getAuthorById.first_name,
        last_name: data.getAuthorById.last_name,
        date_of_birth: data.getAuthorById.date_of_birth,
        hometownCity: data.getAuthorById.hometownCity,
        hometownState: data.getAuthorById.hometownState,
        numOfBooks: data.getAuthorById.numOfBooks,
        books: data.getAuthorById.books,
      });
    }
  };

  const handleDeleteAuthor = async () => {
    try {
      await deleteAuthor({ variables: { id } });
      navigate('/authors');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const { _id, first_name, last_name, date_of_birth, hometownCity, hometownState, numOfBooks } = authorData;
  
      const { data: { editAuthor: editedAuthor } } = await editAuthor({
        variables: {
          id: _id,
          firstName: first_name,
          lastName: last_name,
          dateOfBirth: date_of_birth,
          hometownCity,
          hometownState,
          numOfBooks,
        },
      });
  
      if (editedAuthor) {
        handleCloseModal();
      } else {
        console.error('Failed to edit author');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="authors-container">
      <h1 style={{ fontSize: '2em', color: '#333', marginBottom: '10px' }}>
      {`${authorData.first_name} ${authorData.last_name}`}
    </h1>
    <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '5px' }}>
      {`Date of Birth: ${authorData.date_of_birth}`}
    </p>
    <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '5px' }}>
      {`HomeTown City: ${authorData.hometownCity}`}
    </p>
    <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '5px' }}>
      {`HomeTown State: ${authorData.hometownState}`}
    </p>
    <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '5px' }}>
      {`Number of Books: ${authorData.numOfBooks}`}
    </p>
      <h2>Books</h2>
      <ul className="books-list">
  {Object.values(authorData.books).slice(0, 3).map((book) => (
    <li className="book-item" key={book._id}>
      <Link to={`/books/${book._id}`}>
        {book.title}
      </Link>
    </li>
  ))}
</ul>
      <button className="edit-button" onClick={handleEditAuthor}>Edit Author</button>
      <button className="delete-button" onClick={handleDeleteAuthor}>Delete Author</button>

      {showModal && (
        <div className="modal active">
          <button className="close-button" onClick={handleCloseModal}>Close</button>
          <h2>Edit Author</h2>
          <form onSubmit={handleFormSubmit}>
          <label>
              First Name:
              <input
                type="text"
                value={authorData.first_name}
                onChange={(e) => setAuthorData({ ...authorData, first_name: e.target.value })}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={authorData.last_name}
                onChange={(e) => setAuthorData({ ...authorData, last_name: e.target.value })}
              />
            </label>
            <label>
              Date of Birth:
              <input
                type="text"
                value={authorData.date_of_birth}
                onChange={(e) => setAuthorData({ ...authorData, date_of_birth: e.target.value })}
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

            <button type="submit">Save</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthorDetails;
