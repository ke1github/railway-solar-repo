// app/layout.tsx
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Railway Solar App",
  description: "2.5 MW KGP Railway Solar Project Monitoring Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          "min-h-screen bg-background text-foreground"
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <DashboardLayout>{children}</DashboardLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
