"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Project = {
  slug: string;
  title: string;
  description: string;
  tags?: string[];
  demoPath?: string;
};

function norm(s: string) {
  return (s ?? "").toLowerCase();
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<string>>(new Set());

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const p of projects) for (const t of p.tags ?? []) s.add(t);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = norm(query.trim());

    return projects.filter((p) => {
      const tags = p.tags ?? [];

      const matchesQuery =
        !q ||
        norm(p.title).includes(q) ||
        norm(p.description).includes(q) ||
        tags.some((t) => norm(t).includes(q));

      // AND filtering: project must contain ALL selected tags
      const matchesTags =
        active.size === 0 || Array.from(active).every((t) => tags.includes(t));

      return matchesQuery && matchesTags;
    });
  }, [projects, query, active]);

  function toggleTag(tag: string) {
    setActive((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function clearAll() {
    setQuery("");
    setActive(new Set());
  }

  return (
    <div className="space-y-5">
      {/* Search + Clear */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects (title, description, tags)…"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
        />
        <button
          type="button"
          onClick={clearAll}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition"
        >
          Clear
        </button>
      </div>

      {/* Tag chips */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const on = active.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={[
                "rounded-full px-3 py-1 text-xs transition border",
                on
                  ? "bg-white/15 border-white/30 text-white"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20",
              ].join(" ")}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <div className="text-xs text-white/60">
        Showing <span className="text-white/80">{filtered.length}</span> of{" "}
        <span className="text-white/80">{projects.length}</span>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            href={`/projects/${p.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-base font-medium">{p.title}</div>
              {p.demoPath ? (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70">
                  Demo
                </span>
              ) : null}
            </div>

            <p className="mt-2 text-sm text-white/70">{p.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {p.tags?.slice(0, 6).map((t) => (
                <span
                  key={`${p.slug}:${t}`}
                  className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4 text-sm text-white/80 group-hover:translate-x-1 transition">
              View →{" "}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
