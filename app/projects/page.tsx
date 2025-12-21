import { getProjects } from "@/lib/content";
import { ProjectsGrid } from "./projects-grid";

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <p className="max-w-2xl text-white/70">
          Code-first projects + research artifacts. Use search + tags to filter. Each project page includes source files and
          (when available) embedded PDFs.
        </p>
      </div>
      <ProjectsGrid projects={projects} />
    </div>
  );
}