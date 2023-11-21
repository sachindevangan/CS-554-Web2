export const typeDefs = `#graphql

type TextObject {
  type: String
  language: String
  text: String
}

type Url {
  type: String
  url: String
}

type SeriesSummary {
  resourceURI: String
  name: String
}

type ComicSummary {
  resourceURI: String
  name: String
}

type ComicDate {
  type: String
  date: String
}

type ComicPrice {
  type: String
  price: Float
}

type Image {
  path: String
  extension: String
}

type CreatorSummary {
  resourceURI: String
  name: String
  role: String
}

type CreatorList {
  available: Int
  returned: Int
  collectionURI: String
  items: [CreatorSummary]
}

type CharacterSummary {
  resourceURI: String
  name: String
  role: String
}

type CharacterList {
  available: Int
  returned: Int
  collectionURI: String
  items: [CharacterSummary]
}

type StorySummary {
  resourceURI: String
  name: String
  type: String
}

type StoryList {
  available: Int
  returned: Int
  collectionURI: String
  items: [StorySummary]
}

type EventSummary {
  resourceURI: String
  name: String
}

type EventList {
  available: Int
  returned: Int
  collectionURI: String
  items: [EventSummary]
}

type Comic {
  id: ID!
  title: String!
  description: String
  issueNumber: Float
  variantDescription: String
  pageCount: Int
  modified: String
  resourceURI: String
  digitalId: Int
  isbn: String
  upc: String
  diamondCode: String
  ean: String
  issn: String
  format: String
  pageTextObjects: [TextObject]
  urls: [Url]
  series: SeriesSummary
  variants: [ComicSummary]
  collections: [ComicSummary]
  collectedIssues: [ComicSummary]
  dates: [ComicDate]
  prices: [ComicPrice]
  thumbnail: Image
  images: [Image]
  creators: CreatorList
  characters: CharacterList
  stories: StoryList
  events: EventList
}


type Query {
  comicsPage(pageNum: Int!): [Comic]
  comic(id: ID!): Comic
  searchComics(searchTerm: String!, pageNum: Int!): [Comic]
}
`;