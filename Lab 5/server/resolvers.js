import {GraphQLError} from 'graphql';
import axios from 'axios';
import md5 from 'blueimp-md5';
import redis from 'redis';

const client = redis.createClient();

(async () => {
await client.connect();
})();


export const resolvers = {
Query: {
comic: async (_, { id }) => {
if (!client.isOpen) {
await client.connect();
}

  const exist = await client.exists(`comic:${id}`)
  if (exist) {
    const comicRedisData =await  client.get(`comic:${id}`)
  
    return JSON.parse(comicRedisData);
  }

const publicKey = 'ca378c8b8b47b25545017931da866048';
const privateKey = 'db804abe0f8ca5e5752029e5c385270dcb4c943f';
const ts = new Date().getTime();
const stringToHash = ts + privateKey + publicKey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
const url = `${baseUrl}/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

try {
  const response = await axios.get(url);

if (response.data && response.data.data && response.data.data.results.length > 0) {
const comicData = response.data.data.results[0];

    const extractedComicData = {
      id: comicData.id,
      title: comicData.title,
      description: comicData.description,
      issueNumber: comicData.issueNumber,
      variantDescription: comicData.variantDescription,
      pageCount: comicData.pageCount,
      modified: comicData.modified,
      resourceURI: comicData.resourceURI,
      digitalId: comicData.digitalId,
      isbn: comicData.isbn,
      upc: comicData.upc,
      diamondCode: comicData.diamondCode,
      ean: comicData.ean,
      issn: comicData.issn,
      format: comicData.format,
      pageTextObjects: comicData.textObjects,
      urls: comicData.urls,
      series: comicData.series,
      variants: comicData.variants,
      collections: comicData.collections,
      collectedIssues: comicData.collectedIssues,
      dates: comicData.dates,
      prices: comicData.prices,
      thumbnail: comicData.thumbnail,
      images: comicData.images,
      creators: comicData.creators,
      characters: comicData.characters,
      stories: comicData.stories,
      events: comicData.events,
    };

const data = await client.set(`comic:${id}`, JSON.stringify(extractedComicData));

return extractedComicData;  
  } else {
    throw new GraphQLError('Comic Not Found', {
        extensions: { code: 'NOT_FOUND', statusCode: 404 }
      });
  }
} catch (error) {
  console.error('Error fetching data from Marvel API:', error);

  if (error.response) {
    throw new GraphQLError(error.response.data.status, {
      extensions: { code: error.response.data.code, statusCode: error.response.status }
    });
  } else {
    throw new GraphQLError('Internal Server Error', {
      extensions: { code: 'INTERNAL_SERVER_ERROR' }
    });
  }
}
},
comicsPage: async (_, { pageNum }) => {
if (!client.isOpen) {
await client.connect();
}

const exist = await client.exists(`comicsPage:${pageNum}`);
if (exist) {
const comicsPageRedisData = await client.get(`comicsPage:${pageNum}`);
return JSON.parse(comicsPageRedisData);
}

const publicKey = 'ca378c8b8b47b25545017931da866048';
const privateKey = 'db804abe0f8ca5e5752029e5c385270dcb4c943f';
const ts = new Date().getTime();
const stringToHash = ts + privateKey + publicKey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&orderBy=title&offset=${(pageNum - 1) * 20}&limit=20`;

try {
const response = await axios.get(url);

if (response.data && response.data.data && response.data.data.results.length > 0) {
  const comicsPageData = response.data.data.results.map((comicData) => ({
    id: comicData.id,
    title: comicData.title,
    description: comicData.description,
    issueNumber: comicData.issueNumber,
    variantDescription: comicData.variantDescription,
    pageCount: comicData.pageCount,
    modified: comicData.modified,
    resourceURI: comicData.resourceURI,
  }));

  const data = await client.set(`comicsPage:${pageNum}`, JSON.stringify(comicsPageData));

  return comicsPageData;
} else {
  throw new GraphQLError('Page Not Found', {
    extensions: { code: 'NOT_FOUND', statusCode: 404 }
  });
}
}  catch (error) {
console.error('Error fetching data from Marvel API:', error);

if (error.response) {
  throw new GraphQLError(error.response.data.status, {
    extensions: { code: error.response.data.code, statusCode: error.response.status }
  });
} else {
  throw new GraphQLError('Internal Server Error', {
    extensions: { code: 'INTERNAL_SERVER_ERROR' }
  });
}
}
},
searchComics: async (_, { searchTerm, pageNum }) => {
  if (!client.isOpen) {
    await client.connect();
  }

  const publicKey = 'ca378c8b8b47b25545017931da866048';
  const privateKey = 'db804abe0f8ca5e5752029e5c385270dcb4c943f';
  const pageSize = 20; 
  let offset = (pageNum - 1) * pageSize; 

  const searchResultsData = [];

  try {
    const ts = new Date().getTime();
    const stringToHash = ts + privateKey + publicKey;
    const hash = md5(stringToHash);
    const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
    const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&titleStartsWith=${searchTerm}&offset=${offset}&limit=${pageSize}`;

    const response = await axios.get(url);

    if (response.data && response.data.data && response.data.data.results.length > 0) {
      const results = response.data.data.results.map((comicData) => ({
        id: comicData.id,
        title: comicData.title,
        description: comicData.description,
        issueNumber: comicData.issueNumber,
        variantDescription: comicData.variantDescription,
        pageCount: comicData.pageCount,
        modified: comicData.modified,
        resourceURI: comicData.resourceURI,
      }));

      searchResultsData.push(...results);
    }

    await client.set(`searchComics:${searchTerm}_page${pageNum}`, JSON.stringify(searchResultsData));

    return searchResultsData;
  } catch (error) {
    console.error('Error fetching data from Marvel API:', error);

    if (error.response) {
      throw new GraphQLError(error.response.data.status, {
        extensions: { code: error.response.data.code, statusCode: error.response.status },
      });
    } else {
      throw new GraphQLError('Internal Server Error', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }
  }
},

},
};