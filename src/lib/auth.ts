import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// import { PrismaClient } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { bearer, openAPI } from "better-auth/plugins";

import { expo } from "@better-auth/expo";


export const prisma = new PrismaClient();
// const prisma = new PrismaClient();
export const auth = betterAuth({
    trustedOrigins: [
        "http://localhost:3000",],
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        },
        github: {
            clientId: "" as string,
            clientSecret: "" as string
        }
    },

    plugins: [
        expo(),
        bearer(),
        openAPI(),
    ]
})
