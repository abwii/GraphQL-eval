import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: { userId?: string }) => {
      if (!context.userId) throw new Error("Not authenticated");
      return await prisma.user.findUnique({ where: { id: context.userId } });
    },
    articles: async () => {
      return await prisma.article.findMany({ include: { author: true, comments: true } });
    },
    article: async (_: unknown, { id }: { id: string }) => {
      return await prisma.article.findUnique({ where: { id }, include: { author: true, comments: true } });
    }
  },
  Mutation: {
    signup: async (_: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

      return { token, user };
    },

    login: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Incorrect password");

      const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

      return { token, user };
    },

    createArticle: async (_: unknown, { title, content }: { title: string; content: string }, context: { userId?: string }) => {
      if (!context.userId) throw new Error("Not authenticated");

      return await prisma.article.create({
        data: {
          title,
          content,
          authorId: context.userId
        },
        include: {
          author: true
        }
      });
    },

    createComment: async (_: unknown, { articleId, content }: { articleId: string; content: string }, context: { userId?: string }) => {
      if (!context.userId) throw new Error("Not authenticated");

      return await prisma.comment.create({
        data: {
          content,
          articleId,
          authorId: context.userId
        },
        include: {
          author: true,
          article: true
        }
      });
    },

    likeArticle: async (_: unknown, { articleId }: { articleId: string }, context: { userId?: string }) => {
      if (!context.userId) throw new Error("Not authenticated");

      return await prisma.article.update({
        where: { id: articleId },
        data: { likes: { increment: 1 } },
        include: { author: true, comments: true }
      });
    }
  }
};
