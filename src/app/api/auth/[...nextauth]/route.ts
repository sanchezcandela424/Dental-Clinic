import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const MAX_INACTIVE = 10 * 60 * 1000;

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const users = [
                    { id: "1", email: "admin@citydent.com", password: "password123", role: "MASTER" },
                    { id: "2", email: "staff@citydent.com", password: "staff123", role: "STAFF" }
                ];

                const user = users.find(u =>
                    u.email === credentials?.email &&
                    u.password === credentials?.password
                );

                if (user) {
                    return user;
                }

                return null;
            }
        })
    ],


    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 sat
    },

    callbacks: {
        async jwt({ token, user }) {
            const now = Date.now();

            // first login
            if (user) {
                token.role = (user as any).role;
                token.lastActive = now;
            }

            //  inactivity logout
            if (
                token.lastActive &&
                now - (token.lastActive as number) > MAX_INACTIVE
            ) {
                return {};
            }


            token.lastActive = now;

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        }
    },

    pages: {
        signIn: "/",
    },

    secret: process.env.NEXTAUTH_SECRET || "citydent-gizli-anahtar-2026",
});

export { handler as GET, handler as POST };