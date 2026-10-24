import fs from "fs/promises";
import path from "path";
import { SEED_PROJECTS } from "@/lib/seedData";

// File-backed projects store — replaces MongoDB.
// Data lives in data/projects.json at the project root.
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "projects.json");

async function ensureFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(SEED_PROJECTS.map(seed), null, 2),
    );
  }
}

function seed(p, i) {
  return {
    _id: String(i + 1),
    ...p,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function readProjects() {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function writeProjects(projects) {
  await ensureFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
}

export async function nextId() {
  const projects = await readProjects();
  const max = projects.reduce((m, p) => Math.max(m, Number(p._id) || 0), 0);
  return max + 1;
}
