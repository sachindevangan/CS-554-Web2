const initialState = {
    singleComic: null, 
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
  