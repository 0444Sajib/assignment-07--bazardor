
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client } from "@/lib/mongodb";

export const auth = betterAuth({
    database: mongodbAdapter(client.db(), {
        client,
    }),

    emailAndPassword: {
        enabled: true,
    },

    account: {
    accountLinking: {
        enabled: true,
         trustedProviders: ["google", "github"],
    },
},


    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
             prompt: "select_account",
        },

        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        },
    },
});
