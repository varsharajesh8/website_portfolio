import Link from "next/link";

export const metadata = {
  title: "Fakebook Relational Database | Varsha Rajesh",
  description:
    "Designed and implemented a normalized relational database for a social media platform with ER modeling, SQL constraints, triggers, and external views.",
};

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#060914] text-white">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute left-1/2 top-[-140px] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-14">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs tracking-wider text-white/55">
              EECS 484 · Database Management Systems
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Fakebook Relational Database
            </h1>
            <p className="mt-3 max-w-2xl text-white/60">
              Designed and implemented a fully normalized relational database
              for a fictional social media platform, translating detailed
              business requirements into a robust schema with strict integrity
              guarantees.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "SQL",
                "Databases",
                "ER Modeling",
                "Triggers",
                "Data Integrity",
                "Oracle",
              ].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/projects"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur transition hover:bg-white/10 hover:text-white"
            >
              All projects
            </Link>
            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur transition hover:bg-white/10 hover:text-white"
            >
              Home
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 grid gap-6">
          {/* Overview */}
          <section className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-[1px] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="rounded-2xl bg-[#0b0f19]/70 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold">Overview</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                This project focused on database design rather than application
                logic or UI. Starting from a detailed specification, I modeled
                users, friendships, messages, photos, albums, tags, events, and
                participation using a normalized relational schema. The system
                enforces correctness through keys, constraints, triggers, and
                transactional data loading.
              </p>
            </div>
          </section>

          {/* What I Built */}
          <section className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-[1px] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="rounded-2xl bg-[#0b0f19]/70 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold">What I Built</h2>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  Designed a complete ER diagram capturing entities, attributes,
                  relationships, and participation constraints.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  Implemented SQL DDL scripts to create and drop tables,
                  constraints, sequences, and triggers.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  Wrote DML scripts to load data from a poorly structured public
                  dataset into a normalized schema.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  Created external views that exactly matched the public dataset
                  schema while sourcing data from redesigned tables.
                </li>
              </ul>
            </div>
          </section>

          {/* Key Challenges */}
          <section className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-[1px] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="rounded-2xl bg-[#0b0f19]/70 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold">
                Key Design Decisions & Challenges
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  Enforced symmetric friendships without duplicates using a
                  trigger that canonicalized user ID pairs.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  Modeled many-to-many relationships such as users–programs,
                  users–events, and users–photo tags.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  Managed circular foreign key dependencies using deferred
                  constraints and transactional inserts.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  Ensured strict schema fidelity, including column order, data
                  types, and naming, required for automated grading.
                </li>
                <li className="flex gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />
                  Wrote idempotent scripts that could be executed repeatedly
                  without failure.
                </li>
              </ul>
            </div>
          </section>

          {/* Honor Code */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-sm font-semibold tracking-wide">
              Code Availability
            </h3>
            <p className="mt-2 text-sm text-white/65">
              This project was completed as part of EECS 484 at the University of
              Michigan. Source code, SQL scripts, and ER diagrams are not publicly
              shared in accordance with course honor code policies.
            </p>
            <p className="mt-1 text-sm text-white/65">
              This page highlights database design decisions, integrity
              constraints, and system behavior rather than implementation
              details.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
