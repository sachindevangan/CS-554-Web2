import { gql } from '@apollo/client';

// Fetch paginated list of comics
const GET_COMICS_PAGE = gql`
  query GetComicsPage($pageNum: Int!) {
    comicsPage(pageNum: $pageNum) {
        id
        title
        description
        issueNumber
        variantDescription
        pageCount
        modified
        resourceURI
    }
  }
`;

// Fetch details of a single comic
const GET_COMIC_DETAILS = gql`
  query GetComicDetails($id: ID!) {
    comic(id: $id) {
        id
        title
        description
        issueNumber
        variantDescription
        pageCount
        modified
        resourceURI
    }
  }
`;

// Fetch user's sub-collections and their comic collections
const GET_USER_COLLECTIONS = gql`
  query GetUserCollections {
    userCollections {
      id
      name
      selected
      comics {
        id
      title
      description
      issueNumber
      variantDescription
      pageCount
      modified
      resourceURI
      }
    }
  }
`;

// Add a new sub-collection
const ADD_SUB_COLLECTION = gql`
  mutation AddSubCollection($name: String!) {
    addSubCollection(name: $name) {
      id
      name
    }
  }
`;

// Select a sub-collection
const SELECT_SUB_COLLECTION = gql`
  mutation SelectSubCollection($subCollectionId: ID!) {
    selectSubCollection(subCollectionId: $subCollectionId) {
      success
      message
    }
  }
`;

// Add a comic to the selected sub-collection
const ADD_COMIC_TO_COLLECTION = gql`
  mutation AddComicToCollection($comicId: ID!) {
    addComicToCollection(comicId: $comicId) {
      success
      message
    }
  }
`;


export {
  GET_COMICS_PAGE,
  GET_COMIC_DETAILS,
  GET_USER_COLLECTIONS,
  ADD_SUB_COLLECTION,
  SELECT_SUB_COLLECTION,
  ADD_COMIC_TO_COLLECTION
};
