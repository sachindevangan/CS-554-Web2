import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_BOOKS,
  ADD_BOOK,
  EDIT_BOOK,
  DELETE_BOOK,
} from '../queries'; 
import { useNavigate } from 'react-router-dom';

import './Books.css'

const Books = () => {
  const navigate = useNavigate();

 
  const { loading, error, data } = useQuery(GET_BOOKS);


  const [addBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [editBook] = useMutation(EDIT_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [removeBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });


  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('add');
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
  });

  const handleCloseModal = () => {
    setShowModal(false);
    console.log('Modal closed');

    console.log('Show modal:', showModal);
    setBookData({
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
    });
  };
  

  const handleEditClick = (bookId) => {

    setFormMode('edit');
    setShowModal(true);
    console.log('Edit button clicked');

    console.log('Show modal:', showModal);

    const selectedBook = data.books.find((book) => book._id === bookId);
 
    if(selectedBook){

      const authorId = selectedBook.author ? selectedBook.author._id : '';


    setBookData({
      id: selectedBook._id,
      title: selectedBook.title,
      genres: selectedBook.genres,
      publicationDate: selectedBook.publicationDate,
      publisher: selectedBook.publisher,
      summary: selectedBook.summary,
      isbn: selectedBook.isbn,
      language: selectedBook.language,
      pageCount: selectedBook.pageCount,
      price: selectedBook.price,
      format: selectedBook.format,
      authorId: authorId,
    });
  }

   
  };

  const handleDeleteClick = async (bookId) => {
    try {
      await removeBook({ variables: { id: bookId } });
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("bookData", bookData)
      if (!bookData.title.trim() || !bookData.genres.length || !bookData.publicationDate.trim() || !bookData.publisher.trim() || !bookData.summary.trim() || !bookData.isbn.trim() || !bookData.language.trim() || bookData.pageCount <= 0 || bookData.price <= 0 || !bookData.format.length || !bookData.authorId.trim()) {
        console.error('Please fill in all the required fields.');
        return;
      }
  
      if (formMode === 'add') {
        const { data: { addBook: addedBook } } = await addBook({
          variables: {
            title: bookData.title,
            genres: bookData.genres,
            publicationDate: bookData.publicationDate,
            publisher: bookData.publisher,
            summary: bookData.summary,
            isbn: bookData.isbn,
            language: bookData.language,
            pageCount: bookData.pageCount,
            price: bookData.price,
            format: bookData.format,
            authorId: bookData.authorId,
          },
        });
  
        if (addedBook) {
          handleCloseModal();
        } else {
          console.error('Failed to add book');
        }
      } else if (formMode === 'edit') {
        const { data: { editBook: editedBook } } = await editBook({
          variables: {
            id: bookData.id,
            title: bookData.title,
            genres: bookData.genres,
            publicationDate: bookData.publicationDate,
            publisher: bookData.publisher,
            summary: bookData.summary,
            isbn: bookData.isbn,
            language: bookData.language,
            pageCount: bookData.pageCount,
            price: bookData.price,
            format: bookData.format,
            authorId: bookData.authorId,
          },
        });
  
        if (editedBook) {
          handleCloseModal();
        } else {
          console.error('Failed to edit book');
        }
      }
      console.log('Form submitted');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  


  const handleAddBookClick = () => {

    setBookData({
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
    });
    setFormMode('add');
    setShowModal(true);
    console.log('Add Book button clicked');

    console.log('Show modal:', showModal);
  };


  const handleBookDetailsClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="books-container">
      <h1>Books</h1>
      <button className = "add-book-button" onClick={handleAddBookClick}>
      Add Book</button>
      {data.books.map((book) => (
     <div className="book-card" key={book._id}>
     <p className="book-info" style={{ fontSize: '1.2em', color: '#555', marginBottom: '5px' }}>
      <span 
        onClick={() => handleBookDetailsClick(book._id)}
        style={{ cursor: 'pointer' }}
      >
        Title: {book.title}
      </span>
      <br />
      Genre: {book.genres.join(', ')}
      <br />
      Price: ${book.price}
    </p>
    <div className="action-buttons">
      <button className="edit-button" onClick={() => handleEditClick(book._id)}>
        Edit
      </button>
      <button className="delete-button" onClick={() => handleDeleteClick(book._id)}>
        Delete
      </button>
    </div>
  </div>
))}
      {showModal && (
        <div className={`modal ${showModal ? 'active' : ''}`}>
    <button className="close-button" onClick={handleCloseModal}>Close</button>
    <h2>{formMode === 'add' ? 'Add' : 'Edit'} Book</h2>
    <form onSubmit={handleFormSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={bookData.title}
          onChange={(e) => setBookData({ ...bookData, title: e.target.value })}
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
          onChange={(e) => setBookData({ ...bookData, publicationDate: e.target.value })}
        />
      </label>
      <label>
        Publisher:
        <input
          type="text"
          value={bookData.publisher}
          onChange={(e) => setBookData({ ...bookData, publisher: e.target.value })}
        />
      </label>
      <label>
        Summary:
        <input
          type="text"
          value={bookData.summary}
          onChange={(e) => setBookData({ ...bookData, summary: e.target.value })}
        />
      </label>
      <label>
        ISBN:
        <input
          type="text"
          value={bookData.isbn}
          onChange={(e) => setBookData({ ...bookData, isbn: e.target.value })}
        />
      </label>
      <label>
        Language:
        <input
          type="text"
          value={bookData.language}
          onChange={(e) => setBookData({ ...bookData, language: e.target.value })}
        />
      </label>
      <label>
        Page Count:
        <input
          type="number"
          value={bookData.pageCount}
          onChange={(e) => setBookData({ ...bookData, pageCount: parseInt(e.target.value) || 0 })}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          value={bookData.price}
          onChange={(e) => setBookData({ ...bookData, price: parseFloat(e.target.value) || 0 })}
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
          onChange={(e) => setBookData({ ...bookData, authorId: e.target.value })}
        />
      </label>
      <button type="submit">{formMode === 'add' ? 'Add' : 'Save'}</button>
    </form>
  </div>
)}
    </div>
  );
};

export default Books;
