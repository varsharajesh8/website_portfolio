import Link from "next/link";

export const metadata = {
  title: "LC-2K Toolchain (Assembler + Simulator) | Varsha Rajesh",
  description:
    "Built a two-pass assembler and behavioral simulator for the LC-2K ISA, plus an LC-2K multiplication program and test suites.",
};

export default function Page() {
  return (
    <main className="relative min-h-screen bg-[#060914] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute left-1/2 top-[-140px] h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-14">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs tracking-wider text-white/55">EECS 370 · Winter 2026</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              LC-2K Toolchain: Assembler + Simulator
            </h1>
            <p className="mt-3 max-w-2xl text-white/60">
              Implemented a two-pass assembler (symbol resolution + machine code emission), a behavioral
              LC-2K simulator (full state trace per instruction), and an LC-2K assembly multiplication program.
              Built comprehensive test suites designed to expose buggy reference implementations.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {["C (C99)", "Systems", "Bit Manipulation", "ISA", "Testing"].map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
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
          <section className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-[1px] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="rounded-2xl bg-[#0b0f19]/70 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold">What this project does</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Assembler (Two-pass)</p>
                  <p className="mt-2 text-sm text-white/65">
                    Parses LC-2K assembly, builds a symbol table (pass 1), then emits 32-bit machine code in hex (pass 2),
                    including label resolution for <span className="text-white/80">lw/sw/beq</span> and <span className="text-white/80">.fill</span>.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Simulator (Behavioral)</p>
                  <p className="mt-2 text-sm text-white/65">
                    Loads a machine code file into memory, initializes registers/PC, and simulates the ISA.
                    Prints the full machine state before each instruction and once at halt.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">Testing + Multiplication</p>
                  <p className="mt-2 text-sm text-white/65">
                    Wrote targeted test cases to catch undefined labels, bad opcodes, offset bounds issues, and edge behaviors.
                    Also implemented LC-2K multiplication under instruction + cycle constraints.
                  </p>
                </div>
              </div>

              {/* Honor code */}
              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Code availability</p>
                <p className="mt-1 text-sm text-white/65">
                  Source code is not publicly shared due to course policy. This page focuses on the system design,
                  behavior, and verified outputs from reference test programs.
                </p>
              </div>
            </div>
          </section>


          {/* Key takeaways */}
          <section className="rounded-2xl bg-gradient-to-b from-white/10 to-white/5 p-[1px] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
            <div className="rounded-2xl bg-[#0b0f19]/70 p-6 backdrop-blur">
              <h2 className="text-lg font-semibold">Key engineering challenges</h2>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li className="flex gap-3"><span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />Label resolution and correct offset calculation for beq (PC-relative).</li>
                <li className="flex gap-3"><span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />Correct 16-bit sign extension for offsets in lw/sw/beq in the simulator.</li>
                <li className="flex gap-3"><span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />Strict I/O formatting and error handling (exit codes) for autograder compatibility.</li>
                <li className="flex gap-3"><span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/60" />Mutation-testing mindset: constructing minimal tests that expose buggy implementations.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
