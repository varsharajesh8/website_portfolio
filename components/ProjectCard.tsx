import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glow transition hover:border-white/20"
    >
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/15" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-white">{p.title}</h3>
          <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/70">
            {p.folder}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{p.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}