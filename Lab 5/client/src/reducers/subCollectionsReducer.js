// subCollectionsReducer.js
import {v4 as uuid} from 'uuid';

const initialState = {
    subCollections: [], // Array to store created sub-collections
    selectedSubCollectionId: null // Id of the currently selected sub-collection
  };
  
  // const subCollectionsReducer = (state = initialState, action) => {
  //   switch (action.type) {
  //     case 'ADD_SUBCOLLECTION':
  //       return {
  //         ...state,
  //         subCollections: [...state.subCollections, action.payload.subCollection],
  //       };

  const subCollectionsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_SUBCOLLECTION':
        return {
          ...state,
          subCollections: [...state.subCollections, action.payload.subCollection],
        };
      case 'DELETE_SUBCOLLECTION':
        return {
          ...state,
          subCollections: state.subCollections.filter(
            (subCollection) => subCollection.id !== action.payload.subCollectionId
          ),
        };
      case 'SELECT_SUBCOLLECTION':
        console.log('Selected sub-collection ID:', action.payload.selectedSubCollectionId);
        return {
          ...state,
          selectedSubCollectionId: action.payload.selectedSubCollectionId,
        };
      
        case 'COLLECT_COMIC':
          const { comicId: collectComicId, subCollectionId: collectSubCollectionId } = action.payload;
        
          // Find the selected sub-collection
          const collectSelectedSubCollection = state.subCollections.find(
            (subCollection) => subCollection.id === state.selectedSubCollectionId
          );

          // Check if a sub-collection is selected
            if (!collectSelectedSubCollection) {
              console.log('No sub-collection selected. Please select a sub-collection first.');
              return state;
  }

        
          // Check if the comic is not already in the collection
          if (collectSelectedSubCollection.collection.every((comic) => comic.id !== collectComicId)) {
            // Check if the collection is not full
            if (collectSelectedSubCollection.collection.length < 20) {
              return {
                ...state,
                subCollections: state.subCollections.map((subCollection) =>
                  subCollection.id === collectSubCollectionId
                    ? {
                        ...subCollection,
                        collection: [...subCollection.collection, { id: collectComicId }],
                      }
                    : subCollection
                ),
              };
            } else {
              console.log('Collection is full. Give up a comic to add a new one.');
              return state;
            }
          } else {
            console.log('Comic is already in the collection.');
            return state;
          }
        

// case 'GIVE_UP_COMIC':
//   const { comicId: giveUpComicId, subCollectionId: giveUpSubCollectionId } = action.payload;

//   console.log('Action Type: GIVE_UP_COMIC');
//     console.log('Payload:', action.payload);

//     // Log the values for debugging
//     console.log('giveUpComicId:', giveUpComicId);
//     console.log('Before update:', state.subCollections);

//   // Find the selected sub-collection
//   const giveUpSelectedSubCollection = state.subCollections.find((subCollection) => subCollection.id === giveUpSubCollectionId);

//   if (!giveUpSelectedSubCollection) {
//     // If the selected sub-collection is not found, return the current state
//     console.log('Selected sub-collection not found.');
//     return state;
//   }

  
//   // Log the selected sub-collection and its collection for debugging
//   console.log('Selected sub-collection:', giveUpSelectedSubCollection);

//   // Check if the comic is in the selected sub-collection's collection
//   // const isComicInCollection = giveUpSelectedSubCollection.collection.includes(giveUpComicId);


//  // Log the type of giveUpComicId and the type of the ID in the collection
//  console.log('Type of giveUpComicId:', typeof giveUpComicId);
//  console.log('Type of collection IDs:', typeof giveUpSelectedSubCollection.collection[0]?.id);


//   const isComicInCollection = giveUpSelectedSubCollection.collection.some((id) => id == giveUpComicId);
//   console.log('Collection IDs:', giveUpSelectedSubCollection.collection);


//   console.log('Is comic in collection?', isComicInCollection);

//   if (isComicInCollection) {
//     // If the comic is in the collection, remove it
//     const updatedCollection = giveUpSelectedSubCollection.collection.filter((id) => id !== giveUpComicId);

//      // Log the updated collection for debugging
//      console.log('Updated collection:', updatedCollection);

//     // Create a new array of sub-collections with the updated collection for the selected sub-collection
//     const updatedSubCollections = state.subCollections.map((subCollection) =>
//       subCollection.id === giveUpSubCollectionId
//         ? { ...subCollection, collection: updatedCollection }
//         : subCollection
//     );

//     // Log the updated state for debugging
//     console.log('After update:', updatedSubCollections);

//     // Return the updated state with the modified sub-collections
//     return {
//       ...state,
//       subCollections: updatedSubCollections,
//     };
//   } else {
//     // If the comic is not in the collection, return the current state

//     // If the comic is not in the collection, return the current state
//     console.log('Comic not in collection.');
//     return state;
//   }


case 'GIVE_UP_COMIC':
  const { comicId } = action.payload;

  return {
    ...state,
    subCollections: state.subCollections.map(subCollection =>
      subCollection.id === state.selectedSubCollectionId
        ? {
            ...subCollection,
            collection: subCollection.collection.filter(comic => comic.id !== comicId),
          }
        : subCollection
    ),
  };


      default:
        return state;
    }
  };
  
  export default subCollectionsReducer;
  