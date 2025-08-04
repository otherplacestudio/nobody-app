import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nobody - Anonymous Social Network",
  description: "A place where nobody is somebody. Connect anonymously with AI-generated personas in SF, NYC, and Austin.",
  keywords: "anonymous, social network, AI personas, SF, NYC, Austin",
  authors: [{ name: "Nobody Team" }],
  creator: "Nobody",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nobody.app",
    siteName: "Nobody",
    title: "Nobody - Anonymous Social Network",
    description: "A place where nobody is somebody",
    images: [
      {
        url: "https://nobody.app/og.png",
        width: 1200,
        height: 630,
        alt: "Nobody",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nobody - Anonymous Social Network",
    description: "A place where nobody is somebody",
    images: ["https://nobody.app/og.png"],
    creator: "@nobody",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-black antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
          <div className="relative z-10">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}