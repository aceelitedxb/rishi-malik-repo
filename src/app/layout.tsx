import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rishi Malik - Dubai's Ultra-Luxury Property Expert | ACE Elite Properties",
  description: "CEO of ACE Elite Properties | Trusted Partner for Ultra-Luxury Homes in Dubai. Specializing in exclusive properties with Emaar, Damac, Omniyat, Binghatti, and Ellington.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
