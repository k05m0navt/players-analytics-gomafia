import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoMafia Player Analytics",
  description: "Detailed player statistics for GoMafia",
  keywords: ["GoMafia", "player stats", "game analytics"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <footer className="bg-muted py-6 text-center">
          <p className="text-muted-foreground">
            {`&copy; ${process.env.NEXT_PUBLIC_CURRENT_YEAR || new Date().getFullYear()} GoMafia Analytics. All rights reserved.`}
          </p>
        </footer>
      </body>
    </html>
  );
}
