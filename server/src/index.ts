import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { gql } from 'graphql-tag';
import dotenv from 'dotenv';

dotenv.config();

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Query {
    me: User
  }
`;

const resolvers = {
  Query: {
    me: () => ({
      id: "1",
      username: "testuser",
      email: "test@example.com"
    })
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const startServer = async () => {
  const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  console.log(`🚀 Server ready at ${url}`);
};

startServer();
