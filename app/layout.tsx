import type { Metadata } from "next";
import { Pinyon_Script, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";
import BackgroundHero from "@/components/BackgroundHero";

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon",
  weight: "400",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodLens",
  description: "Hello, hungry friend. Let's find something delicious today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pinyonScript.variable} ${playfair.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <BackgroundHero>
          {children}
        </BackgroundHero>
      </body>
    </html>
  );
}
