import React, { useState, useEffect } from 'react';
import './BookDetail.css';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GET_BOOK_BY_ID, EDIT_BOOK, DELETE_BOOK, GET_BOOKS } from '../queries.js';

const BookDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_BOOK_BY_ID, {
    variables: { id },
  });

  const [validationError, setValidationError] = useState('');

  const [editBook] = useMutation(EDIT_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onError: (error) => {
      setValidationError(`Error: ${error.message}`);
    },
  });

  const [removeBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onError: (error) => {
      setValidationError(`Error: ${error.message}`);
    },
  });

  const [showModal, setShowModal] = useState(false);
  const [bookData, setBookData] = useState({
    id: '',
    title: '',
    genres: [],
    publicationDate: '',
    publisher: '',
    summary: '',
    isbn: '',
    language: '',
    pageCount: 0,
    price: 0,
    format: [],
    authorId: '',
    author: {
      first_name: '',
      last_name: '',
    },
  });

  useEffect(() => {
    if (data && data.getBookById) {
      const { _id, title, genres, publicationDate, publisher, summary, isbn, language, pageCount, price, format, author } = data.getBookById;
  
      const authorId = author ? author._id : '';
      const authorFirstName = author ? author.first_name : ''; 
      const authorLastName = author ? author.last_name : ''; 
  
      setBookData({
        id: _id,
        title,
        genres,
        publicationDate,
        publisher,
        summary,
        isbn,
        language,
        pageCount,
        price,
        format,
        authorId,
        author: {
          first_name: authorFirstName,
          last_name: authorLastName,
        },
      });
    }
  }, [data]);
  
  

  const handleCloseModal = () => {
    setShowModal(false);
    setValidationError('');
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
  
    try {
      const { id, title, genres, publicationDate, publisher, summary, isbn, language, pageCount, price, format, authorId } = bookData;
  
      const { data: { editBook: editedBook } } = await editBook({
        variables: {
          id,
          title,
          genres,
          publicationDate,
          publisher,
          summary,
          isbn,
          language,
          pageCount,
          price,
          format,
          authorId,
        },
      });
      
      if (!editedBook) {
        setValidationError('Failed to edit author');
        return;
      }
  
      if (editedBook) {
        setShowModal(false);
      } else {
        console.error('Failed to edit book');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  

  const handleDeleteBook = async () => {
    try {
      await removeBook({ variables: { id } });
      navigate('/books');
    } catch (error) {
      setValidationError(`Error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="book-details">
    <h1 className="book-title">{bookData.title}</h1>
    <div className="book-info">
      <p className="genre">{`Genres: ${bookData.genres.join(', ')}`}</p>
      <p className="publication-date">{`Publication Date: ${bookData.publicationDate}`}</p>
      <p className="publisher">{`Publisher: ${bookData.publisher}`}</p>
      <p className="summary">{`Summary: ${bookData.summary}`}</p>
      <p className="isbn">{`ISBN: ${bookData.isbn}`}</p>
      <p className="language">{`Language: ${bookData.language}`}</p>
      <p className="page-count">{`Page Count: ${bookData.pageCount}`}</p>
      <p className="price">{`Price: $${bookData.price}`}</p>
      <p className="format">{`Format: ${bookData.format.join(', ')}`}</p>
      <div>
  <Link to={`/authors/${bookData.authorId}`} style={{ textDecoration: 'none' }}>
    <p className="authordetails">{`Author of this Book: ${bookData.author.first_name} ${bookData.author.last_name}`}</p>
  </Link>
</div>
    </div>
      <div className="book-actions">
      <div className="center-buttons">
        <button onClick={() => setShowModal(true)} className="edit-button">
          Edit Book
        </button>
        <button onClick={handleDeleteBook} className="delete-button">
          Delete Book
        </button>
        </div>
      </div>

      {showModal && (
  <div className={`modal ${showModal ? 'active' : ''}`}>
    <button className="close-button" onClick={handleCloseModal}>
      Close
    </button>
    <h2>Edit Book</h2>
    <form onSubmit={handleEditBook}>
    {validationError && <p className="error-message">{validationError}</p>}
    <label>
  Title:
  <input
    type="text"
    value={bookData.title}
    onChange={(e) => setBookData((prevData) => ({
      ...prevData,
      title: e.target.value,
    }))}
  />
</label>

<label>
        Genres (comma-separated):
        <input
          type="text"
          value={bookData.genres.join(',')}
          onChange={(e) => setBookData({ ...bookData, genres: e.target.value.split(',') })}
        />
      </label>

<label>
  Publication Date:
  <input
    type="text"
    value={bookData.publicationDate}
    onChange={(e) => setBookData((prevData) => ({
      ...prevData,
      publicationDate: e.target.value,
    }))}
  />
</label>

<label>
  Publisher:
  <input
    type="text"
    value={bookData.publisher}
    onChange={(e) => setBookData((prevData) => ({
      ...prevData,
      publisher: e.target.value,
    }))}
  />
</label>

<label>
  Summary:
  <input
    type="text"
    value={bookData.summary}
    onChange={(e) => setBookData((prevData) => ({
      ...prevData,
      summary: e.target.value,
    }))}
  />
</label>

<label>
  ISBN:
  <input
    type="text"
    value={bookData.isbn}
    onChange={(e) => setBookData((prevData) => ({
      ...prevData,
      isbn: e.target.value,
    }))}
  />
</label>

<label>
  Language:
  <input
    type="text"
    value={bookData.language}
    onChange={(e) => setBookData((prevData) => ({
      ...prevData,
      language: e.target.value,
    }))}
  />
</label>

<label>
  Page Count:
  <input
    type="number"
    value={bookData.pageCount}
    onChange={(e) => setBookData((prevData) => ({
      ...prevData,
      pageCount: parseInt(e.target.value) || 0,
    }))}
  />
</label>

<label>
  Price:
  <input
    type="number"
    value={bookData.price}
    onChange={(e) => setBookData((prevData) => ({
      ...prevData,
      price: parseFloat(e.target.value) || 0,
    }))}
  />
</label>

<label>
        Format (comma-separated):
        <input
          type="text"
          value={bookData.format.join(',')}
          onChange={(e) => setBookData({ ...bookData, format: e.target.value.split(',') })}
        />
      </label>

<label>
  Author ID:
  <input
    type="text"
    value={bookData.authorId}
    onChange={(e) => setBookData((prevData) => ({
      ...prevData,
      authorId: e.target.value,
    }))}
  />
</label>
      <button type="submit">Save</button>
    </form>
  </div>
)}

    </div>
  );
};

export default BookDetails;
