import type { Metadata } from "next";
// import TopicNav from "@/components/TopicNav";
// import topics from "@/lib/topics";
import { Inter, Abril_Fatface, Outfit } from "next/font/google";
import Navigation from "@/components/Nav";
import LayoutWrapper from "@/components/LayoutWrapper";
import ConditionalFooter from "@/components/ConditionalFooter";
import { getCourseConfig } from "@/lib/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const abril = Abril_Fatface({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril"
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit"
});

const courseConfig = getCourseConfig();

export const metadata: Metadata = {
  title: courseConfig.title,
  description: courseConfig.description,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = theme === 'dark' || (!theme && prefersDark);
                  const html = document.documentElement;
                  if (shouldBeDark) {
                    html.classList.add('dark');
                    html.style.colorScheme = 'dark';
                  } else {
                    html.classList.remove('dark');
                    html.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} ${abril.variable} ${outfit.variable}`}>
        <Navigation />
        <LayoutWrapper>
          <main>
            {children}
          </main>
        </LayoutWrapper>
        <ConditionalFooter />
      </body>
    </html>
  );
}
