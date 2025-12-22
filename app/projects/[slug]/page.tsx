import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjects, getProject } from "@/lib/content";
import { CodeViewer } from "@/components/CodeViewer";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;

  const p = getProject(slug);
  if (!p) return notFound();

  const baseUrl = `/assets/projects/${p.slug}`;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">{p.title}</h1>
          <div className="flex gap-2">
            <a
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              href={baseUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open folder
            </a>
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

        {p.links ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(p.links).map(([k, href]) => {
              const label =
                k === "github"
                  ? "GitHub"
                  : k === "demo"
                    ? "Live demo"
                    : k === "dataset"
                      ? "Dataset"
                      : k;
              return (
                <a
                  key={k}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label}
                </a>
              );
            })}
          </div>
        ) : null}
      </div>

      {p.hasPdf ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Artifacts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {p.files
              .filter((f) => f.toLowerCase().endsWith(".pdf"))
              .map((f) => (
                <div
                  key={f}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <div className="text-sm text-white/80">{f}</div>
                    <a
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
                      href={`${baseUrl}/${encodeURIComponent(f)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open
                    </a>
                  </div>
                  <iframe
                    src={`${baseUrl}/${encodeURIComponent(f)}#view=FitH`}
                    className="h-[520px] w-full"
                    title={f}
                  />
                </div>
              ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold">Source</h2>
          <a
            className="text-sm text-white/60 underline hover:text-white"
            href={`${baseUrl}/`}
            target="_blank"
            rel="noreferrer"
          >
            Browse raw files
          </a>
        </div>

        <CodeViewer
          baseUrl={baseUrl}
          files={p.files.filter((f) => !f.toLowerCase().endsWith(".pdf"))}
        />
      </section>
    </div>
  );
}
