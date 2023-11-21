import { v4 as uuid } from 'uuid';

const collectComic = (comicId, subCollectionId) => ({
    type: 'COLLECT_COMIC',
    payload: {
      comicId: comicId,
      subCollectionId: subCollectionId,
    },
  });
  
  const giveUpComic = (comicId, subCollectionId) => ({
    type: 'GIVE_UP_COMIC',
    payload: {
      comicId: comicId,
      subCollectionId: subCollectionId,
    },
  });

  const selectSubCollection = (subCollectionId) => {
    console.log('Action Payload:', { selectedSubCollectionId: subCollectionId });
    return {
       type: 'SELECT_SUBCOLLECTION',
       payload: {
          selectedSubCollectionId: subCollectionId,
       },
    };
 };
 
  
  // const addSubCollection = (subCollection) => ({
  //   type: 'ADD_SUBCOLLECTION',
  //   payload: {
  //     subCollection: subCollection,
  //   },
  // });

  const addSubCollection = (subCollection) => ({
    type: 'ADD_SUBCOLLECTION',
    payload: {
      subCollection: {
        ...subCollection,
        id: uuid(), 
      },
    },
  });
  
  const deleteSubCollection = (subCollectionId) => ({
    type: 'DELETE_SUBCOLLECTION',
    payload: {
      subCollectionId: subCollectionId,
    },
  });
  
  export { collectComic, giveUpComic, selectSubCollection, addSubCollection, deleteSubCollection };
  
  
  