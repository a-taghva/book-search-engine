const { gql } = require('apollo-server-express');

const typeDefs = gql`
  Query {
    helloWorld: String
  }
`;

module.exports = typeDefs;