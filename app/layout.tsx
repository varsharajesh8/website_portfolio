import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Varsha Rajesh — Projects & Writing",
  description: "Portfolio: data projects, interactive demos, and write-ups.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white antialiased">
        <ThemeProvider>
          <div className="fixed inset-0 -z-10 bg-grid opacity-30" />
          <div className="pointer-events-none fixed inset-0 -z-10">
            <div className="gradient-blob absolute left-[-120px] top-[-120px] h-[420px] w-[420px] rounded-full bg-white/20" />
            <div className="gradient-blob absolute right-[-120px] top-[120px] h-[520px] w-[520px] rounded-full bg-white/15" />
            <div className="gradient-blob absolute bottom-[-160px] left-[25%] h-[520px] w-[520px] rounded-full bg-white/10" />
          </div>

          <Nav />
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}