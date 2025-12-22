export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold">About Me</h1>

      <p className="mt-4 text-white/80 leading-relaxed">
        Hi, I’m <span className="font-medium text-white">Varsha Rajesh</span>. I’m
        a Data Science major at the University of Michigan&apos;s College of Engineering,
        expecting to graduate in April 2027. I am a dedicated student who enjoys building
        practical systems and experimenting with ML/NLP. I’m looking for{" "}
        <span className="font-medium text-white">
          Data Science / Data Analyst / ML internship
        </span>{" "}
        roles and I like projects that are hands-on, measurable, and have important effects.
      </p>

      <div className="mt-8 space-y-4">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-medium">What I work on</h2>
          <ul className="mt-2 list-disc pl-5 text-white/80 space-y-1">
            <li>Data analysis, simulation, and statistical modeling (R, Python, SQL)</li>
            <li>Machine learning + NLP experiments (classification + generation)</li>
            <li>Systems/algorithms in C++, Python (graphs, MST/TSP, log search)</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-medium">Quick highlights</h2>
          <ul className="mt-2 list-disc pl-5 text-white/80 space-y-1">
            <li>Stats 406 ICU capacity exceedance risk modeling (Monte Carlo)</li>
            <li>EECS 281 Drone Delivery: MST + FASTTSP + OPTTSP</li>
            <li>Homemade LSTM text generation + author prediction NN</li>
            <li>MRI Alzheimer’s detection project with live demo link</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-lg font-medium">Contact</h2>

          {/* ✅ FIX: <li> must be inside <ul>, not <p> */}
          <ul className="mt-2 list-disc pl-5 text-white/80 space-y-1">
            <li>
              LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/varsha-rajesh08"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
              >
                www.linkedin.com/in/varsha-rajesh08
              </a>
            </li>
            <li>
              Email:{" "}
              <a
                href="mailto:varajesh@umich.edu"
                className="underline hover:text-white"
              >
                varajesh@umich.edu
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="https://www.github.com/varsharajesh"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
              >
                www.github.com/varsharajesh
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
