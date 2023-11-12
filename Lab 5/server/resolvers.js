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

              //check if the comic data exist in the redis cache
             const exist = await client.exists(`comic:${id}`)
             if (exist) {
                const comicRedisData =await  client.get(`comic:${id}`)
              
                return res.status(200).json(JSON.parse(comicRedisData));
             }

             // Fetch comic data from the Marvel API
            const publicKey = '9f21335888c4dcdcf185e6ec54d57098';
            const privateKey = '9835ef68c5da41d4945e66ad688ea918e31d4ba5';
            const ts = new Date().getTime();
            const stringToHash = ts + privateKey + publicKey;
            const hash = md5(stringToHash);
            const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
            const url = `${baseUrl}/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
      
            try {
              const response = await axios.get(url);
      
            // Check for successful response
        if (response.data && response.data.data && response.data.data.results.length > 0) {
            const comicData = response.data.data.results[0];
  
            // Extract the relevant fields
            const extractedComicData = {
              id: comicData.id,
              title: comicData.title,
              description: comicData.description,
              issueNumber: comicData.issueNumber,
              variantDescription: comicData.variantDescription,
              pageCount: comicData.pageCount,
              modified: comicData.modified,
              resourceURI: comicData.resourceURI,
              series: {
                name: comicData.series.name,
              },
              thumbnail: {
                path: comicData.thumbnail.path,
                extension: comicData.thumbnail.extension,
              },
            };

            // Store the comic data in Redis cache
            const data = await client.set(`comic:${id}`, JSON.stringify(extractedComicData));
  
            // Return the extracted data
            return extractedComicData;  
              } else {
                // Throw a GraphQL error indicating the comic is not found
                throw new GraphQLError('Comic Not Found', {
                    extensions: { code: 'NOT_FOUND', statusCode: 404 }
                  });
              }
            } catch (error) {
              console.error('Error fetching data from Marvel API:', error);
              throw new GraphQLError(`Internal Server Error`, {
                extensions: {code: 'INTERNAL_SERVER_ERROR'}
            })
            }
          },
        },

        comicsPage: async (_, { pageNum }) => {
          if (!client.isOpen) {
            await client.connect();
          }
      
          // Check if the paginated data exists in the Redis cache
          const exist = await client.exists(`comicsPage:${pageNum}`);
          if (exist) {
            const comicsPageRedisData = await client.get(`comicsPage:${pageNum}`);
            return JSON.parse(comicsPageRedisData);
          }
      
          // Fetch paginated comic data from the Marvel API
          const publicKey = '9f21335888c4dcdcf185e6ec54d57098';
          const privateKey = '9835ef68c5da41d4945e66ad688ea918e31d4ba5';
          const ts = new Date().getTime();
          const stringToHash = ts + privateKey + publicKey;
          const hash = md5(stringToHash);
          const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
          const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&offset=${pageNum * 20}&limit=20`;
      
          try {
            const response = await axios.get(url);
      
            // Check for successful response
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
                series: {
                  name: comicData.series.name,
                },
                thumbnail: {
                  path: comicData.thumbnail.path,
                  extension: comicData.thumbnail.extension,
                },
              }));
      
              // Store the paginated data in Redis cache
              const data = await client.set(`comicsPage:${pageNum}`, JSON.stringify(comicsPageData));
      
              // Return the paginated data
              return comicsPageData;
            } else {
              // Throw a GraphQL error indicating that the page doesn't exist or has no comics
              throw new GraphQLError('Page Not Found', {
                extensions: { code: 'NOT_FOUND', statusCode: 404 }
              });
            }
          } catch (error) {
            console.error('Error fetching data from Marvel API:', error);
            throw new GraphQLError('Internal Server Error', {
              extensions: { code: 'INTERNAL_SERVER_ERROR' }
            });
          }
        },
      };