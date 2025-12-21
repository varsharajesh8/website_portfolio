"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "./utils";
import { Github, Linkedin, FileText } from "lucide-react";

const nav = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/playground", label: "Playground" },
  { href: "/resume", label: "Resume" }
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-white/80 group-hover:animate-pulse" />
          <span className="text-sm font-semibold tracking-wide text-white/90">Varsha Rajesh</span>
        </Link>

        <nav className="hidden gap-1 md:flex">
          {nav.map((i) => {
            const active = pathname === i.href || (i.href !== "/" && pathname.startsWith(i.href));
            return (
              <Link
                key={i.href}
                href={i.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition",
                  active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {i.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-white"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            title="GitHub (replace link)"
          >
            <Github size={18} />
          </a>
          <a
            className="rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-white"
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn (replace link)"
          >
            <Linkedin size={18} />
          </a>
          <Link
            className="rounded-full p-2 text-white/70 hover:bg-white/5 hover:text-white"
            href="/resume"
            aria-label="Resume"
            title="Resume"
          >
            <FileText size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}