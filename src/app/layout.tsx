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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
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
              
              // Handle trailing slash redirects for static export
              (function() {
                const path = window.location.pathname;
                const basePath = '/spring2026';
                // Remove basePath from path for checking
                const pathWithoutBase = path.startsWith(basePath) ? path.slice(basePath.length) : path;
                // If path ends with / and is not just / or /basePath/, redirect to version without trailing slash
                if (pathWithoutBase.endsWith('/') && pathWithoutBase !== '/') {
                  const newPath = path.slice(0, -1);
                  window.location.replace(newPath);
                }
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
