import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

dotenv.config();

const prisma = new PrismaClient();

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

const getUserFromToken = (token?: string) => {
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      return { userId: getUserFromToken(token) };
    },
  });

  console.log(`🦍 Server ready at ${url}`);
};

startServer();
