"use client";

import * as React from "react";
import type { Project } from "@/lib/content";
import { ProjectCard } from "@/components/ProjectCard";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [q, setQ] = React.useState("");
  const tags = React.useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [projects]);

  const [activeTag, setActiveTag] = React.useState<string>("");

  const filtered = projects.filter((p) => {
    const matchesQ =
      !q ||
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.description.toLowerCase().includes(q.toLowerCase()) ||
      p.folder.toLowerCase().includes(q.toLowerCase());
    const matchesTag = !activeTag || p.tags.includes(activeTag);
    return matchesQ && matchesTag;
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects…"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-white/20"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag("")}
            className={[
              "rounded-full px-3 py-2 text-xs transition",
              activeTag === "" ? "bg-white text-black" : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            ].join(" ")}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTag(t)}
              className={[
                "rounded-full px-3 py-2 text-xs transition",
                activeTag === t ? "bg-white text-black" : "border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-white/60">
        Showing <span className="text-white">{filtered.length}</span> of <span className="text-white">{projects.length}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((p) => (
          <ProjectCard key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
}