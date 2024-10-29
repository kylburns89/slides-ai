import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import { ThemeToggle } from "./components/ThemeToggle";
import { APISettings } from "./components/APISettings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SlidesAI - Generate Presentations",
  description: "Generate Google Slides presentations from text or audio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-background">
            {children}
            <APISettings />
            <ThemeToggle />
            <Toaster 
              position="bottom-right"
              toastOptions={{
                className: 'bg-card text-foreground border border-border',
                style: {
                  background: 'var(--card)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
          </main>
        </Providers>
      </body>
    </html>
  );
}
