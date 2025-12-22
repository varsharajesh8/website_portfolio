// app/projects/page.tsx
import Link from "next/link";
import { getProjects } from "@/lib/content";

export const dynamic = "force-static"; // optional: stable in dev, avoids some churn

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="text-white/70 max-w-3xl">
          Selected coursework and independent projects with demos, write-ups, and artifacts.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p) => (
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
    </main>
  );
}
