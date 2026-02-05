import Link from "next/link";

type ExperienceItem = {
  company: string;
  team?: string;
  role: string;
  location?: string;
  start: string;
  end: string;
  bullets: string[];
  skills?: string[];
  // optional: short label for badge (otherwise auto from company initials)
  badge?: string;
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
      "Partnered with engineering and product to ship improvements into production pipelines.",
    ],
    skills: ["Python", "SQL", "Geospatial", "Data Modeling", "ETL"],
    badge: "PV",
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
      "Collaborated with researchers to align outputs with compliance and governance expectations.",
    ],
    skills: ["Python", "Computer Vision", "Privacy", "Data Governance"],
    badge: "MM",
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
      "Iterated on prompting and error analysis to improve reliability across model families.",
    ],
    skills: ["Python", "NLP", "Experiment Design", "Data Analysis"],
    badge: "UM",
  },
];

function initials(company: string) {
  const parts = company.replace(/&/g, " ").split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
  return letters || company.slice(0, 2).toUpperCase();
}

function SkillPill({ s }: { s: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
      {s}
    </span>
  );
}

function ExperienceCard({
  item,
  isLast,
}: {
  item: ExperienceItem;
  isLast: boolean;
}) {
  const badge = item.badge ?? initials(item.company);

  return (
    <div className="grid grid-cols-[28px_1fr] gap-5">
      {/* Timeline rail */}
      <div className="relative flex justify-center">
        <div className="mt-2 h-3 w-3 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.08)]" />
        {!isLast && (
          <div className="absolute top-6 h-full w-px bg-gradient-to-b from-white/20 to-white/5" />
        )}
      </div>

      {/* Gradient border wrapper */}
      <div className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-[1px] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        {/* Card */}
        <div className="rounded-2xl bg-[#0b0f19]/70 p-6 backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              {/* Company badge */}
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-sm font-semibold text-white ring-1 ring-white/10">
                {badge}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="text-base font-semibold text-white">
                    {item.role}
                  </h3>
                  <span className="text-white/40">·</span>
                  <p className="text-sm font-medium text-white/80">
                    {item.company}
                  </p>
                </div>

                <p className="mt-1 text-sm text-white/55">
                  {item.team ? `${item.team} · ` : ""}
                  {item.location ?? ""}
                </p>
              </div>
            </div>

            {/* Date pill */}
            <div className="w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur sm:mt-1">
              {item.start} — {item.end}
            </div>
          </div>

          {/* Bullets */}
          <ul className="mt-5 space-y-2 text-sm leading-relaxed text-white/78">
            {item.bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* Skills */}
          {(item.skills?.length ?? 0) > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {item.skills!.map((s) => (
                <SkillPill key={s} s={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <main className="relative min-h-screen bg-[#060914] text-white">
      {/* Subtle background grid + glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute left-1/2 top-[-120px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-14">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Experience
            </h1>
            <p className="mt-2 max-w-xl text-white/60">
              Roles and impact across research, product, and data systems.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur transition hover:bg-white/10 hover:text-white"
          >
            Home
          </Link>
        </div>

        <div className="mt-10 space-y-7">
          {EXPERIENCE.map((item, idx) => (
            <ExperienceCard
              key={`${item.company}-${item.role}-${idx}`}
              item={item}
              isLast={idx === EXPERIENCE.length - 1}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
