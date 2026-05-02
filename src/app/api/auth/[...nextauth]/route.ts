import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Şimdilik test için sabit kullanıcılar tanımlıyoruz
        const users = [
          { id: "1", email: "admin@citydent.com", password: "password123", role: "MASTER" },
          { id: "2", email: "staff@citydent.com", password: "staff123", role: "STAFF" }
        ];

        // Girilen bilgiler listedekilerle eşleşiyor mu bakıyoruz
        const user = users.find(u => 
          u.email === credentials?.email && 
          u.password === credentials?.password
        );

        if (user) {
          return user; // Bilgiler doğruysa kullanıcıyı içeri al
        }

        return null; // Bilgiler yanlışsa girişi reddet
      }
    })
  ],
  callbacks: {
    // Session içine rol bilgisini ekliyoruz ki Dashboard'da kim olduğunu bilelim
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/login', // Hata olursa login sayfasına geri döner
  },
  secret: process.env.NEXTAUTH_SECRET || "citydent-gizli-anahtar-2026",
});

export { handler as GET, handler as POST };