import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubCollection, deleteSubCollection, selectSubCollection, giveUpComic } from '../actions';
import { Link } from 'react-router-dom';
import './component.css';
import { Button } from '@mui/material';

const SubCollection = () => {
  const dispatch = useDispatch();
  const [newSubCollectionName, setNewSubCollectionName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const subCollections = useSelector((state) => state.subCollections.subCollections);
  const selectedSubCollectionId = useSelector((state) => state.subCollections.selectedSubCollectionId);

  const handleAddSubCollection = () => {
    if (newSubCollectionName.trim() === '') {
      console.log('Please enter a name for the sub-collection.');
      return;
    }


    const newSubCollection = {
      name: newSubCollectionName,
      collection: [],
    };
    dispatch(addSubCollection(newSubCollection));
    setNewSubCollectionName('');
    setErrorMessage('');
  };

  const handleDeleteSubCollection = (subCollectionId) => {
    if (subCollectionId === selectedSubCollectionId) {
      console.log('Cannot delete the currently selected sub-collection.');
      return;
    }
    dispatch(deleteSubCollection(subCollectionId));
  };

  const handleSelectSubCollection = (subCollectionId) => {
    console.log('Selected sub-collection ID (before dispatch):', subCollectionId);
    dispatch(selectSubCollection(subCollectionId));
  };

  const handleGiveUp = (comicId) => {
    if (!selectedSubCollectionId) {
      console.log('Please select a sub-collection before giving up comics.');
      return;
    }
    dispatch(giveUpComic(comicId, selectedSubCollectionId));
  };

  return (
    <div>
      <h2>Collections</h2>
      <div>
        <label>New Sub-Collection Name:</label>
        <input
          type="text"
          value={newSubCollectionName}
          onChange={(e) => setNewSubCollectionName(e.target.value)}
        />
        <button onClick={handleAddSubCollection}>Add Sub-Collection</button>
      </div>
      <h3>Current Sub-Collections:</h3>
      <div>
        <ul>
          {subCollections.map((subCollection, index) => (
            <li key={subCollection.id || index} className={subCollection.id === selectedSubCollectionId ? 'selected' : ''}>
              <span>{subCollection.name}</span>
              <button onClick={() => handleDeleteSubCollection(subCollection.id)}>Delete</button>
              <button onClick={() => handleSelectSubCollection(subCollection.id)}>
                {subCollection.id === selectedSubCollectionId ? 'Selected' : 'Select'}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="comics-list">
  <h3>Sub-Collection Comics:</h3>
  <ul>
    {selectedSubCollectionId &&
      subCollections
        .find((subCollection) => subCollection.id === selectedSubCollectionId)
        ?.collection?.map((comicId) => (
          <li key={comicId}>
            <Link to={`/marvel-comics/${comicId.id}`} className="comic-link">
              {comicId.id} 
            </Link>
            <div>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleGiveUp(comicId.id)}
                    className="give-up-btn"
                  >
                    Give Up
                  </Button>
            </div>
          </li>
        ))}
  </ul>
</div>

      {errorMessage && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>
      )}
    </div>
  );
};

export default SubCollection;
