// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addSubCollection, deleteSubCollection, selectSubCollection, giveUpComic } from '../actions';
// import { Link } from 'react-router-dom';
// import './component.css'

// const SubCollection = () => {
//     const dispatch = useDispatch();
//     const [newSubCollectionName, setNewSubCollectionName] = useState('');
  
//     const subCollections = useSelector((state) => state.subCollections.subCollections);
//     const selectedSubCollectionId = useSelector((state) => state.subCollections.selectedSubCollectionId);
  
// const handleAddSubCollection = () => {
//   if (newSubCollectionName.trim() === '') {
//     console.log('Please enter a name for the sub-collection.');
//     return;
//   }

//   // Check if the subcollection name already exists
//   const subCollectionExists = subCollections.some(
//     (subCollection) => subCollection.name.toLowerCase() === newSubCollectionName.toLowerCase()
//   );

//   if (subCollectionExists) {
//     console.log('Sub-collection with this name already exists. Please choose a unique name.');
//     return;
//   }
  
//   const newSubCollection = {
//     name: newSubCollectionName,
//     collection: [],
//   };
//   dispatch(addSubCollection(newSubCollection));
//   setNewSubCollectionName('');
// };

  
//     const handleDeleteSubCollection = (subCollectionId) => {
//       if (subCollectionId === selectedSubCollectionId) {
//         console.log('Cannot delete the currently selected sub-collection.');
//         return;
//       }
//       dispatch(deleteSubCollection(subCollectionId));
//     };
  
//     const handleSelectSubCollection = (subCollectionId) => {
//       console.log('Selected sub-collection ID (before dispatch):', subCollectionId);
//       dispatch(selectSubCollection(subCollectionId));
//     };

//     const handleGiveUp = (comicId) => {
//       if (!selectedSubCollectionId) {
//         console.log('Please select a sub-collection before giving up comics.');
//         return;
//       }
//       dispatch(giveUpComic(comicId, selectedSubCollectionId));
//     };
  
//     return (
//       <div>
//         <h2>Collections</h2>
//         <div>
//           <label>New Sub-Collection Name:</label>
//           <input
//             type="text"
//             value={newSubCollectionName}
//             onChange={(e) => setNewSubCollectionName(e.target.value)}
//           />
//           <button onClick={handleAddSubCollection}>Add Sub-Collection</button>
//         </div>
//         <h3>Current Sub-Collections:</h3>
//         <div>
       
//           <ul>
//               {subCollections.map((subCollection, index) => (
//                 <li key={subCollection.id || index} className={subCollection.id === selectedSubCollectionId ? 'selected' : ''}>
//                   <span>{subCollection.name}</span>
//                   <button onClick={() => handleDeleteSubCollection(subCollection.id)}>Delete</button>
//                   <button onClick={() => handleSelectSubCollection(subCollection.id)}>
//                     {subCollection.id === selectedSubCollectionId ? 'Selected' : 'Select'}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//         </div>

// <div>
 
//   <div>
//   <h3>Sub-Collection Comics:</h3>
//   <ul>
  
//   {selectedSubCollectionId &&
//     subCollections
//       .find((subCollection) => subCollection.id === selectedSubCollectionId)
//       ?.collection?.map((comicId) => (
//         <li key={comicId}>
//         <Link to={`/marvel-comics/${comicId.id}`}>{comicId.id}</Link>
//           <div>
//             <button onClick={() => handleGiveUp(comicId.id)}>Give Up</button>
//           </div>
//         </li>
//       ))}
// </ul>
// </div>

// </div>

//       </div>
//     );
//   };
  
//   export default SubCollection;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSubCollection, deleteSubCollection, selectSubCollection, giveUpComic } from '../actions';
import { Link } from 'react-router-dom';
import './component.css';

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

    const subCollectionExists = subCollections.some(
      (subCollection) => subCollection.name.toLowerCase() === newSubCollectionName.toLowerCase()
    );

    if (subCollectionExists) {
      setErrorMessage('Sub-collection with this name already exists. Please choose a unique name.');
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
      <div>
        <h3>Sub-Collection Comics:</h3>
        <ul>
          {selectedSubCollectionId &&
            subCollections
              .find((subCollection) => subCollection.id === selectedSubCollectionId)
              ?.collection?.map((comicId) => (
                <li key={comicId}>
                  <Link to={`/marvel-comics/${comicId.id}`}>{comicId.id}</Link>
                  <div>
                    <button onClick={() => handleGiveUp(comicId.id)}>Give Up</button>
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