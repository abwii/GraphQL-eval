import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Article {
    id: ID!
    title: String!
    content: String!
    author: User!
    likes: Int!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    articles: [Article!]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createArticle(title: String!, content: String!): Article!
  }
`;