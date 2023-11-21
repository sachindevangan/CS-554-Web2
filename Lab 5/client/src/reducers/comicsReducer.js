const initialState = {
    comics: [], 
    currentPage: 1,
    hasNextPage: true,
    hasPrevPage: false,
    selectedSubCollectionId: null, 
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
  