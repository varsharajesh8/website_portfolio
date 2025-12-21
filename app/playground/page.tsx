import { DataPlayground } from "./playground";

export default function PlaygroundPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Data Playground</h1>
        <p className="max-w-2xl text-white/70">
          A tiny interactive demo: upload a CSV, pick columns, and instantly plot. (This is here to show I ship interactive
          data UX, not just reports.)
        </p>
      </div>
      <DataPlayground />
    </div>
  );
}