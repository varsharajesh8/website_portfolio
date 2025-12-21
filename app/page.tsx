import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] items-start">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Actively seeking Data / ML internships
          </div>

          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
            Hi, I’m <span className="text-white">Varsha Rajesh</span>.
          </h1>

          <p className="mt-4 text-white/75 leading-relaxed">
            This is my portfolio: a place to explore my projects in data science,
            machine learning, and systems. You’ll find interactive demos, write-ups,
            and code-backed work I’ve built through coursework and personal projects.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-xl bg-white text-black px-5 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              View Projects
            </Link>

            <Link
              href="/playground"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              Try Data Playground
            </Link>

            <Link
              href="/about"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              About Me
            </Link>
          </div>

          <div className="mt-6 text-sm text-white/60">
            Tip: recruiters — start with <span className="text-white/80">Projects</span>, then try the{" "}
            <span className="text-white/80">Playground</span>.
          </div>
        </div>

        {/* Photo card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10">
            {/* Change src to your real filename in /public */}
            <Image
              src="/assets/headshot.jpeg"
              alt="Varsha Rajesh"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-4">
            <div className="text-lg font-medium">Varsha Rajesh</div>
            <div className="mt-1 text-sm text-white/70">
              Data • ML • Systems • Visualization
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
              Python
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
              SQL
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
              C++
            </span>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
              Next.js
            </span>
          </div>
        </div>
      </section>

      {/* What’s inside */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">What you’ll find here</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Link
            href="/projects"
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
          >
            <div className="text-base font-medium">Projects</div>
            <p className="mt-2 text-sm text-white/70">
              Coursework + independent work with short, clear summaries and links.
            </p>
            <div className="mt-3 text-sm text-white/80 group-hover:translate-x-1 transition">
              Explore → 
            </div>
          </Link>

          <Link
            href="/playground"
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
          >
            <div className="text-base font-medium">Data Playground</div>
            <p className="mt-2 text-sm text-white/70">
              Upload a CSV and visualize columns quickly (great for demos).
            </p>
            <div className="mt-3 text-sm text-white/80 group-hover:translate-x-1 transition">
              Try it → 
            </div>
          </Link>

          <Link
            href="/about"
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
          >
            <div className="text-base font-medium">About</div>
            <p className="mt-2 text-sm text-white/70">
              A quick story: what I’m interested in and what roles I’m targeting.
            </p>
            <div className="mt-3 text-sm text-white/80 group-hover:translate-x-1 transition">
              Read → 
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
