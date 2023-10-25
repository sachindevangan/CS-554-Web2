import {GraphQLError} from 'graphql';
import {
  books as bookCollection,
  authors as authorCollection
} from './config/mongoCollections.js';

import { ObjectId } from 'mongodb';
import { validate } from 'uuid'

import moment from 'moment';


import redis from 'redis';

const client = redis.createClient();

(async () => {
  await client.connect();
})();



import {v4 as uuid} from 'uuid'; //for generating _id's

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
		
*/

export const resolvers = {
  Query: {
    authors:async() => {
      if (!client.isOpen) {
        await client.connect();
      }

        // check if  authors data exist in redis cache if yes then send it from there
      const existCachedAuthors = await client.exists('authors')
      if(existCachedAuthors){
        const cachedAuthors = await client.get('authors')

        return JSON.parse(cachedAuthors);
      }

      // if not cached get it from mongo
      const authors = await authorCollection();
      const allAuthors = await authors.find({}).toArray();
      if(!allAuthors){
        throw new GraphQLError(`Internal Server Error`, {
          extensions: {code: 'INTERNAL_SERVER_ERROR'}
      }); 
    }

    // after getting from mongo store it in redis
    const success  = await client.set('authors', JSON.stringify(allAuthors));

    //expire the redis cache after one hour
    const expireCache = await client.expire('authors', 3600);

    return allAuthors;
  },
  books: async() => {

      // check if books data exist in cache if yes then send it from there
      const existCachedBooks = await client.exists('books')
      if(existCachedBooks){
        const cachedBooks = await client.get('books')

        return JSON.parse(cachedBooks);
      }

    // if not cached get it from mongo
    const books = await bookCollection();
    const allBooks = await books.find({}).toArray();
    if(!allBooks){
      throw new GraphQLError(`Internal Server Error`, {
        extensions: {code: 'INTERNAL_SERVER_ERROR'}
    });
  }
   // after getting from mongo store it in redis
   const success  = await client.set('books', JSON.stringify(allBooks));

   const expireCache = await client.expire('books', 3600);

    return allBooks;
},
getAuthorById: async (_, args) => {  
  // trim the id 
  const trimmedId = args._id.trim();

  // validating the trimmed id for empty strings
  if (!trimmedId) {
    throw new GraphQLError('Author ID cannot be empty or contain only spaces', {
      extensions: { code: 'BAD_REQUEST' ,statusCode: 400}
    });
  }

  // check if it's present in the cache if yes then send it from here
  const existAuthor = await client.exists(`author:${trimmedId}`);
  if (existAuthor) {
    const cachedAuthor = await client.get(`author:${trimmedId}`);
    return JSON.parse(cachedAuthor);
  }

  // if not cached, return from MongoDB
  const authors = await authorCollection();
  const author = await authors.findOne({ _id: trimmedId });

  if (!author) {
    throw new GraphQLError('Author Not Found', {
      extensions: { code: 'NOT_FOUND', statusCode: 404 }
    });
  }

  // Store the author in Redis with no expiration time
  const success = await client.set(`author:${trimmedId}`, JSON.stringify(author));

  return author;
},
getBookById: async (_, args) => {
  // trim the id
  const trimmedId = args._id.trim();

  // validating the trimmed id for empty strings
  if (!trimmedId) {
    throw new GraphQLError('Book ID cannot be empty or contain only spaces', {
      extensions: { code: 'BAD_REQUEST'  ,statusCode: 400}
    });
  }

  // check if it's present in the cache if yes then send it from here
  const existBook = await client.exists(`book:${trimmedId}`);
  if (existBook) {
    const cachedBook = await client.get(`book:${trimmedId}`);
    return JSON.parse(cachedBook);
  }

  // if not cached, return from MongoDB
  const books = await bookCollection();
  const book = await books.findOne({ _id: trimmedId });

  if (!book) {
    throw new GraphQLError('Book Not Found', {
      extensions: { code: 'NOT_FOUND',statusCode: 404 }
    });
  }

  // Store the book in Redis with no expiration time
  const success = await client.set(`book:${trimmedId}`, JSON.stringify(book));

  return book;
},
    booksByGenre: async (_, { genre }) => {
      // trim the grenre
        if (!genre.trim()) {
          throw new GraphQLError('Genre cannot be empty',  {
            extensions: {code: 'INVALID',statusCode: 400}
          });
        }

        // genre to lowercase as per redis lecture
        const lowerGenre = genre.toLowerCase().trim();

      
        const books = await bookCollection()
        const allBooks = await books.find({}).toArray();

        // Filter books by genre
        const similarGenre = allBooks.filter(book =>
          book.genres.map(genre => genre.toLowerCase()).includes(lowerGenre)
        );

        // Store the matching books in Redis with a one-hour expiration time
        const success = await client.set(`genre:${lowerGenre}`, JSON.stringify(similarGenre));

        // expire the cache after one hour
        const expireCache = await client.expire(`genre:${lowerGenre}`, 3600);

        return similarGenre;
      },
      booksByPriceRange: async (_, { min, max }) => {

          // checking if the inputs satisfy the given condition
          if (typeof min !== 'number' || typeof max !== 'number' || min < 0 || max <= min) {
            throw new GraphQLError('Invalid price range',  {
              extensions :{code: 'INVALID',statusCode: 400}
            });
          }

          // check if its present in cache if yes then send it from here , also converting min and max to string
          const existCachedBooks = await client.exists(`price:${min.toString()}-${max.toString()}`);
          if (existCachedBooks) {
            const cachedBooks = await client.get(`price:${min.toString()}-${max.toString()}`);
            return JSON.parse(cachedBooks);
          }
  
          const books = await bookCollection()
      
         //using find and the gte and lte to get the range 
          const filterBooks = await books.find({price: { $gte: min, $lte: max }}).toArray();
          
          // store the min-max price range into the redis cache
          const success = await client.set(`price:${min.toString()}-${max.toString()}`, JSON.stringify(filterBooks));

        //one hour expire time
          const expireCache = await client.expire(`price:${min.toString()}-${max.toString()}`,3600); 
        
          return filterBooks;
        },
        searchAuthorsByName: async (_, { searchTerm }) => {
          // trimming the input as always
          if (!searchTerm.trim()) {
              throw new GraphQLError('SearchTerm cannot be empty', {
                  extensions: { code: 'INVALID',statusCode: 400 }
              });
          }
      
          // Lowercase the searchTerm and trim
          const lowercaseSearchTerm = searchTerm.toLowerCase().trim();
      
          // Check if search term exists in cache; if yes, send it from the cache
          const existCachedResults = await client.exists(`search:${lowercaseSearchTerm}`);
      
          if (existCachedResults) {
              const cachedResults = await client.get(`search:${lowercaseSearchTerm}`);
              return JSON.parse(cachedResults);
          }
      
          // If not cached, search in MongoDB and store results in Redis
          const authors = await authorCollection();
          const allAuthors = await authors.find().toArray();
          const matchingAuthors = allAuthors.filter(author =>
              author.first_name.toLowerCase().includes(lowercaseSearchTerm) ||
              author.last_name.toLowerCase().includes(lowercaseSearchTerm)
          );

          // Store matching authors in Redis with a one-hour expiration time
          const success = await client.set(`search:${lowercaseSearchTerm}`, JSON.stringify(matchingAuthors));
      
          // Set cache expiration to one hour (3600 seconds)
          const expireCache = await client.expire(`search:${lowercaseSearchTerm}`, 3600);
      
          return matchingAuthors;
      }
      
      }, 
  Book: {
    author: async (parentValue) => {
      const authors = await authorCollection();
      const author = await authors.findOne({ _id: parentValue.authorId });
      return author;
    }
  },
  Author: {
    numOfBooks: async (parentValue) => {
      const books = await bookCollection();
      const numOfBooks = await books.count({ authorId: parentValue._id });
      return numOfBooks;
    },

    books: async (parentValue, { limit }) => {
      const books = await bookCollection();
      if (limit <= 0) {
        throw new GraphQLError('Limit should be greater than 0', {
          extensions: { code: 'INVALID',statusCode: 400 }
        });
      }
      if (limit) {
        const limitedBooks =  await books.find({ authorId: parentValue._id }).limit(limit).toArray();
        return limitedBooks;
      }
        const findBooks =  await books.find({ authorId: parentValue._id }).toArray();
     
         return findBooks;
    }
  },
  Mutation: {
    addAuthor: async (_, args) => {
      // Validate input fields
      const { first_name, last_name, date_of_birth, hometownCity, hometownState } = args;

      const regForName =/^[A-Za-z\s]+$/;

      if (!first_name.trim() || !last_name.trim() || !date_of_birth.trim() || !hometownCity.trim() || !hometownState.trim() || !regForName.test(first_name) || !regForName.test(last_name)) {
        throw new GraphQLError('Invalid input values', {
          extensions: { code: 'BAD_REQUEST' ,statusCode: 400}
        });
      }

      const trimFirstName = first_name.trim();
      const trimLastName = last_name.trim();
      const trimDateOfBirth = date_of_birth.trim();
      const trimHometownCity = hometownCity.trim();
      const trimHometownState = hometownState.trim();

      if (!first_name || !last_name || !date_of_birth || !hometownCity) {
        throw new GraphQLError('Invalid input values', {
          extensions: { code: 'BAD_REQUEST',statusCode: 400 }
        });
      }

      const validateDate = (date) => {
        const dateFormat = ['YYYY-MM-DD', 'MM/DD/YYYY', 'M/D/YYYY', 'M/DD/YYYY', 'MM/D/YYYY']; 
        return moment(date, dateFormat, true).isValid(); 
      };

      if (!validateDate(trimDateOfBirth)) {
        throw new GraphQLError('Invalid date_of_birth', {
          extensions: { code: 'BAD_REQUEST',statusCode: 400 }
        });
      }

      const US_STATES =
        ["AL","AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", 
        "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", 
        "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", 
        "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", 
        "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", 
        "VI", "WA", "WV", "WI", "WY"
      ];
  
      if (!US_STATES.includes(hometownState.toUpperCase().trim())) {
        throw new GraphQLError('Invalid state abbreviation', {
          extensions: { code: 'BAD_REQUEST',statusCode: 400 }
        });
      }
     
      const newAuthor = {
        _id: uuid(),
        first_name:trimFirstName,
        last_name:trimLastName,
        date_of_birth:trimDateOfBirth,
        hometownCity: trimHometownCity,
        hometownState:trimHometownState,
        numOfBooks: 0, 
        books: []       
      };

      // Add the new author to MongoDB
      const authors = await authorCollection();
      const insertAuthor = await authors.insertOne(newAuthor);

      if (!insertAuthor.acknowledged || !insertAuthor.insertedId) {
        throw new GraphQLError('Could not add author', {
          extensions: { code: 'BAD_REQUEST',statusCode: 400 }
        });
      }

      // Add the new author to the Redis cacahe
      const success = await client.set( `author:${newAuthor._id}`, JSON.stringify(newAuthor));

      // Update the list of authors in the Redis cache
       const cachedAuthors = await client.get('authors');
       let authorsCache = [];
       if (cachedAuthors) {
         authorsCache = JSON.parse(cachedAuthors);
     }
            authorsCache.push(newAuthor);
        const updatedCache = await client.set('authors', JSON.stringify(authorsCache));
         
        //expire the redis cache after one hour
        const expireCache = await client.expire('authors', 3600);

      return newAuthor;
    },
    editAuthor: async(_, args) => {
      const { _id, first_name, last_name, date_of_birth, hometownCity, hometownState } = args;

      const trimmedId = _id.trim()

        // Validate _id, it should be a valid UUID
           if (!validate(trimmedId)) {
          throw new GraphQLError('Invalid author ID', {
           extensions: { code: 'BAD_REQUEST',statusCode: 400 }
    });
  }
  const regForName = /^[A-Za-z\s]*[A-Za-z][A-Za-z\s]*$/;

      if (!regForName.test(first_name)) {
        throw new GraphQLError('Invalid First name values', {
          extensions: { code: 'BAD_REQUEST',statusCode: 400 }
        });
      }

      if (!regForName.test(last_name)) {
        throw new GraphQLError('Invalid Last name values', {
          extensions: { code: 'BAD_REQUEST',statusCode: 400 }
        });
      }

      const US_STATES =
      ["AL","AK", "AS", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", 
      "GA", "GU", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", 
      "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", 
      "NH", "NJ", "NM", "NY", "NC", "ND", "MP", "OH", "OK", "OR", 
      "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", 
      "VI", "WA", "WV", "WI", "WY"
    ];

    const validateDate = (date) => {
      const trimmedDate = date.trim();
      const dateFormat = ['YYYY-MM-DD', 'MM/DD/YYYY', 'M/D/YYYY', 'M/DD/YYYY', 'MM/D/YYYY']; 
      return moment(trimmedDate, dateFormat, true).isValid(); 
    };
  
      // Create an update object with the fields to be modified
      const updateFields = {};
      if (first_name) {
          updateFields.first_name = first_name.trim()
      }
      if (last_name) {
          updateFields.last_name = last_name.trim()
      }
      if (date_of_birth) {
        if (!validateDate(date_of_birth)) {
            throw new GraphQLError('Invalid date_of_birth', {
                extensions: { code: 'BAD_REQUEST',statusCode: 400 }
            });
        }
        updateFields.date_of_birth = date_of_birth.trim();
    }

    if (hometownCity !== undefined) {
      const trimmedHometownCity = hometownCity.trim();
      if (trimmedHometownCity === '') {
          throw new GraphQLError('hometownCity cannot be empty string', {
              extensions: { code: 'BAD_REQUEST' ,statusCode: 400}
          });
      }
      updateFields.hometownCity = trimmedHometownCity;
  }
  
  // Check if hometownState is not empty or just spaces
  if (hometownState !== undefined) {
      const trimmedState = hometownState.trim().toUpperCase();
      if (trimmedState === '') {
          throw new GraphQLError('hometownState cannot be empty string', {
              extensions: { code: 'BAD_REQUEST',statusCode: 400 }
          });
      }
      if (!US_STATES.includes(trimmedState)) {
          throw new GraphQLError('Invalid state abbreviation', {
              extensions: { code: 'BAD_REQUEST' ,statusCode: 400}
          });
      }
      updateFields.hometownState = trimmedState;
  }

  
      // Fetch author from MongoDB using _id and update specific fields
      const authors = await authorCollection();
      const updateResult = await authors.updateOne({ _id: trimmedId }, { $set: updateFields });
  
      if (updateResult.modifiedCount === 0) {
          throw new GraphQLError('No changes has been made to update the Author', {
              extensions: { code: 'BAD_REQUEST',statusCode: 400 }
          });
      }
  
      // Fetch the updated author from MongoDB
      const updatedAuthor = await authors.findOne({ _id:trimmedId });
  
  
      // Update author in Redis cache
      const success = await client.set(`author:${_id}`, JSON.stringify(updatedAuthor));

      // Fetch the list of authors from Redis
const cachedAuthors = await client.get('authors');
let authorsCache = [];
if (cachedAuthors) {
  authorsCache = JSON.parse(cachedAuthors);
}

// Find and update the specific author in the list
const updatedAuthorsCache = authorsCache.map(author => {
  if (author._id === trimmedId) {
    return updatedAuthor;
  }
  return author;
});

// Store the updated list of authors back in Redis
const updatedCache = await client.set('authors', JSON.stringify(updatedAuthorsCache));

 //expire the redis cache after one hour
 const expireCache = await client.expire('authors', 3600);

  
 return updatedAuthor;
  },
  removeAuthor: async(_, args) => {
    const { _id } = args;

   // Trim the _id input
   const trimmedId = _id.trim();

   // Validate trimmedId, it should be a valid UUID
   if (!validate(trimmedId)) {
     throw new GraphQLError('Invalid author ID', {
       extensions: { code: 'BAD_REQUEST', statusCode: 400 }
     });
   }

    const authors = await authorCollection();
    const books = await bookCollection();

    // Find the author by _id
    const author = await authors.findOne({ _id: trimmedId });
    const authorBooks = await books.find({ authorId: trimmedId }).toArray();

    if (!author) {
      throw new GraphQLError('Author not found', {
        extensions: { code: 'NOT_FOUND',statusCode: 404 }
      });
    }

    // Remove all books written by the author from MongoDB
    const deletBooksofAuthor = await books.deleteMany({ authorId: trimmedId });

    // Remove author from MongoDB
    const removeAuthor = await authors.deleteOne({ _id: trimmedId });

    if (removeAuthor.deletedCount === 0) {
      throw new GraphQLError('Failed to remove author', {
        extensions: { code: 'INTERNAL_SERVER_ERROR', statusCode: 500 }
      });
    }

    // Update authors cache: get all authors from cache, remove the current author, and set it back in cache
    const existCachedAuthors = await client.exists('authors');
    if (existCachedAuthors) {
      const cachedAuthors = await client.get('authors');
      const authorsData = JSON.parse(cachedAuthors);
  
      // Remove the current author from cached authors
      const updatedAuthors = authorsData.filter(author => author._id !== trimmedId);
  
      // Update authors cache
      const success = await client.set('authors', JSON.stringify(updatedAuthors));

      //expire the redis cache after one hour
      const expireCache = await client.expire('authors', 3600);
    }

    // Update books cache: get all books from cache, remove books written by the deleted author, and set it back in cache
    const existCachedBooks = await client.exists('books');
    if (existCachedBooks) {
        const cachedBooks = await client.get('books');
        const booksData = JSON.parse(cachedBooks);

        // Remove books written by the deleted author from cached books
        const updatedBooks = booksData.filter(book => book.authorId !== _id);

        // Update books cache
        const success = await client.set('books', JSON.stringify(updatedBooks));

        //expire the redis cache after one hour
        const expireCache = await client.expire('books', 3600);
    }
  
    return { ...author, books: authorBooks };
  },

  addBook: async (_, args) => {
    const {
      title,
      genres,
      publicationDate,
      publisher,
      summary,
      isbn,
      language,
      pageCount,
      price,
      format,
      authorId
    } = args;

    const trimAuthorId = authorId.trim();

    if (!title.trim()) {
      throw new GraphQLError('Title cannot be empty or contain only spaces', {
        extensions: { code: 'BAD_REQUEST' ,statusCode: 400 }
      });
    }

    
   // Validate publication date
   const validateDate = (date) => {
    const dateFormat = ['MM/DD/YYYY', 'M/D/YYYY', 'M/DD/YYYY', 'MM/D/YYYY']; 
    return moment(date, dateFormat, true).isValid(); 
  };

  if (!publicationDate || !validateDate(publicationDate.trim())) {
    throw new GraphQLError('Invalid publication date', {
      extensions: { code: 'BAD_REQUEST',statusCode: 400 }
    });
  }

  // Fetch author from MongoDB using authorId
  const authors = await authorCollection();
  const author = await authors.findOne({ _id: trimAuthorId });

  if (!author) {
    throw new GraphQLError('Author not found', {
      extensions: { code: 'NOT_FOUND',statusCode: 404 }
    });
  }

  const validateAuthorBirthdate = (date) => {
    const dateFormat = ['MM/DD/YYYY', 'M/D/YYYY', 'M/DD/YYYY', 'MM/D/YYYY']; 
    return moment(date, dateFormat, true).isValid(); 
  };
  

   // Validate author's date of birth
   if (!validateAuthorBirthdate(author.date_of_birth)) {
    throw new GraphQLError('Invalid author birthdate', {
      extensions: { code: 'BAD_REQUEST',statusCode: 400 }
    });
  } else {
  }

  // Compare publication date and author's date of birth
  const authorBirthDate = moment(author.date_of_birth, 'MM/DD/YYYY');
  const publicationDateMoment = moment(publicationDate, 'MM/DD/YYYY');

  if (!publicationDateMoment.isValid() || !authorBirthDate.isValid()) {
    throw new GraphQLError('Invalid date format', {
      extensions: { code: 'BAD_REQUEST',statusCode: 400 }
    });
  } else {
  }

  if (publicationDateMoment.isBefore(authorBirthDate, 'day')) {

    throw new GraphQLError('Publication date cannot be before the author\'s date of birth', {
      extensions: { code: 'BAD_REQUEST',statusCode: 400 }
    });
  }

    // Validate authorId, it should be a valid ObjectId
   if (!validate(trimAuthorId)) {
    throw new GraphQLError('Invalid author ID', {
      extensions: { code: 'BAD_REQUEST',statusCode: 400 }
  });
    }

    // Validate genres and format arrays
    if (!genres.every(genre => genre.trim() !== '')) {
      throw new GraphQLError('Genres should not contain empty strings', {
        extensions: { code: 'BAD_REQUEST',statusCode: 400 }
      });
    }

    if (!format.every(fmt => fmt.trim() !== '')) {
      throw new GraphQLError(' format should not contain empty strings', {
        extensions: { code: 'BAD_REQUEST',statusCode: 400 }
      });
    }

    // Validate price and pageCount
    if (isNaN(parseFloat(price)) || price <= 0 || !Number.isFinite(price)) {
      throw new GraphQLError('Invalid price', {
        extensions: { code: 'BAD_REQUEST' ,statusCode: 400}
      });
    }

    if ( !Number.isSafeInteger(pageCount) || pageCount <= 0) {
      throw new GraphQLError('Invalid pageCount', {
        extensions: { code: 'BAD_REQUEST',statusCode: 400 }
      });
    }

    const isbn13Regex = /^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$/;

    // Function to validate ISBN-13 using the regex pattern
      function validateISBN13(isbn) {
    return isbn13Regex.test(isbn);
}

const trimmedISBN = args.isbn.trim();
if (!validateISBN13(trimmedISBN)) {
    throw new GraphQLError('Invalid ISBN-13 format', {
        extensions: { code: 'BAD_REQUEST' ,statusCode: 400}
    });
}


    // Create a new book object
    const newBook = {
      _id: uuid(), // Generate a new UUID for the book
      title: title.trim(),
      genres: genres.map(genre => genre.trim()),
      publicationDate: publicationDate.trim(),
      publisher: publisher.trim(),
      summary: summary.trim(),
      isbn: isbn.trim(),
      language: language.trim(),
      pageCount: pageCount,
      price: parseFloat(price),
      format: format.map(fmt => fmt.trim()),
      authorId : trimAuthorId
    };

    // Save the book to MongoDB
    const books = await bookCollection();
    const insertResult = await books.insertOne(newBook);

    if (!insertResult.acknowledged || !insertResult.insertedId) {
      throw new GraphQLError('Failed to add book', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' ,statusCode: 500}
      });
    }

    // Update the numOfBooks field for the corresponding author
    const numOfBookAuthor = await authorCollection();
    const updatedAuthor = await numOfBookAuthor.findOneAndUpdate(
        { _id: trimAuthorId }, { $inc: { numOfBooks: 1 }, $push: { books: newBook._id } }, { returnDocument: 'after' }
    );

    // Add the book to Redis cache
    const success = await client.set(`book:${newBook._id}`, JSON.stringify(newBook));

    //update the list of books to the Redis Cache
    const cachedBooks = await client.get('books');
    let booksCache = [];
    if(cachedBooks){
      booksCache = JSON.parse(cachedBooks);
    }

      booksCache.push(newBook);
      const updatedCache = await client.set('books', JSON.stringify(booksCache));

      //expire the redis cache after one hour
      const expireBookCache = await client.expire('books', 3600);

      // Update authors cache: add the new book's ID to the author's books array
    const cachedAuthors = await client.get('authors');
    let authorsCache = [];
    if (cachedAuthors) {
        authorsCache = JSON.parse(cachedAuthors);
    }

    const updatedAuthorsCache = authorsCache.map(author => {
        if (author._id === trimAuthorId) {
            author.numOfBooks += 1;
            author.books.push(newBook._id);
        }
        return author;
    });

    const successAuthorsCache = await client.set('authors', JSON.stringify(updatedAuthorsCache));

     //expire the redis cache after one hour
   const expireCache = await client.expire('authors', 3600);

    return newBook;
  },
  editBook: async (_, args) => {
    const { _id, authorId, ...updatedFields } = args;
    const { publicationDate, isbn } = updatedFields;

    //trim _id
    const trimmedBookId = _id.trim();

    
    // Trim the authorId input
    const trimmedAuthorId = authorId.trim();

    // Validate _id, it should be a valid ObjectId
    if (!validate(trimmedBookId)) {
      throw new GraphQLError('Invalid book ID', {
        extensions: { code: 'BAD_REQUEST',statusCode: 400 }
      });
    }

    // Validate authorId, it should be a valid ObjectId
    if (!validate(trimmedAuthorId)) {
      throw new GraphQLError('Invalid author ID', {
        extensions: { code: 'BAD_REQUEST', statusCode: 400 }
      });
      
    }

    // Validate publication date
    const validateDate = (date) => {
      const dateFormat = ['MM/DD/YYYY', 'M/D/YYYY', 'M/DD/YYYY', 'MM/D/YYYY'];
      return moment(date, dateFormat, true).isValid();
  };

  if (!publicationDate || !validateDate(publicationDate.trim())) {
      throw new GraphQLError('Invalid publication date', {
          extensions: { code: 'BAD_REQUEST', statusCode: 400 }
      });
  }

  // Validate ISBN-13
  const isbn13Regex = /^(?:ISBN(?:-13)?:?\ )?(?=[0-9]{13}$|(?=(?:[0-9]+[-\ ]){4})[-\ 0-9]{17}$)97[89][-\ ]?[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9]$/;

  function validateISBN13(isbn) {
      return isbn13Regex.test(isbn);
  }

  const trimmedISBN = isbn.trim();
  if (!validateISBN13(trimmedISBN)) {
      throw new GraphQLError('Invalid ISBN-13 format', {
          extensions: { code: 'BAD_REQUEST', statusCode: 400 }
      });
  }

       // Validate that none of the fields are empty strings or just spaces
       const isValidFields = Object.values(updatedFields).every(field => {
        if (Array.isArray(field)) {
          return field.every(item => typeof item === 'string' && item.trim() !== '');
        }
        return typeof field === 'string' && field.trim() !== '';
      });
  
      if (!isValidFields) {
        throw new GraphQLError('Fields cannot be empty or contain only spaces', {
          extensions: { code: 'BAD_REQUEST',statusCode: 400 }
        });
      }

    /// Trim the updated fields before saving them
    Object.keys(updatedFields).forEach(field => {
      if (updatedFields[field] !== undefined) {
        if (field === 'genres' && Array.isArray(updatedFields[field])) {
          // Trim each genre in the genres array
          updatedFields[field] = updatedFields[field].map(genre => genre.trim());
        } else if (typeof updatedFields[field] === 'string') {
          // Trim string fields
          updatedFields[field] = updatedFields[field].trim();
        }
      }
    });
  
    // Fetch existing book from MongoDB
    const books = await bookCollection();
    const existingBook = await books.findOne({ _id:trimmedBookId });
  
    if (!existingBook) {
      throw new GraphQLError('Book not found', {
        extensions: { code: 'NOT_FOUND',statusCode: 404 }
      });
    }
  
    // If authorId is provided and different from the existing one
    if (trimmedAuthorId && trimmedAuthorId !== existingBook.authorId) {
      // Validate new authorId, it should be a valid ObjectId
      // Validate authorId, it should be a valid ObjectId
   if (!validate(trimmedAuthorId)) {
    throw new GraphQLError('Invalid author ID', {
      extensions: { code: 'BAD_REQUEST',statusCode: 400 }
  });
    }
  
      // Fetch old and new authors from MongoDB
      const authors = await authorCollection();
      const oldAuthor = await authors.findOne({ _id: existingBook.authorId });
      const newAuthor = await authors.findOne({ _id: trimmedAuthorId });
  
      // If old author exists, remove book ID from their books array
      if (oldAuthor) {
        await authors.updateOne({ _id: existingBook.authorId }, { $pull: { books: _id } ,  $inc: { numOfBooks: -1 }});
      }
  
      // If new author exists, add book ID to their books array
      // If new author exists, add book ID to their books array
      if (newAuthor) {
        await authors.updateOne(
          { _id: trimmedAuthorId },
          { $addToSet: { books: trimmedBookId }, $inc: { numOfBooks: 1 } }
        );
        // Update the authorId in the book document
        existingBook.authorId = trimmedAuthorId;
      }
    }
  
    // Update existing book fields with provided values
    Object.keys(updatedFields).forEach(field => {
      if (updatedFields[field] !== undefined) {
        existingBook[field] = updatedFields[field];
      }
    });
  
    // Update the book in MongoDB
    const updateResult = await books.replaceOne({ _id:trimmedBookId }, existingBook);

  
    if (updateResult.modifiedCount === 0) {
      throw new GraphQLError('No changes made', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' ,statusCode: 500}
      });
    }
  
    // Remove old and new author entries from Redis cache
    const removeOldAuthor = await client.del(`author:${existingBook.authorId}`);
    const removeNewAuthor = await client.del(`author:${args.authorId}`);
  
    // Update the book in Redis cache
    const success = await client.set(`book:${_id}`, JSON.stringify(existingBook));

   
    // Fetch the list of books from Redis cache
    const cachedBooks = await client.get('books');
    let booksCache = [];
    if (cachedBooks) {
        booksCache = JSON.parse(cachedBooks);
    }

    // Find and update the specific book in the list
    const updatedBooksCache = booksCache.map(book => {
        if (book._id === trimmedBookId) {
            return existingBook; 
        }
        return book;
    });

    // Store the updated list of books back in Redis
    const updatedCache = await client.set('books', JSON.stringify(updatedBooksCache));

    // Expire the Redis cache after one hour
    const expireCache = await client.expire('books', 3600);

    return existingBook;
},
  removeBook: async (_, args) => {
    const { _id } = args;

    //trim the id input 
    const trimmedId = _id.trim();

    // Validate _id, it should be a valid ObjectId
    if (!validate(trimmedId)) {
      throw new GraphQLError('Invalid author ID', {
        extensions: { code: 'BAD_REQUEST' ,statusCode: 400}
    });
      }

    // Fetch the book from MongoDB
    const books = await bookCollection();
    const book = await books.findOne({ _id: trimmedId });

    // If the book is not found, throw an error
    if (!book) {
      throw new GraphQLError('Book not found', {
        extensions: { code: 'NOT_FOUND',statusCode: 404 }
      });
    }

    // Fetch the corresponding author
    const authors = await authorCollection();
    const author = await authors.findOne({ _id: book.authorId });

    // If the author is found, remove the book's _id from the author's books array
    if (author) {
      await authors.updateOne({ _id: book.authorId }, { $pull: { books: _id }, $inc: { numOfBooks: -1 } });
    }

    // Delete the book from MongoDB
    const deleteResult = await books.deleteOne({ _id:trimmedId });

    if (deleteResult.deletedCount === 0) {
      throw new GraphQLError('Failed to delete book', {
        extensions: { code: 'INTERNAL_SERVER_ERROR',statusCode: 500 }
      });
    }


    //update books cache by getting all the books and remoing the current book and set it back to the cache
    const existCachedBooks = await client.exists('books');
    if(existCachedBooks) {
      const cachedBooks = await client.get('books');
      const booksData = JSON.parse(cachedBooks);

    //remove the current book from cached books
    const updatedBooks = booksData.filter(book => book._id !== trimmedId);

    //update the cache
    const success = await client.set('books', JSON.stringify(updatedBooks));

    //expire the redis cache after one hour
    const expireCache = await client.expire('books', 3600);

    //update the authors cache  and remove the bookId and decrement the numOfBooks
    const existCachedAuthors = await client.exists('authors');
    if (existCachedAuthors) {
      const cachedAuthors = await client.get('authors');
      const authorsData = JSON.parse(cachedAuthors);
  
     // Find the author in the array
  const updatedAuthors = authorsData.map(author => {
    if (author._id === book.authorId) { // Compare with authorId, not author._id
      // Filter out the specific book ID from the author's books array
      author.books = author.books.filter(bookId => bookId !== trimmedId); // Compare with _id
      // Decrement numOfBooks by 1
      author.numOfBooks -= 1;
    }
    
    return author;
  });
    
      // Update authors cache
      const success = await client.set('authors', JSON.stringify(updatedAuthors));
    }

    //expire the redis cache after one hour
    const expireAuthorCache = await client.expire('authors', 3600);

    }
    return book;
  }
  }
};
