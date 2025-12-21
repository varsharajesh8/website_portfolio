import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Project = {
  slug: string;
  folder: string;
  title: string;
  description: string;
  tags: string[];
  files: string[];
  hasPdf: boolean;
  links?: Record<string, string>;
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

const root = process.cwd();

export function getProjects(): Project[] {
  const p = path.join(root, "content", "projects.json");
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw) as Project[];
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getBlogPosts(): BlogPost[] {
  const dir = path.join(root, "content", "blog");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
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