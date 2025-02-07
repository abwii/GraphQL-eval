import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

export const resolvers = {
  Query: {
    me: async (_: any, __: any, context: { userId?: string }) => {
      if (!context.userId) throw new Error("Not authenticated");
      return await prisma.user.findUnique({ where: { id: context.userId } });
    },
  },
  Mutation: {
    signup: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
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
