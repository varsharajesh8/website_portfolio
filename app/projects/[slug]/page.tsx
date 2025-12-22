import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjects, getProject } from "@/lib/content";
import { CodeViewer } from "@/components/CodeViewer";
import CodeRestrictionModal from "@/components/CodeRestrictionModal";
import ProjectTabs from "@/components/ProjectTabs";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;

  const p = getProject(slug);
  if (!p) notFound();

  const files = p.files ?? [];
  const isRestricted = Boolean(p.restricted);
  const demoPath = p.demoPath;

  const baseUrl =
    p.slug === "image-resizer" ? "/assets/demos/image-resizer" : `/assets/projects/${p.slug}`;

  const imageFiles = files.filter((f) => /\.(png|jpe?g|gif|webp|svg)$/i.test(f));
  const pdfFiles = files.filter((f) => f.toLowerCase().endsWith(".pdf"));
  const sourceFiles = files.filter(
    (f) => !f.toLowerCase().endsWith(".pdf") && !imageFiles.includes(f)
  );

  // ✅ ONLY these get the interactive demo UI
  const TABBED_DEMO_SLUGS = new Set([
    "p4-drone-delivery",
    "forum-post-project",
    "image-resizer",
    "letterman",
    "p3-logman",
    "stocks",
  ]);

  const useTabbedLayout = TABBED_DEMO_SLUGS.has(p.slug);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">{p.title}</h1>

          <div className="flex gap-2">
            {demoPath ? (
              <Link
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                href={demoPath}
              >
                Live Demo
              </Link>
            ) : null}

            <Link
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              href="/projects"
            >
              Back
            </Link>
          </div>
        </div>

        <p className="max-w-3xl text-white/70">{p.description}</p>

        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70"
            >
              {t}
            </span>
          ))}
        </div>

        {isRestricted ? <CodeRestrictionModal /> : null}
      </div>

      {/* ================= DEMO PROJECTS ================= */}
      {useTabbedLayout ? (
        <ProjectTabs
          isRestricted={isRestricted}
          demoPath={demoPath}
          imageFiles={imageFiles}
          pdfFiles={pdfFiles}
          nonPdfFiles={sourceFiles}
          baseUrl={baseUrl}
          CodeViewer={<CodeViewer key="code-viewer" baseUrl={baseUrl} files={sourceFiles} />}
        />
      ) : (
        <>
          {/* ================= NON-DEMO PROJECTS ================= */}

          {/* Artifacts */}
          {pdfFiles.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold">Artifacts</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {pdfFiles.map((f) => {
                  const url = encodeURI(`${baseUrl}/${f}`);
                  return (
                    <a
                      key={f}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
                    >
                      <div className="font-medium text-white">{f}</div>
                      <div className="mt-1 text-sm text-white/60">Open PDF →</div>
                    </a>
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* Source (simple list, NOT CodeViewer) */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Source Files</h2>

            {isRestricted ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/75">
                Source code is not publicly available due to University of Michigan academic
                integrity policy.
              </div>
            ) : sourceFiles.length > 0 ? (
              <ul className="rounded-2xl border border-white/10 bg-white/5 divide-y divide-white/10">
                {sourceFiles.map((f) => (
                  <li key={f} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-white/80">{f}</span>
                    <a
                      href={`${baseUrl}/${encodeURIComponent(f)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-white/60 underline hover:text-white"
                    >
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-white/60 text-sm">No public source files.</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
