import Link from "next/link";
import type { Project } from "@/lib/content";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="group block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-white">{p.title}</h3>

        {/* was p.folder — replaced with slug so build never breaks */}
        <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/70">
          {p.slug}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-white/70">{p.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {p.tags?.slice(0, 6).map((t) => (
          <span
            key={t}
            className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 text-sm text-white/60 group-hover:text-white/80 transition">
        View project →
      </div>
    </Link>
  );
}
