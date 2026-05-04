import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Lozinka", type: "password" },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email.toLowerCase().trim() },
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        isActive: true,
                        passwordHash: true,
                    },
                });

                if (!user) return null;

                if (!user.isActive) {
                    throw new Error("Račun nije aktivan. Kontaktirajte administratora.");
                }

                const passwordValid = await verifyPassword(
                    user.passwordHash,
                    credentials.password
                );

                if (!passwordValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role: string }).role;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
        maxAge: 10 * 60,
    },

    jwt: {
        maxAge: 10 * 60,
    },

    cookies: {
        sessionToken: {
            name: "citydent_token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },

    pages: {
        signIn: "/auth/login",
    },

    secret: process.env.NEXTAUTH_SECRET,
};