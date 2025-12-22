 import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  files?: string[];
  hasPdf?: boolean;
  links?: Record<string, string>;
  restricted?: boolean;
  demoPath?: string;

  // NEW: allow hiding projects (e.g., euchre)
  hidden?: boolean;
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

const root = process.cwd();

/**
 * Recursively list all files under a directory.
 * Returns relative paths suitable for public asset URLs.
 */
function safeReadDirRecursive(dirAbs: string): string[] {
  if (!fs.existsSync(dirAbs)) return [];

  const out: string[] = [];

  function walk(currAbs: string, relPrefix: string) {
    const entries = fs.readdirSync(currAbs, { withFileTypes: true });

    for (const e of entries) {
      if (e.name.startsWith(".")) continue;

      const abs = path.join(currAbs, e.name);
      const rel = relPrefix ? `${relPrefix}/${e.name}` : e.name;

      if (e.isDirectory()) {
        walk(abs, rel);
      } else {
        out.push(rel);
      }
    }
  }

  walk(dirAbs, "");
  return out;
}

function projectAssetsDir(slug: string) {
  return path.join(root, "public", "assets", "projects", slug);
}

export function getProjects(): Project[] {
  const jsonPath = path.join(root, "content", "projects.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const parsed = JSON.parse(raw) as Project[];

  // NEW: hide projects from the Projects page/grid (no "tab/card")
  const visible = parsed.filter((p) => !p.hidden);

  return visible.map((proj) => {
    // Always scan /public/assets/projects/<slug>
    const dirAbs = projectAssetsDir(proj.slug);
    const files = safeReadDirRecursive(dirAbs);

    const inferredHasPdf = files.some((f) => f.toLowerCase().endsWith(".pdf"));

    return {
      ...proj,
      files,
      hasPdf: typeof proj.hasPdf === "boolean" ? proj.hasPdf : inferredHasPdf,
    };
  });
}

export function getProject(slug: string): Project | undefined {
  // NOTE: because getProject() uses getProjects(), hidden projects will 404.
  // This matches your requirement: "I don't want a euchre project tab".
  return getProjects().find((p) => p.slug === slug);
}

export function getBlogPosts(): BlogPost[] {
  const dir = path.join(root, "content", "blog");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files.map((file) => {
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, "utf-8");
    const { data } = matter(raw);
    const slug = file.replace(/\.mdx?$/, "");

    return {
      slug,
      title: String(data.title ?? slug),
      date: String(data.date ?? ""),
      summary: String(data.summary ?? ""),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    } satisfies BlogPost;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogSource(slug: string): string {
  const dir = path.join(root, "content", "blog");
  const mdx = path.join(dir, `${slug}.mdx`);
  const md = path.join(dir, `${slug}.md`);

  const file = fs.existsSync(mdx) ? mdx : md;
  return fs.readFileSync(file, "utf-8");
}
