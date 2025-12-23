// app/projects/page.tsx
import { getProjects } from "@/lib/content";
import ProjectsGrid from "./projectsGrid";

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

      <ProjectsGrid projects={projects} />
    </main>
  );
}
