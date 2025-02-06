import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "graphql-tag";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

// ✅ Charger les variables d'environnement
dotenv.config();

// ✅ Initialiser Prisma
const prisma = new PrismaClient();

// ✅ Clé secrète pour JWT (Remplacez par une variable d'environnement en prod)
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// ✅ Définition du schéma GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
`;

// ✅ Middleware pour extraire l'utilisateur du token JWT
const getUserFromToken = (token?: string) => {
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

// ✅ Implémentation des resolvers
const resolvers = {
  Query: {
    me: async (_: any, __: any, context: { userId?: string }) => {
      if (!context.userId) throw new Error("Not authenticated");
      return await prisma.user.findUnique({ where: { id: context.userId } });
    },
  },
  Mutation: {
    signup: async (
      _: any,
      { username, email, password }: { username: string; email: string; password: string }
    ) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

      return { token, user };
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

      return { token, user };
    },
  },
};

// ✅ Démarrer Apollo Server avec le contexte JWT
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Permet de voir les requêtes disponibles dans Apollo Studio
});

const startServer = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      const token = req.headers.authorization?.replace("Bearer ", "");
      return { userId: getUserFromToken(token) };
    },
  });

  console.log(`🚀 Server ready at ${url}`);
};

startServer();
