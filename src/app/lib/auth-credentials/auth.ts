import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "../db";
import { loginSchema } from "../schemas/auth";


const adapter = PrismaAdapter(prisma)

export const { handlers, signIn, signOut, auth} = NextAuth({
    adapter,
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {

                const validatedCredentials = loginSchema.parse(credentials);

                const user = await prisma.user.findUnique({
                    where: {
                        email: validatedCredentials?.email,
                    },
                });

                if (!user || !user.password) {
                    throw new Error("No user found");
                }

                const isValid = await bcrypt.compare(
                    credentials?.password as string,
                    user.password
                );

                if (!isValid) {
                    throw new Error("Incorrect password");
                }
                return user;

            }
        }),

    ],
    callbacks: {
        async signIn({ user }) {
            // ✅ Borrar sesiones activas ANTES de iniciar una nueva de google o credentials
            await prisma.session.deleteMany({
                where: {
                    userId: user.id,
                },
            });

            return true;
        },

        async session({ session, user }) {
            if (session.user) {
                session.user.email = user.email; // <- Aquí agregamos el id en la sesión
            }
            return session;
        },


        async jwt({ token, account, user }) {
            if (account?.provider === "credentials") {
                token.credentials = true;
            }
            // se ejecuta cada vez que se crea un jwt
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
    jwt: {
        encode: async function (params) {
            if (params.token?.credentials) {
                const sessionToken = uuid();

                if (!params.token.sub) {
                    throw new Error("No user ID found in token");
                }

                // Create session in database  moddo credenciales
                const createdSession = await adapter?.createSession?.({
                    sessionToken: sessionToken,
                    userId: params.token.sub,
                    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                });

                if (!createdSession) {
                    throw new Error("Failed to create session");
                }

                return sessionToken;
            }
            return defaultEncode(params);
        },
    },



})
