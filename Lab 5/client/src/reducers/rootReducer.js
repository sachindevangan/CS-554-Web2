import { combineReducers } from '@reduxjs/toolkit';
import comicsReducer from './comicsReducer';
import singleComicReducer from './singleComicReducer';
import subCollectionsReducer from './subCollectionsReducer';

const rootReducer = combineReducers({
  comics: comicsReducer,
  singleComic: singleComicReducer,
  subCollections: subCollectionsReducer,
});

export default rootReducer;
