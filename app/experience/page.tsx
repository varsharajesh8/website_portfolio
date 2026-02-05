// app/experience/page.tsx
import Link from "next/link";

type ExperienceItem = {
  company: string;
  team?: string;
  role: string;
  location?: string;
  start: string; // e.g., "Sep 2025"
  end: string;   // e.g., "Present"
  bullets: string[];
  skills?: string[];
  links?: { label: string; href: string }[];
};

const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Propvia",
    role: "Data & AI Intern",
    location: "Detroit, MI (Hybrid)",
    start: "Jan 2026",
    end: "Present",
    bullets: [
      "Built and validated property-level features from multi-source datasets to improve scoring and recommendations.",
      "Developed data quality checks and explainability-friendly outputs to support product decisions.",
      "Partnered with engineering and product to ship improvements into production pipelines."
    ],
    skills: ["Python", "SQL", "Geospatial", "Data Modeling", "ETL"],
  },
  {
    company: "Michigan Medicine",
    team: "Cardiac Surgery & Robotics",
    role: "Surgical Data De-Identification Research Intern",
    location: "Ann Arbor, MI",
    start: "May 2025",
    end: "Present",
    bullets: [
      "Designed privacy-preserving workflows for surgical video annotation and downstream analysis.",
      "Built tooling to standardize labeling, audit data handling, and reduce manual review overhead.",
      "Collaborated with researchers to align outputs with compliance and governance expectations."
    ],
    skills: ["Python", "Computer Vision", "Privacy", "Data Governance"],
  },
  {
    company: "University of Michigan Medical School",
    role: "Research Intern (LLM Evaluation for Bioinformatics)",
    location: "Ann Arbor, MI",
    start: "Sep 2024",
    end: "May 2025",
    bullets: [
      "Evaluated LLMs on bioinformatics-style tasks using reproducible protocols and structured metrics.",
      "Built analysis scripts and reporting artifacts to support posters and manuscript review.",
      "Iterated on prompting and error analysis to improve reliability across model families."
    ],
    skills: ["Python", "NLP", "Experiment Design", "Data Analysis"],
  },
];

function ExperienceCard({ item, isLast }: { item: ExperienceItem; isLast: boolean }) {
  return (
    <div className="grid grid-cols-[28px_1fr] gap-4">
      {/* Timeline rail */}
      <div className="relative flex justify-center">
        <div className="mt-2 h-3 w-3 rounded-full bg-black" />
        {!isLast && (
          <div className="absolute top-5 h-full w-px bg-black/15" />
        )}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-base font-semibold">
              {item.role} <span className="font-normal text-black/60">·</span>{" "}
              <span className="text-black/80">{item.company}</span>
            </div>
            <div className="text-sm text-black/60">
              {item.team ? `${item.team} · ` : ""}
              {item.location ?? ""}
            </div>
          </div>

          <div className="shrink-0 text-sm text-black/60 sm:text-right">
            {item.start} — {item.end}
          </div>
        </div>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-black/80">
          {item.bullets.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>

        {(item.skills?.length ?? 0) > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.skills!.map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-black/70"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {(item.links?.length ?? 0) > 0 && (
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {item.links!.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="underline decoration-black/20 underline-offset-4 hover:decoration-black/60"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Experience</h1>
          <p className="mt-2 text-black/60">
            A timeline of roles, impact, and what I built along the way.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm underline decoration-black/20 underline-offset-4 hover:decoration-black/60"
        >
          Back home
        </Link>
      </div>

      <div className="mt-10 space-y-6">
        {EXPERIENCE.map((item, idx) => (
          <ExperienceCard
            key={`${item.company}-${item.role}-${idx}`}
            item={item}
            isLast={idx === EXPERIENCE.length - 1}
          />
        ))}
      </div>
    </main>
  );
}
