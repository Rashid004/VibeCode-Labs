import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Roast My Code 🔥",
  description: "Brutally honest, technically precise AI code review.",
  openGraph: {
    title: "Roast My Code 🔥",
    description: "Paste your code. Get roasted. Grow stronger.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
