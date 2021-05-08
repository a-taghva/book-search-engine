const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    link: String
    image: String
  }

  type Auth {
    token: String
    user: User
  }

  input BookInput {
    authors: [String!]
    description: String!
    bookId: ID!
    image: String
    link: String
    title: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String!], description: String!, bookId: ID!, image: String, title: String!, description: String!): User
  }
`;

module.exports = typeDefs;
