"use client";

import { useMemo, useState } from "react";

type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
};

function normalize(s: string) {
  return s.toLowerCase().trim();
}

export function ProjectsFilter({
  projects,
  renderProject,
}: {
  projects: Project[];
  renderProject: (p: Project) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const allTags = useMemo(() => {
    const s = new Set<string>();
    for (const p of projects) for (const t of p.tags ?? []) s.add(t);
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = normalize(query);

    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        normalize(p.title).includes(q) ||
        normalize(p.description).includes(q) ||
        (p.tags ?? []).some((t) => normalize(t).includes(q));

      const matchesTags =
        activeTags.size === 0 || (p.tags ?? []).some((t) => activeTags.has(t));

      return matchesQuery && matchesTags;
    });
  }, [projects, query, activeTags]);

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function clearAll() {
    setQuery("");
    setActiveTags(new Set());
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-white/20"
        />

        <button
          type="button"
          onClick={clearAll}
          className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm hover:border-white/20"
        >
          Clear
        </button>
      </div>

      {/* Tag chips */}
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const on = activeTags.has(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={[
                "rounded-full border px-3 py-1 text-xs transition",
                on
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-black/10 hover:border-white/20",
              ].join(" ")}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="text-xs text-white/60">
        Showing <span className="text-white/80">{filtered.length}</span> of{" "}
        <span className="text-white/80">{projects.length}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => renderProject(p))}
      </div>
    </div>
  );
}
