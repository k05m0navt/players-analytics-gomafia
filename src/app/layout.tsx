import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalErrorBoundary } from "@/components/error-boundary/global-error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoMafia Players Analytics",
  description: "Detailed player statistics for GoMafia",
  keywords: ["GoMafia", "player stats", "game analytics"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalErrorBoundary>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <footer className="bg-muted py-6 text-center">
              <p className="text-muted-foreground">
                {`&copy; ${
                  process.env.NEXT_PUBLIC_CURRENT_YEAR ||
                  new Date().getFullYear()
                } GoMafia Analytics. All rights reserved.`}
              </p>
            </footer>
          </GlobalErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
