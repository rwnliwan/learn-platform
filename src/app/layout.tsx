import type { Metadata } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Learn Platform",
  description: "Interactive learning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="light" suppressHydrationWarning>
      <head>
        {/* PWA (Learn v2): manifest + theme color; SW didaftarkan oleh SWRegister hanya saat production. */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#B45309" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
        {/* Schema.org Person — Septian Panjaya */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Septian Panjaya",
              url: "https://www.linkedin.com/in/septian-panjaya",
              jobTitle: "Finance Risk Analytics",
              knowsAbout: ["Credit Risk", "Fraud/AML Analytics", "Financial Modeling", "Financial Statement Analysis"],
              sameAs: [
                "https://www.linkedin.com/in/septian-panjaya",
                "https://github.com/rwnliwan",
                "https://fmva-sprint.pages.dev/",
                "https://fsa-lab.pages.dev/",
                "https://credit-desk-afy.pages.dev/",
                "https://investment-desk.pages.dev/",
                "https://simulator-fmva.pages.dev/",
                "https://learn-platform-cyo.pages.dev/v2",
                "https://radar.omdanny.site/",
              ],
            }),
          }}
        />
      </head>
      <body>
        <div style={{ position: "fixed", top: "12px", right: "12px", zIndex: 100 }}>
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
