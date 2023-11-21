// comicsReducer.js
const initialState = {
    comics: [], // Array to store paginated list of comics
    currentPage: 1,
    hasNextPage: true, // Whether there is a next page
    hasPrevPage: false, // Whether there is a previous page
    selectedSubCollectionId: null, // Id of the currently selected sub-collection
  };
  
  const comicsReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_COMICS':
        return {
          ...state,
          comics: action.payload.comics,
          currentPage: action.payload.currentPage,
          hasNextPage: action.payload.hasNextPage,
          hasPrevPage: action.payload.hasPrevPage,
        };
      case 'SET_SELECTED_SUBCOLLECTION':
        return {
          ...state,
          selectedSubCollectionId: action.payload.selectedSubCollectionId,
        };
      default:
        return state;
    }
  };
  
  export default comicsReducer;
  