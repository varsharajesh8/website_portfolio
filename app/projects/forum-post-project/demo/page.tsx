// app/projects/forum-post-project/demo/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";

type Pair = {
  id: string;
  label: string;
  inputFile: string;
  expectedFile: string;
};

/**
 * ✅ Put your files here:
 * public/assets/demos/forum-post-project/
 *
 * Then these URLs must work:
 * /assets/demos/forum-post-project/test_small.csv
 * /assets/demos/forum-post-project/test_small.out.correct
 */
const DEMO_BASE = "/assets/demos/forum-post-project";

/**
 * ✅ ONLY pair the ones that actually correspond (based on your filenames)
 * - test_small.csv -> test_small.out.correct
 * - train_small.csv -> train_small_train_only.out.correct
 * - w16_projects_exam.csv -> w16_projects_exam_train_only.out.correct
 */
const PAIRS: Pair[] = [
  {
    id: "test-small",
    label: "test_small.csv  →  test_small.out.correct",
    inputFile: "test_small.csv",
    expectedFile: "test_small.out.correct",
  },
  {
    id: "train-small-train-only",
    label: "train_small.csv  →  train_small_train_only.out.correct",
    inputFile: "train_small.csv",
    expectedFile: "train_small_train_only.out.correct",
  },
  {
    id: "w16-exam-train-only",
    label: "w16_projects_exam.csv  →  w16_projects_exam_train_only.out.correct",
    inputFile: "w16_projects_exam.csv",
    expectedFile: "w16_projects_exam_train_only.out.correct",
  },
];

async function fetchText(relFile: string) {
  const url = encodeURI(`${DEMO_BASE}/${relFile}`);
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load ${relFile} (${res.status}). URL: ${url}`);
  }

  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) {
    throw new Error(
      `Loaded HTML instead of text for ${relFile}. Make sure it is in public/assets/demos/forum-post-project/.`
    );
  }

  return res.text();
}

export default function ForumPostClassifierDemoPage() {
  const [pairId, setPairId] = React.useState<string>(PAIRS[0].id);

  const pair = React.useMemo(
    () => PAIRS.find((p) => p.id === pairId) ?? PAIRS[0],
    [pairId]
  );

  const [input, setInput] = React.useState<string>("Loading input…");
  const [expected, setExpected] = React.useState<string>("Loading expected output…");
  const [output, setOutput] = React.useState<string>("");

  const [loading, setLoading] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const inputUrl = React.useMemo(
    () => encodeURI(`${DEMO_BASE}/${pair.inputFile}`),
    [pair.inputFile]
  );
  const expectedUrl = React.useMemo(
    () => encodeURI(`${DEMO_BASE}/${pair.expectedFile}`),
    [pair.expectedFile]
  );

  const loadBoth = React.useCallback(async () => {
    setErr(null);
    setLoading(true);
    setInput("Loading input…");
    setExpected("Loading expected output…");
    setOutput("");

    try {
      const [inTxt, expTxt] = await Promise.all([
        fetchText(pair.inputFile),
        fetchText(pair.expectedFile),
      ]);

      setInput(inTxt);
      setExpected(expTxt);
      setOutput(expTxt); // ✅ auto-fill output so it’s never blank
    } catch (e: any) {
      const msg = e?.message ?? "Failed to load demo files.";
      setErr(msg);
      setInput("");
      setExpected("");
      setOutput(
        "Could not load demo files.\n\n" +
          msg +
          "\n\nCheck that these exist in:\n" +
          "public/assets/demos/forum-post-project/\n" +
          `- ${pair.inputFile}\n` +
          `- ${pair.expectedFile}\n`
      );
    } finally {
      setLoading(false);
    }
  }, [pair.inputFile, pair.expectedFile]);

  React.useEffect(() => {
    void loadBoth();
  }, [loadBoth]);

  async function onRun() {
    setErr(null);
    setRunning(true);
    try {
      // Restricted coursework: replay expected output.
      // Later: replace with POST to /api/demos/forum-post-project and compute real predictions.
      if (!expected.trim()) {
        setOutput(
          "Expected output is empty (or failed to load).\n\n" +
            "Verify the expected file URL loads in your browser:\n" +
            expectedUrl
        );
        return;
      }
      setOutput(expected);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold">Forum Post Classifier Demo</h1>
          <Link
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            href="/projects/forum-post-project"
          >
            Back
          </Link>
        </div>

        <p className="max-w-3xl text-white/70">
          Loads sample CSV inputs and replays the matching expected outputs (source code restricted
          for academic integrity).
        </p>

        
      </header>

      {err ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs text-white/60">Choose a sample</div>
            <select
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
              value={pairId}
              onChange={(e) => setPairId(e.target.value)}
              disabled={loading}
            >
              {PAIRS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>

            <div className="pt-2 text-xs text-white/50">
              Input:{" "}
              <a className="underline hover:text-white" href={inputUrl} target="_blank" rel="noreferrer">
                {inputUrl}
              </a>
              <br />
              Expected:{" "}
              <a
                className="underline hover:text-white"
                href={expectedUrl}
                target="_blank"
                rel="noreferrer"
              >
                {expectedUrl}
              </a>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadBoth}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              disabled={loading}
            >
              {loading ? "Loading…" : "Reload"}
            </button>

            <button
              type="button"
              onClick={onRun}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              disabled={running || loading || !input}
            >
              {running ? "Running…" : "Run"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <div className="text-lg font-semibold">Input (CSV)</div>
            <textarea
              className="h-[280px] w-full rounded-2xl border border-white/10 bg-white/5 p-4 font-mono text-sm text-white/80 outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
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
              className="h-[280px] w-full rounded-2xl border border-white/10 bg-black/40 p-4 font-mono text-sm text-white/90 outline-none"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>

        <details className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <summary className="cursor-pointer text-sm text-white/80">Show expected output (loaded)</summary>
          <pre className="mt-3 overflow-auto whitespace-pre-wrap break-words text-xs text-white/70">
            {expected}
          </pre>
        </details>
      </section>
    </div>
  );
}
