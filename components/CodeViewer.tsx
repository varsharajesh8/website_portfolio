"use client";

import * as React from "react";

function guessLang(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return "text";
  if (ext === "cpp" || ext === "hpp" || ext === "h") return "cpp";
  if (ext === "py") return "python";
  if (ext === "r") return "r";
  if (ext === "js" || ext === "jsx") return "javascript";
  if (ext === "ts" || ext === "tsx") return "typescript";
  if (ext === "md" || ext === "mdx") return "markdown";
  return "text";
}

export function CodeViewer({ baseUrl, files }: { baseUrl: string; files: string[] }) {
  const [active, setActive] = React.useState(files[0] ?? "");
  const [text, setText] = React.useState<string>("");

  React.useEffect(() => {
    if (!active) return;
    const url = `${baseUrl}/${encodeURIComponent(active)}`;
    fetch(url)
      .then((r) => r.text())
      .then((t) => setText(t))
      .catch(() => setText("Could not load file."));
  }, [active, baseUrl]);

  const lang = guessLang(active);

  return (
    <div className="grid gap-4 md:grid-cols-[260px_1fr]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="px-2 pb-2 text-xs uppercase tracking-widest text-white/50">Files</div>
        <div className="flex flex-col gap-1">
          {files.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={[
                "rounded-xl px-2 py-2 text-left text-sm transition",
                active === f ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              ].join(" ")}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="text-sm text-white/80">
            <span className="font-medium">{active}</span>
            <span className="ml-2 text-xs text-white/50">({lang})</span>
          </div>
          <a
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
            href={`${baseUrl}/${encodeURIComponent(active)}`}
            target="_blank"
            rel="noreferrer"
          >
            Open raw
          </a>
        </div>
        <pre className="max-h-[520px] overflow-auto p-4 text-xs leading-relaxed text-white/80">
          <code className="font-mono">{text}</code>
        </pre>
      </div>
    </div>
  );
}