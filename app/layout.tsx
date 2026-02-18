import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Celerey | Enterprise",
    template: "%s | Celerey",
  },
  description:
    "Celerey Enterprise helps teams plan wealth with clarity—aligning goals, tracking progress, and making confident financial decisions.",
  applicationName: "Celerey",
  metadataBase: new URL("https://celerey.co"),
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Celerey | Enterprise",
    description:
      "Plan wealth with clarity. Align goals, track progress, and make confident decisions with Celerey Enterprise.",
    url: "https://celerey.com",
    siteName: "Celerey",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Celerey Enterprise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Celerey | Enterprise",
    description:
      "Plan wealth with clarity. Align goals, track progress, and make confident decisions with Celerey Enterprise.",
    images: ["/og.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
