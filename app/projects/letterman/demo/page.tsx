// app/projects/letterman/demo/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";

type SpecOption = {
  id: string;
  label: string;
  file: string;
};

type OutputOption = {
  id: string;
  label: string;
  file: string;
};

const SPEC_OPTIONS: SpecOption[] = [
  { id: "simple", label: "Spec (Simple)", file: "spec-simple.txt" },
  { id: "complex", label: "Spec (Complex)", file: "spec-complex.txt" },
];

const OUTPUT_OPTIONS: OutputOption[] = [
  { id: "queue-word", label: "Expected: Queue + Word Output", file: "spec-queue-word-output.txt" },
  { id: "stack-word", label: "Expected: Stack + Word Output", file: "spec-stack-word-output.txt" },
  {
    id: "queue-mod",
    label: "Expected: Queue + Modification Output",
    file: "spec-queue-modification-output.txt",
  },
  {
    id: "stack-mod",
    label: "Expected: Stack + Modification Output",
    file: "spec-stack-modification-output.txt",
  },
];

const DEMO_BASE = "/assets/demos/letterman";

async function fetchText(relFile: string) {
  const url = encodeURI(`${DEMO_BASE}/${relFile}`);
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load ${relFile} (${res.status})`);
  }

  const ct = res.headers.get("content-type") ?? "";
  // If this ever becomes text/html, you're fetching a page route by mistake.
  if (ct.includes("text/html")) {
    throw new Error(`Loaded HTML instead of text for ${relFile}. Check the file path.`);
  }

  return res.text();
}

export default function LettermanDemoPage() {
  const [specId, setSpecId] = React.useState<string>("simple");
  const [outId, setOutId] = React.useState<string>("queue-word");

  const [input, setInput] = React.useState<string>("");
  const [expected, setExpected] = React.useState<string>("");
  const [output, setOutput] = React.useState<string>("");

  const [loadingInput, setLoadingInput] = React.useState(false);
  const [loadingExpected, setLoadingExpected] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const specFile = React.useMemo(
    () => SPEC_OPTIONS.find((s) => s.id === specId)?.file ?? SPEC_OPTIONS[0].file,
    [specId]
  );

  const expectedFile = React.useMemo(
    () => OUTPUT_OPTIONS.find((o) => o.id === outId)?.file ?? OUTPUT_OPTIONS[0].file,
    [outId]
  );

  const loadSpec = React.useCallback(async () => {
    setErr(null);
    setLoadingInput(true);
    try {
      const txt = await fetchText(specFile);
      setInput(txt);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load spec.");
      setInput("");
    } finally {
      setLoadingInput(false);
    }
  }, [specFile]);

  const loadExpected = React.useCallback(async () => {
    setErr(null);
    setLoadingExpected(true);
    try {
      const txt = await fetchText(expectedFile);
      setExpected(txt);
      setOutput(txt); // ✅ auto-fill output so it’s never blank
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load expected output.");
      setExpected("");
      setOutput("");
    } finally {
      setLoadingExpected(false);
    }
  }, [expectedFile]);

  React.useEffect(() => {
    void loadSpec();
    void loadExpected();
  }, [loadSpec, loadExpected]);

  async function onRun() {
    setErr(null);
    setRunning(true);
    try {
      /**
       * Restricted project: we replay the expected output.
       * If you later add a real solver, call /api/demos/letterman here.
       */
      if (!expected.trim()) {
        setOutput(
          "Expected output is empty.\n\n" +
            "Check that the expected output file exists in:\n" +
            "public/assets/demos/letterman/\n\n" +
            "And that this URL loads in the browser:\n" +
            `${DEMO_BASE}/${expectedFile}\n`
        );
        return;
      }
      setOutput(expected);
    } catch (e: any) {
      setErr(e?.message ?? "Run failed.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">Letterman (Word Morph Solver) Demo</h1>
          <Link
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            href="/projects/letterman"
          >
            Back
          </Link>
        </div>

        <p className="max-w-3xl text-white/70">
          Finds the shortest valid transformation sequence between words using dictionary
          constraints.
        </p>

        <div className="text-sm text-white/60">
          Code is restricted for academic integrity. This demo loads published spec inputs and
          replays the corresponding outputs.
        </div>
      </header>

      {err ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <div className="space-y-1">
              <div className="text-xs text-white/60">Spec input</div>
              <select
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
                value={specId}
                onChange={(e) => setSpecId(e.target.value)}
              >
                {SPEC_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-white/60">Expected output</div>
              <select
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
                value={outId}
                onChange={(e) => setOutId(e.target.value)}
              >
                {OUTPUT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadSpec}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              disabled={loadingInput}
            >
              {loadingInput ? "Loading input…" : "Reload input"}
            </button>

            <button
              type="button"
              onClick={loadExpected}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              disabled={loadingExpected}
            >
              {loadingExpected ? "Loading expected…" : "Reload expected"}
            </button>

            <button
              type="button"
              onClick={onRun}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              disabled={running || !input}
            >
              {running ? "Running…" : "Run"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="text-lg font-semibold">Input</div>
            <textarea
              className="h-[240px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-sm text-white/80 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
            <div className="text-xs text-white/50">
              Loaded from: <span className="font-mono">{DEMO_BASE}/{specFile}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-end justify-between gap-3">
              <div className="text-lg font-semibold">Output</div>
              <button
                type="button"
                onClick={() => setOutput("")}
                className="text-sm text-white/60 underline hover:text-white"
              >
                Clear
              </button>
            </div>

            <textarea
              className="h-[240px] w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-white/90 outline-none"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              spellCheck={false}
            />
            <div className="text-xs text-white/50">
              Expected loaded from:{" "}
              <span className="font-mono">{DEMO_BASE}/{expectedFile}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
