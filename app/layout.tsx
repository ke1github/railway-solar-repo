// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/shared/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Railway Solar App",
  description: "2.5 MW KGP Railway Solar Project Monitoring Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="min-h-screen">
            {/* Ultra-clean top header */}
            <header className="border-b border-border bg-background">
              <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="text-center">
                  <h1 className="text-xl font-semibold text-foreground">
                    Solar Project Monitoring Platform
                  </h1>
                </div>
              </div>
            </header>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
