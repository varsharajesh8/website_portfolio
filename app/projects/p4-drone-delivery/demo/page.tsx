"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Mode = "MST" | "FASTTSP" | "OPTTSP";
type TestKey = "spec-test" | "sample-c" | "sample-d" | "sample-e" | "sample-f";

const BASE = "/assets/demos/p4-drone-delivery";

function inputFile(test: TestKey) {
  return `${test}.txt`;
}

function outputFile(test: TestKey, mode: Mode) {
  return `${test}-${mode}-out.txt`;
}

async function fetchText(path: string) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return res.text();
}

export default function DroneDeliveryDemoPage() {
  const tests = useMemo(
    () => [
      { key: "spec-test", label: "Spec Test" },
      { key: "sample-c", label: "Sample C" },
      { key: "sample-d", label: "Sample D" },
      { key: "sample-e", label: "Sample E" },
      { key: "sample-f", label: "Sample F" }
    ],
    []
  );

  const modes: Mode[] = ["MST", "FASTTSP", "OPTTSP"];

  const [test, setTest] = useState<TestKey>("spec-test");
  const [mode, setMode] = useState<Mode>("MST");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const inputPath = `${BASE}/${inputFile(test)}`;
  const outputPath = `${BASE}/${outputFile(test, mode)}`;

  useEffect(() => {
    let cancelled = false;
    setError("");
    setInput("");
    setOutput("");

    Promise.all([fetchText(inputPath), fetchText(outputPath)])
      .then(([inp, out]) => {
        if (!cancelled) {
          setInput(inp);
          setOutput(out);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [inputPath, outputPath]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Drone Delivery Demo</h1>
          <p className="mt-2 text-sm text-white/70 max-w-3xl">
            Select a published test case and algorithm mode to view the input and
            expected output for <span className="text-white/80">MST</span>,{" "}
            <span className="text-white/80">FASTTSP</span>, or{" "}
            <span className="text-white/80">OPTTSP</span>.
          </p>
        </div>

        <Link
          href="/projects/p4-drone-delivery"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          Back to project
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">Test:</span>
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90"
            value={test}
            onChange={(e) => setTest(e.target.value as TestKey)}
          >
            {tests.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">Mode:</span>
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90"
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
          >
            {modes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-white/50">
          <a className="underline hover:text-white" href={inputPath} target="_blank">
            input
          </a>{" "}
          •{" "}
          <a className="underline hover:text-white" href={outputPath} target="_blank">
            expected output
          </a>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-white/80">
          <div className="font-semibold mb-1">Error loading demo files</div>
          <div>{error}</div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold">
              Input
            </div>
            <pre className="p-4 text-xs text-white/80 overflow-auto max-h-[70vh]">
              {input}
            </pre>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold">
              Expected Output ({mode})
            </div>
            <pre className="p-4 text-xs text-white/80 overflow-auto max-h-[70vh]">
              {output}
            </pre>
          </section>
        </div>
      )}
    </main>
  );
}
