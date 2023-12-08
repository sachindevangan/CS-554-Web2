import { gql } from '@apollo/client';

const GET_AUTHORS = gql`
query GetAuthors {
  authors {
    _id
    first_name
    last_name
    date_of_birth
    hometownCity
    hometownState
    numOfBooks
    books {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
    }
  }
}
`;

const GET_AUTHOR_BY_ID = gql`
  query GetAuthorById($id: String!) {
    getAuthorById(_id: $id) {
      _id
      first_name
      last_name
      date_of_birth
      hometownCity
      hometownState
      numOfBooks
      books {
        _id
        title
        genres
        publicationDate
        publisher
        summary
        isbn
        language
        pageCount
        price
        format
      }
    }
  }
`;

const ADD_AUTHOR = gql`
mutation AddAuthor($firstName: String!, $lastName: String!, $dateOfBirth: String!, $hometownCity: String!, $hometownState: String!) {
  addAuthor(first_name: $firstName, last_name: $lastName, date_of_birth: $dateOfBirth, hometownCity: $hometownCity, hometownState: $hometownState) {
    _id
    first_name
    last_name
    date_of_birth
    hometownCity
    hometownState
    numOfBooks
  }
}
`;

const EDIT_AUTHOR = gql`
mutation EditAuthor($id: String!, $firstName: String, $lastName: String, $dateOfBirth: String, $hometownCity: String, $hometownState: String) {
  editAuthor(_id: $id, first_name: $firstName, last_name: $lastName, date_of_birth: $dateOfBirth, hometownCity: $hometownCity, hometownState: $hometownState) {
    _id
    first_name
    last_name
    date_of_birth
    hometownCity
    hometownState
    numOfBooks
  }
}
`;

const DELETE_AUTHOR = gql`
mutation RemoveAuthor($id: String!) {
  removeAuthor(_id: $id) {
    _id
    first_name
    last_name
    date_of_birth
    hometownCity
    hometownState
    numOfBooks
  }
}
`;



const GET_BOOKS = gql`
  query GetBooks {
    books {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
      }
    }
  }
`;

const GET_BOOK_BY_ID = gql`
  query GetBookById($id: String!) {
    getBookById(_id: $id) {
      _id
      title
      genres
      publicationDate
      publisher
      summary
      isbn
      language
      pageCount
      price
      format
      author {
        _id
        first_name
        last_name
      }
    }
  }
`;

const ADD_BOOK = gql`
mutation AddBook($title: String!, $genres: [String!]!, $publicationDate: String!, $publisher: String!, $summary: String!, $isbn: String!, $language: String!, $pageCount: Int!, $price: Float!, $format: [String!]!, $authorId: String!) {
  addBook(title: $title, genres: $genres, publicationDate: $publicationDate, publisher: $publisher, summary: $summary, isbn: $isbn, language: $language, pageCount: $pageCount, price: $price, format: $format, authorId: $authorId) {
    _id
    title
    genres
    publicationDate
    publisher
    summary
    isbn
    language
    pageCount
    price
    format
  }
}
`;

const EDIT_BOOK = gql`
 mutation EditBook($id: String!, $title: String, $genres: [String], $publicationDate: String, $publisher: String, $summary: String, $isbn: String, $language: String, $pageCount: Int, $price: Float, $format: [String], $authorId: String) {
  editBook(_id: $id, title: $title, genres: $genres, publicationDate: $publicationDate, publisher: $publisher, summary: $summary, isbn: $isbn, language: $language, pageCount: $pageCount, price: $price, format: $format, authorId: $authorId) {
    _id
    title
    genres
    publicationDate
    publisher
    summary
    isbn
    language
    pageCount
    price
    format
  }
}
`;

const DELETE_BOOK = gql`
mutation RemoveBook($id: String!) {
  removeBook(_id: $id) {
    _id
    title
    genres
    publicationDate
    publisher
    isbn
    summary
    language
    pageCount
    price
    format
  }
}
`;

const SEARCH = gql`
  query Search($type: String!, $query: String!, $minPrice: Float, $maxPrice: Float) {
    search(type: $type, query: $query, minPrice: $minPrice, maxPrice: $maxPrice) {
      _id
      title
      genre
      price
      author {
        _id
        firstName
        lastName
      }
    }
  }
`;

const BOOKS_BY_GENRE = gql`
query BooksByGenre($genre: String!) {
  booksByGenre(genre: $genre) {
    _id
    title
    genres
    publicationDate
    publisher
    summary
    isbn
    language
    pageCount
    price
    format
  }
}
`;

const  BOOKS_BY_PRICE_RANGE = gql`
query BooksByPriceRange($min: Float!, $max: Float!) {
  booksByPriceRange(min: $min, max: $max) {
    _id
    title
    genres
    publicationDate
    publisher
    summary
    isbn
    language
    pageCount
    price
    format
  }
}
`;

const  SEARCH_AUTHORS_BY_NAME = gql`
query SearchAuthorsByName($searchTerm: String!) {
  searchAuthorsByName(searchTerm: $searchTerm) {
    _id
    first_name
    last_name
    date_of_birth
    hometownCity
    hometownState
    numOfBooks
  }
}
`;

export {GET_AUTHORS,GET_AUTHOR_BY_ID,ADD_AUTHOR,EDIT_AUTHOR,SEARCH,DELETE_BOOK,EDIT_BOOK,ADD_BOOK,GET_BOOK_BY_ID, GET_BOOKS,DELETE_AUTHOR,BOOKS_BY_GENRE,BOOKS_BY_PRICE_RANGE,SEARCH_AUTHORS_BY_NAME}