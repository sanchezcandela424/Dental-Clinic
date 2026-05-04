import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Providers from "@/app/_components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bs" className={inter.variable}>
    <body className="font-sans antialiased">
    <Providers>
      {children}
    </Providers>
    </body>
    </html>
  );
}