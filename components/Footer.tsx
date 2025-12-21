export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto max-w-6xl px-4 text-sm text-white/60">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Varsha Rajesh</p>
          <p className="text-white/40">Built with Next.js • Deployed on Vercel • Dark-mode by default</p>
        </div>
      </div>
    </footer>
  );
}