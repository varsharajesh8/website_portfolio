"use client";

import * as React from "react";
import Link from "next/link";

type Props = {
  isRestricted: boolean;
  demoPath?: string;
  imageFiles: string[];
  pdfFiles: string[];
  nonPdfFiles: string[];
  baseUrl: string;
  CodeViewer: React.ReactNode;
};

export default function ProjectTabs({
  isRestricted,
  demoPath,
  imageFiles,
  pdfFiles,
  nonPdfFiles,
  baseUrl,
  CodeViewer,
}: Props) {
  // ✅ Client-side URL builder (Server Components can't pass functions)
  // encodeURI keeps "/" intact (important for paths like "crabster/foo.png")
  const fileUrl = React.useCallback((f: string) => encodeURI(`${baseUrl}/${f}`), [baseUrl]);

  const tabs = [
    { id: "images", label: `Images (${imageFiles.length})`, show: imageFiles.length > 0 },
    { id: "artifacts", label: `Artifacts (${pdfFiles.length})`, show: pdfFiles.length > 0 },
    { id: "source", label: "Source", show: true },
  ].filter((t) => t.show);

  const [active, setActive] = React.useState<string>(tabs[0]?.id ?? "source");

  React.useEffect(() => {
  if (!tabs.find((t) => t.id === active)) {
    setActive(tabs[0]?.id ?? "source");
  }
}, [tabs, active]);


  return (
    <section className="space-y-3">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={
              "rounded-full px-4 py-2 text-sm transition " +
              (active === t.id
                ? "bg-white text-black"
                : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10")
            }
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Images */}
      {active === "images" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {imageFiles.map((f) => (
            <div
              key={f}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="text-sm text-white/80">{f}</div>
                <a
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
                  href={fileUrl(f)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
              </div>

              <img
                src={fileUrl(f)}
                alt={f}
                className="h-auto w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* Artifacts (PDFs) */}
      {active === "artifacts" ? (
        <div className="grid gap-4 md:grid-cols-2">
          {pdfFiles.map((f) => (
            <div
              key={f}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="text-sm text-white/80">{f}</div>
                <a
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
                  href={fileUrl(f)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                </a>
              </div>

              <iframe
                src={`${fileUrl(f)}#view=FitH`}
                className="h-[520px] w-full"
                title={f}
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* Source */}
      {active === "source" ? (
        <>
          <div className="flex items-end justify-between gap-4">
            <div className="text-white/70 text-sm">
              {!isRestricted ? (
                <a
                  className="underline hover:text-white"
                  href={`${baseUrl}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Browse raw files
                </a>
              ) : null}
            </div>
          </div>

          {!isRestricted ? (
            CodeViewer
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/75">
              <p>
                Source code is not publicly available due to University of Michigan academic
                integrity policy.
              </p>
              <p className="mt-2">
                {demoPath ? (
                  <>
                    You can still explore the behavior via the{" "}
                    <Link className="underline" href={demoPath}>
                      live demo
                    </Link>
                    .
                  </>
                ) : (
                  <>A live demo is not available for this project yet.</>
                )}
              </p>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
