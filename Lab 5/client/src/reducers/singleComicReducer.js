// singleComicReducer.js
const initialState = {
    singleComic: null, // Object to store details of a single comic
  };
  
  const singleComicReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_SINGLE_COMIC':
        return {
          ...state,
          singleComic: action.payload.singleComic,
        };
      default:
        return state;
    }
  };
  
  export default singleComicReducer;
  