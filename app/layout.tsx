import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const title = "Welcome Itzfizz | Scroll-Driven Hero Animation";
const description =
  "A scroll-driven hero section built with Next.js, GSAP ScrollTrigger, Lenis and Tailwind CSS. Web Development Internship assignment for Itzfizz Digital by Iraa Garg.";

export const metadata: Metadata = {
  metadataBase: new URL("https://iraagarg.github.io"),
  title,
  description,
  authors: [{ name: "Iraa Garg", url: "https://github.com/iraagarg" }],
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://iraagarg.github.io/itzfizz-hero-animation/",
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#d1d1d1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} antialiased`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
