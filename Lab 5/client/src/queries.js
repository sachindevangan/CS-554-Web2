import { gql } from '@apollo/client';

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

const SEARCH_COMICS = gql`
  query SearchComics($searchTerm: String!, $pageNum: Int!) {
    searchComics(searchTerm: $searchTerm, pageNum: $pageNum) {
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
      isbn
      upc
      diamondCode
      ean
      issn
      format
      dates {
        type
        date
      }
      prices {
        type
        price
      }
      thumbnail {
        path
        extension
      }
      creators {
        available
        returned
        collectionURI
        items {
          resourceURI
          name
          role
        }
      }
      characters {
        available
        returned
        collectionURI
        items {
          resourceURI
          name
          role
        }
      }
      stories {
        available
        returned
        collectionURI
        items {
          resourceURI
          name
          type
        }
      }
      events {
        available
        returned
        collectionURI
        items {
          resourceURI
          name
        }
      }
    }
  }
`;

export {
  GET_COMICS_PAGE, GET_COMIC_DETAILS,SEARCH_COMICS};
