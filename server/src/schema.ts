import { gql } from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    articles: [Article!]
    comments: [Comment!]
  }

  type Article {
    id: ID!
    title: String!
    content: String!
    author: User!
    likes: Int!
    comments: [Comment!]
    createdAt: String!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    article: Article!
    createdAt: String!
  }

  type Query {
    me: User
    articles: [Article!]
    article(id: ID!): Article
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createArticle(title: String!, content: String!): Article!
    createComment(articleId: ID!, content: String!): Comment!
    likeArticle(articleId: ID!): Article!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
