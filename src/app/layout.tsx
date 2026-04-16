import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Script from "next/script";
import {
  BUSINESS_INSTAGRAM_URL,
  BUSINESS_LOGO,
  BUSINESS_NAME,
  BUSINESS_TWITTER_URL,
  BUSINESS_TYPE,
  BUSINESS_URL,
} from "@/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const globalStructuredData = {
  "@context": "https://schema.org",
  "@type": BUSINESS_TYPE,
  name: BUSINESS_NAME,
  url: BUSINESS_URL,
  logo: BUSINESS_LOGO,
  sameAs: [BUSINESS_INSTAGRAM_URL, BUSINESS_TWITTER_URL],
};

export const metadata: Metadata = {
  title: "D.I.P",
  description:
    "D.I.P is a tool that helps you create and manage your own AI agents. With D.I.P, you can easily create agents that can perform various tasks, such as answering questions, generating content, and more. D.I.P is designed to be user-friendly and accessible to everyone, regardless of their technical background.",
  metadataBase: new URL(BUSINESS_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <head>
        <Script
          id="structured-data-global"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalStructuredData),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
