import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "../db/prisma";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
