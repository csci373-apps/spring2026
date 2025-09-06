import type { Metadata } from "next";
// import TopicNav from "@/components/TopicNav";
// import topics from "@/lib/topics";
import { Inter, Abril_Fatface, Poppins } from "next/font/google";
import Navigation from "@/components/Nav";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const abril = Abril_Fatface({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril"
});

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "CSCI 373 Course Website",
  description: "Course materials and resources for CSCI 373",
  icons: {
    icon: '/favicon.ico', // or '/your-favicon.png'
    // apple: '/apple-touch-icon.png', // for iOS devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${abril.variable} ${poppins.variable}`}>
        <Navigation />
        <LayoutWrapper>
          <main className="max-w-4xl mx-auto px-4">
            {children}
          </main>
        </LayoutWrapper>
      </body>
    </html>
  );
}
