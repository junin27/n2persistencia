import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Project } from "./project";
const root = path.join(process.cwd(), "data", "projects");
export function projectDirectory(id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new Error("Identificador de projeto inválido.");
  return path.join(root, id);
}
export async function saveProject(project: Project) {
  const directory = projectDirectory(project.id);
  await mkdir(directory, { recursive: true });
  const temporary = path.join(directory, `project-${randomUUID()}.tmp`);
  await writeFile(temporary, JSON.stringify(project, null, 2), "utf8");
  await rename(temporary, path.join(directory, "project.json"));
}
export async function readProject(id: string): Promise<Project> {
  return JSON.parse(await readFile(path.join(projectDirectory(id), "project.json"), "utf8"));
}
