import { processProject } from "./project";
import { localMedia } from "./local-media";
import { projectDirectory, readProject, saveProject } from "./store";
// One local Node process; not a distributed or serverless job queue.
const state = globalThis as typeof globalThis & { dsaRunning?: Set<string> };
const running = state.dsaRunning ??= new Set<string>();
export async function executeProject(id: string) {
  if (running.has(id)) throw new Error("Este projeto já está sendo processado.");
  running.add(id);
  try { return await processProject(await readProject(id), localMedia(projectDirectory(id)), saveProject); }
  finally { running.delete(id); }
}
