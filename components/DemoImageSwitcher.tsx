"use client";

import { useMemo, useState } from "react";

type Variant = {
  key: string;
  label: string;
  // PNG shown in browser
  png: string;
  // PPM offered as "raw output"
  ppm?: string;
  // text files like energy/cost/seam (optional)
  txt?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  variants: Variant[];
};

export default function DemoImageSwitcher({ title, subtitle, variants }: Props) {
  const [activeKey, setActiveKey] = useState<string>(variants[0]?.key ?? "");
  const active = useMemo(
    () => variants.find((v) => v.key === activeKey) ?? variants[0],
    [activeKey, variants]
  );

  if (!active) return null;

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <div className="text-sm font-semibold text-white/90">{title}</div>
          {subtitle ? <div className="text-xs text-white/60">{subtitle}</div> : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {active.txt ? (
            <a
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
              href={active.txt}
              target="_blank"
              rel="noreferrer"
            >
              Open text
            </a>
          ) : null}

          {active.ppm ? (
            <a
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
              href={active.ppm}
              target="_blank"
              rel="noreferrer"
            >
              Download .ppm
            </a>
          ) : null}

          <a
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10"
            href={active.png}
            target="_blank"
            rel="noreferrer"
          >
            Open .png
          </a>
        </div>
      </div>

      <div className="px-4 py-4">
        {/* selector pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {variants.map((v) => {
            const isOn = v.key === activeKey;
            return (
              <button
                key={v.key}
                onClick={() => setActiveKey(v.key)}
                className={
                  "rounded-full px-3 py-1.5 text-xs transition border " +
                  (isOn
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-white/75 border-white/10 hover:bg-white/10")
                }
              >
                {v.label}
              </button>
            );
          })}
        </div>

        {/* image preview */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={active.png}
            alt={`${title} - ${active.label}`}
            className="w-full h-auto object-contain rounded-xl"
            loading="lazy"
          />

          <div className="mt-2 text-xs text-white/60 font-mono break-all">
            {active.png}
          </div>

        </div>

        <div className="mt-3 text-xs text-white/55">
          Showing: <span className="text-white/75">{active.label}</span>
        </div>
      </div>
    </section>
  );
}
