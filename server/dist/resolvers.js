import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";
export const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.userId)
                throw new Error("Not authenticated");
            return await prisma.user.findUnique({ where: { id: context.userId } });
        },
        posts: async () => {
            return await prisma.post.findMany({ include: { author: true } });
        },
        post: async (_, { id }) => {
            return await prisma.post.findUnique({ where: { id }, include: { author: true } });
        },
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: { username, email, password: hashedPassword },
            });
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });
            return { token, user };
        },
        login: async (_, { email, password }) => {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user)
                throw new Error("User not found");
            const valid = await bcrypt.compare(password, user.password);
            if (!valid)
                throw new Error("Incorrect password");
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });
            return { token, user };
        },
        createPost: async (_, { title, content }, context) => {
            if (!context.userId)
                throw new Error("Not authenticated");
            return await prisma.post.create({
                data: { title, content, authorId: context.userId },
                include: { author: true },
            });
        },
    },
};
