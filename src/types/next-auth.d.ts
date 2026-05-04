import type { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id:   string;
            role: "MASTER" | "STAFF";
        } & DefaultSession["user"];
    }

    interface User {
        id:   string;
        role: "MASTER" | "STAFF";
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id:   string;
        role: "MASTER" | "STAFF";
    }
}