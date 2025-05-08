import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { APP_NAME } from "@/lib/constants";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Your personal offline-first todo list manager.",
  manifest: "/manifest.json", // For PWA capabilities
  icons: {
    apple: "/apple-touch-icon.png", // Example, ensure these exist in /public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
