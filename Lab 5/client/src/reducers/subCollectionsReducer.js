const initialState = {
    subCollections: [], 
    selectedSubCollectionId: null 
  };
  


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


        const collectSelectedSubCollection = state.subCollections.find(
          (subCollection) => subCollection.id === state.selectedSubCollectionId
        );


          if (!collectSelectedSubCollection) {
            console.log('No sub-collection selected. Please select a sub-collection first.');
            return state;
      }


      if (collectSelectedSubCollection.collection.every((comic) => comic.id !== collectComicId)) {

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
  