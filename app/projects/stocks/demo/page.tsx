"use client";

import { useEffect, useState } from "react";
import CodeRestrictionModal from "@/components/CodeRestrictionModal";

type View = "all" | "v" | "m" | "i" | "t";

const outputs: Record<View, string> = {
  all: "/assets/demos/stock-market-simulator/spec-output-all.txt",
  v: "/assets/demos/stock-market-simulator/spec-output-v.txt",
  m: "/assets/demos/stock-market-simulator/spec-output-m.txt",
  i: "/assets/demos/stock-market-simulator/spec-output-i.txt",
  t: "/assets/demos/stock-market-simulator/spec-output-t.txt",
};

async function fetchText(url: string) {
  const res = await fetch(url);
  return await res.text();
}

export default function StockSimDemo() {
  const [view, setView] = useState<View>("all");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    (async () => {
      setInput(await fetchText("/assets/demos/stock-market-simulator/spec-input-TL.txt"));
      setOutput(await fetchText(outputs[view]));
    })();
  }, [view]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Stock Market Simulator Demo</h1>
      <CodeRestrictionModal />

      <div className="flex gap-2">
        {(["all","v","m","i","t"] as View[]).map((k) => (
          <button
            key={k}
            className={`px-3 py-2 rounded border text-sm ${view === k ? "bg-black text-white" : ""}`}
            onClick={() => setView(k)}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 space-y-2">
  <p className="font-semibold text-white">Output Modes Explained</p>

  <p>
    <span className="font-mono font-semibold">ALL</span> – Runs the simulator with
    <span className="font-semibold"> all output modes enabled</span>. Useful for
    seeing the full behavior of the system in one run.
  </p>

  <p>
    <span className="font-mono font-semibold">V (Verbose)</span> – Prints
    <span className="font-semibold"> detailed transaction-level logs</span>,
    including every buy/sell order processed and each trade execution.
  </p>

  <p>
    <span className="font-mono font-semibold">M (Median)</span> – Reports the
    <span className="font-semibold"> running median trade price</span> after each
    completed transaction.
  </p>

  <p>
    <span className="font-mono font-semibold">I (Trader Info)</span> – Outputs
    <span className="font-semibold"> per-trader summaries</span>, including total
    shares bought/sold and net profit or loss.
  </p>

  <p>
    <span className="font-mono font-semibold">T (Time Traveler)</span> – Identifies
    the <span className="font-semibold"> optimal buy and sell times</span> that
    would have produced the maximum profit in hindsight.
  </p>
</div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="font-semibold mb-2">Input</h2>
          <pre className="text-xs bg-white/5 text-white p-3 rounded overflow-auto max-h-[520px] border border-white/10">
  {input}
</pre>
        </section>
        <section>
          <h2 className="font-semibold mb-2">Output</h2>
          <pre className="text-xs bg-black text-white p-3 rounded overflow-auto max-h-[520px] border">{output}</pre>
        </section>
      </div>
    </div>
  );
}
