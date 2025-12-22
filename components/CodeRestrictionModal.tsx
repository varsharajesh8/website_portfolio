"use client";

import { useState } from "react";

export default function CodeRestrictionModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="text-sm text-white/60 underline hover:text-white"
        onClick={() => setOpen(true)}
      >
        Why isn’t the full code available?
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b0b0f] p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-white">
              Code Availability Notice
            </h3>

            <p className="mt-2 text-sm text-white/75">
              This project was completed as part of University of Michigan coursework.
              Due to academic integrity policy, the full source code cannot be publicly shared.
            </p>

            <p className="mt-2 text-sm text-white/75">
              Recruiters may request a private walkthrough or code review at{" "}
              <a className="underline hover:text-white" href="mailto:varajesh@umich.edu">
                varajesh@umich.edu
              </a>
              .
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                onClick={() => navigator.clipboard.writeText("varajesh@umich.edu")}
              >
                Copy email
              </button>

              <button
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
