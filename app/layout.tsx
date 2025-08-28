// app/layout.tsx
import "./globals.css";
import { Inter, Figtree } from "next/font/google";
import { Metadata } from "next";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/layout";
import { DataProvider } from "@/lib/context/DataContext";
import initMockData from "@/lib/mock-data-init";

// Load Figtree font - clean, professional and modern
const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Railway Solar Management",
  description:
    "Professional management platform for 2.5 MW KGP Railway Solar Project",
};

// Initialize mock data
initMockData()
  .then((result) => {
    if (result.success) {
      console.log("Mock data initialized successfully");
    } else {
      console.error("Failed to initialize mock data:", result.error);
    }
  })
  .catch((err) => {
    console.error("Error during mock data initialization:", err);
  });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={figtree.variable}>
      <body
        className={cn("min-h-screen bg-background text-foreground font-sans")}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <DataProvider>
            <DashboardLayout>{children}</DashboardLayout>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
