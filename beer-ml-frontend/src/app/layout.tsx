import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import FloatingParticles from '@/components/FloatingParticles'
import GlowCursor from '@/components/GlowCursor'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Beer Preference Study | Ultra Premium AI Experience",
  description: "An ultra-modern research platform powered by AI for understanding beer preferences through advanced taste profiling with premium glassmorphism design.",
  keywords: ["beer", "AI", "research", "taste", "preferences", "study", "premium", "glassmorphism"],
  authors: [{ name: "AI Research Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-black text-white font-light cursor-none`}
      >
        <FloatingParticles />
        <GlowCursor />
        
        <div className="relative overflow-hidden">
          {/* Enhanced background ambient orbs with premium effects */}
          <div className="floating-orb w-96 h-96 top-10 left-10 opacity-30 loading-pulse" />
          <div className="floating-orb w-64 h-64 top-1/2 right-20 opacity-20 loading-pulse" style={{ animationDelay: '2s' }} />
          <div className="floating-orb w-48 h-48 bottom-20 left-1/3 opacity-25 loading-pulse" style={{ animationDelay: '4s' }} />
          
          {/* Ultra-premium gradient overlays */}
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10 pointer-events-none z-10" />
          <div className="fixed inset-0 bg-gradient-to-tr from-transparent via-purple-500/5 to-transparent pointer-events-none z-10" />
          
          {children}
        </div>
      </body>
    </html>
  );
}
