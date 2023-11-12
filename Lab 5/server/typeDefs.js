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
  }

  type Query {
    comicsPage(pageNum: Int!): [Comic]
    comic(id: ID!): Comic
  }`
;