import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient, User, Article } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

interface Context {
  userId?: string;
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.userId) throw new Error("Not authenticated");
      return prisma.user.findUnique({ where: { id: context.userId } });
    },
    articles: async (): Promise<Article[]> => {
      return prisma.article.findMany({ include: { author: true } });
    },
  },
  Mutation: {
    signup: async (
      _: unknown,
      { username, email, password }: { username: string; email: string; password: string }
    ): Promise<{ token: string; user: User }> => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

      return { token, user };
    },

    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ): Promise<{ token: string; user: User }> => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");

      if (!(await bcrypt.compare(password, user.password))) throw new Error("Incorrect password");

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

      return { token, user };
    },

    createArticle: async (
      _: unknown,
      { title, content }: { title: string; content: string },
      context: Context
    ): Promise<Article> => {
      if (!context.userId) throw new Error("Not authenticated");

      return prisma.article.create({
        data: { title, content, authorId: context.userId },
        include: { author: true },
      });
    },
  },
};
