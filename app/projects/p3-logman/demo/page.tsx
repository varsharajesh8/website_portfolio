"use client";

import * as React from "react";
import Link from "next/link";
import CodeRestrictionModal from "@/components/CodeRestrictionModal";

const DEMO_BASE = "/assets/demos/p3-logman";

async function fetchText(relFile: string) {
  const url = encodeURI(`${DEMO_BASE}/${relFile}`);
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load ${relFile} (${res.status}). URL: ${url}`);
  }

  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("text/html")) {
    throw new Error(
      `Loaded HTML instead of text for ${relFile}. Make sure it is in public/assets/demos/p3-logman/.`
    );
  }

  return res.text();
}

export default function LogManagerDemoPage() {
  const [cmds, setCmds] = React.useState("Loading commands…");
  const [log, setLog] = React.useState("Loading log…");
  const [expected, setExpected] = React.useState("Loading expected output…");
  const [output, setOutput] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const loadAll = React.useCallback(async () => {
    setErr(null);
    setLoading(true);
    setCmds("Loading commands…");
    setLog("Loading log…");
    setExpected("Loading expected output…");
    setOutput("");

    try {
      const [cmdsTxt, logTxt, outTxt] = await Promise.all([
        fetchText("spec-test-cmds.txt"),
        fetchText("spec-test-log.txt"),
        fetchText("spec-test-out.txt"),
      ]);

      setCmds(cmdsTxt);
      setLog(logTxt);
      setExpected(outTxt);
      setOutput(outTxt); // ✅ auto-fill output so never blank
    } catch (e: any) {
      const msg = e?.message ?? "Failed to load demo files.";
      setErr(msg);
      setCmds("");
      setLog("");
      setExpected("");
      setOutput(
        "Could not load demo files.\n\n" +
          msg +
          "\n\nCheck these exist in:\n" +
          "public/assets/demos/p3-logman/\n" +
          "- spec-test-cmds.txt\n" +
          "- spec-test-log.txt\n" +
          "- spec-test-out.txt\n"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function onRun() {
    setErr(null);
    setRunning(true);
    try {
      /**
       * Restricted coursework:
       * We replay the expected output instead of executing code.
       * This still demonstrates full spec behavior.
       */
      if (!expected.trim()) {
        setOutput(
          "Expected output is empty or failed to load.\n\n" +
            "Verify this URL loads:\n" +
            `${DEMO_BASE}/spec-test-out.txt`
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
          <h1 className="text-3xl font-semibold">Log Manager Demo</h1>
          <Link
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
            href="/projects/p3-logman"
          >
            Back
          </Link>
        </div>

        <p className="max-w-3xl text-white/70">
          Demonstrates indexed log queries and command-driven output using published spec files.
        </p>

        <CodeRestrictionModal />
      </header>

      {err ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {err}
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-white/60">
            Files loaded from <span className="font-mono">{DEMO_BASE}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={loadAll}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              disabled={loading}
            >
              {loading ? "Loading…" : "Reload"}
            </button>

            <button
              type="button"
              onClick={onRun}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
              disabled={running || loading}
            >
              {running ? "Running…" : "Run"}
            </button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-2">
            <div className="text-lg font-semibold">Commands</div>
            <pre className="text-xs bg-white/5 text-white p-3 rounded overflow-auto max-h-[420px] border border-white/10">
              {cmds}
            </pre>
          </div>

          <div className="space-y-2">
            <div className="text-lg font-semibold">Log File</div>
            <pre className="text-xs bg-white/5 text-white p-3 rounded overflow-auto max-h-[420px] border border-white/10">
              {log}
            </pre>
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

            <pre className="text-xs bg-black/80 text-white p-3 rounded overflow-auto max-h-[420px] border border-white/10">
              {output}
            </pre>
          </div>
        </div>

        
      </section>
    </div>
  );
}
