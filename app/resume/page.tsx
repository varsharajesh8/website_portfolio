export default function ResumePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Resume</h1>
          <p className="max-w-2xl text-white/70">Embedded PDF + direct download link.</p>
        </div>
        <a
          href="/assets/resume.pdf"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          Download PDF
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-glow">
        <iframe src="/assets/resume.pdf#view=FitH" className="h-[900px] w-full" title="Resume PDF" />
      </div>
    </div>
  );
}