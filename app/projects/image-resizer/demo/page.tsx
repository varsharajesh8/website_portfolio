import Link from "next/link";
import DemoImageSwitcher from "@/components/DemoImageSwitcher";

type Scene = "crabster" | "dog" | "horses";

const BASE = "/assets/demos/image-resizer";

function img(scene: Scene, nameNoExt: string) {
  // PNG preview
  return `${BASE}/${scene}/${nameNoExt}.png`;
}
function ppm(scene: Scene, nameNoExt: string) {
  // raw output download
  return `${BASE}/${scene}/${nameNoExt}.ppm`;
}
function txt(scene: Scene, filename: string) {
  return `${BASE}/${scene}/${filename}`;
}

export default function ImageResizerDemoPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Image Resizer Demo</h1>
          <p className="mt-2 text-sm text-white/70 max-w-3xl">
            Content-aware resizing (seam carving). Previews are PNG for the browser; downloads
            include the original PPM outputs for correctness.
          </p>
        </div>

        <Link
          href="/projects/image-resizer"
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          Back to project
        </Link>
      </div>

      <div className="grid gap-6">
        {/* CRABSTER */}
        <DemoImageSwitcher
          title="Crabster"
          subtitle="Original, energy/cost visualization steps, seam selection, seam removed, resized outputs"
          variants={[
            {
              key: "orig",
              label: "Original",
              png: img("crabster", "crabster"),
              ppm: ppm("crabster", "crabster")
            },
            {
              key: "energy",
              label: "Energy (text)",
              png: img("crabster", "crabster"), // keep image visible; link opens text
              txt: txt("crabster", "crabster_energy_correct.txt")
            },
            {
              key: "cost",
              label: "Cost (text)",
              png: img("crabster", "crabster"),
              txt: txt("crabster", "crabster_cost_correct.txt")
            },
            {
              key: "seam",
              label: "Seam (text)",
              png: img("crabster", "crabster"),
              txt: txt("crabster", "crabster_seam_correct.txt")
            },
            {
              key: "left",
              label: "Left",
              png: img("crabster", "crabster_left.correct"),
              ppm: ppm("crabster", "crabster_left.correct")
            },
            {
              key: "right",
              label: "Right",
              png: img("crabster", "crabster_right.correct"),
              ppm: ppm("crabster", "crabster_right.correct")
            },
            {
              key: "removed",
              label: "Removed",
              png: img("crabster", "crabster_removed.correct"),
              ppm: ppm("crabster", "crabster_removed.correct")
            },
            {
              key: "50x45",
              label: "Resized 50×45",
              png: img("crabster", "crabster_50x45.correct"),
              ppm: ppm("crabster", "crabster_50x45.correct")
            },
            {
              key: "70x35",
              label: "Resized 70×35",
              png: img("crabster", "crabster_70x35.correct"),
              ppm: ppm("crabster", "crabster_70x35.correct")
            }
          ]}
        />

        {/* DOG */}
        <DemoImageSwitcher
          title="Dog"
          subtitle="Seam carving outputs + 4×5 resized result"
          variants={[
            {
              key: "orig",
              label: "Original",
              png: img("dog", "dog"),
              ppm: ppm("dog", "dog")
            },
            {
              key: "energy",
              label: "Energy (text)",
              png: img("dog", "dog"),
              txt: txt("dog", "dog_energy_correct.txt")
            },
            {
              key: "cost",
              label: "Cost (text)",
              png: img("dog", "dog"),
              txt: txt("dog", "dog_cost_correct.txt")
            },
            {
              key: "seam",
              label: "Seam (text)",
              png: img("dog", "dog"),
              txt: txt("dog", "dog_seam_correct.txt")
            },
            {
              key: "left",
              label: "Left",
              png: img("dog", "dog_left.correct"),
              ppm: ppm("dog", "dog_left.correct")
            },
            {
              key: "right",
              label: "Right",
              png: img("dog", "dog_right.correct"),
              ppm: ppm("dog", "dog_right.correct")
            },
            {
              key: "removed",
              label: "Removed",
              png: img("dog", "dog_removed.correct"),
              ppm: ppm("dog", "dog_removed.correct")
            },
            {
              key: "4x5",
              label: "Resized 4×5",
              png: img("dog", "dog_4x5.correct"),
              ppm: ppm("dog", "dog_4x5.correct")
            }
          ]}
        />

        {/* HORSES */}
        <DemoImageSwitcher
          title="Horses"
          subtitle="Two resized outputs + seam carving intermediate outputs"
          variants={[
            {
              key: "orig",
              label: "Original",
              png: img("horses", "horses"),
              ppm: ppm("horses", "horses")
            },
            {
              key: "energy",
              label: "Energy (text)",
              png: img("horses", "horses"),
              txt: txt("horses", "horses_energy_correct.txt")
            },
            {
              key: "cost",
              label: "Cost (text)",
              png: img("horses", "horses"),
              txt: txt("horses", "horses_cost_correct.txt")
            },
            {
              key: "seam",
              label: "Seam (text)",
              png: img("horses", "horses"),
              txt: txt("horses", "horses_seam_correct.txt")
            },
            {
              key: "left",
              label: "Left",
              png: img("horses", "horses_left.correct"),
              ppm: ppm("horses", "horses_left.correct")
            },
            {
              key: "right",
              label: "Right",
              png: img("horses", "horses_right.correct"),
              ppm: ppm("horses", "horses_right.correct")
            },
            {
              key: "removed",
              label: "Removed",
              png: img("horses", "horses_removed.correct"),
              ppm: ppm("horses", "horses_removed.correct")
            },
            {
              key: "300x382",
              label: "Resized 300×382",
              png: img("horses", "horses_300x382.correct"),
              ppm: ppm("horses", "horses_300x382.correct")
            },
            {
              key: "400x250",
              label: "Resized 400×250",
              png: img("horses", "horses_400x250.correct"),
              ppm: ppm("horses", "horses_400x250.correct")
            }
          ]}
        />
      </div>
    </main>
  );
}
