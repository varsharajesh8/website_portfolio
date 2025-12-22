"use client";

import * as React from "react";
import Papa from "papaparse";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type Row = Record<string, any>;

export function DataPlayground() {
  const [rows, setRows] = React.useState<Row[]>([]);
  const [cols, setCols] = React.useState<string[]>([]);
  const [x, setX] = React.useState<string>("");
  const [y, setY] = React.useState<string>("");
  const [mode, setMode] = React.useState<"scatter" | "line">("scatter");

  function onFile(file: File) {
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (res) => {
        const data = (res.data ?? []).filter(Boolean);
        setRows(data);
        const c = res.meta.fields ?? Object.keys(data[0] ?? {});
        setCols(c);
        setX(c[0] ?? "");
        setY(c[1] ?? "");
      }
    });
  }

  const xvals = React.useMemo(() => rows.map((r) => r[x]).filter((v) => v !== undefined), [rows, x]);
  const yvals = React.useMemo(() => rows.map((r) => r[y]).filter((v) => v !== undefined), [rows, y]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glow">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_1fr]">
          <label className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-white/50">Upload CSV</div>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-2 text-sm text-white/80"
            />
          </label>

          <label className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-white/50">X</div>
            <select
              value={x}
              onChange={(e) => setX(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-2 text-sm text-white/80"
            >
              {cols.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-white/50">Y</div>
            <select
              value={y}
              onChange={(e) => setY(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-2 text-sm text-white/80"
            >
              {cols.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <div className="text-xs uppercase tracking-widest text-white/50">Chart</div>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-2 text-sm text-white/80"
            >
              <option value="scatter">Scatter</option>
              <option value="line">Line</option>
            </select>
          </label>
        </div>

        <div className="mt-4 text-sm text-white/60">
          {rows.length ? (
            <>
              Loaded <span className="text-white">{rows.length}</span> rows •{" "}
              <span className="text-white">{cols.length}</span> columns
            </>
          ) : (
            <>Upload any CSV to start.</>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glow">
        <div className="border-b border-white/10 px-4 py-3 text-sm text-white/80">
          Interactive plot
          <span className="ml-2 text-xs text-white/50">(client-side)</span>
        </div>

        <div className="p-2">
          <Plot
            data={[
              {
                x: xvals,
                y: yvals,
                type: mode === "line" ? "scatter" : "scatter",
                mode: mode === "line" ? "lines" : "markers"
              } as any
            ]}
            layout={{
              autosize: true,
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              margin: { l: 50, r: 20, t: 20, b: 50 },
              font: { color: "rgba(255,255,255,0.85)" },
              xaxis: { gridcolor: "rgba(255,255,255,0.08)", zerolinecolor: "rgba(255,255,255,0.12)" },
              yaxis: { gridcolor: "rgba(255,255,255,0.08)", zerolinecolor: "rgba(255,255,255,0.12)" }
            }}
            style={{ width: "100%", height: 460 }}
            useResizeHandler
            config={{ displaylogo: false, responsive: true }}
          />
        </div>
      </div>
    </div>
  );
}