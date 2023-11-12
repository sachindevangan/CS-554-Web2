export const typeDefs = `#graphql
type Comic {
    id: ID!
    title: String!
    description: String
    issueNumber: Float
    variantDescription: String
    pageCount: Int
    modified: String
    resourceURI: String
    series: Series
    thumbnail: Image
  }

type Series {
    name: String
  }
  
  type Query {
    comicsPage(pageNum: Int!): [Comic]
    comic(id: ID!): Comic
  }`
;