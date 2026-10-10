import { readFile } from "node:fs/promises";
import path from "node:path";
import { projectDirectory, readProject } from "../../../../../../lib/store";
export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ id: string; name: string }> }) {
  const { id, name } = await context.params;
  try {
    const project = await readProject(id);
    const published = project.scenes.some(scene => scene.status === "gerada" && scene.file === name) || (project.status === "concluído" && project.finalFile === name);
    if (!published || !/^(scene-\d+\.png|final\.mp4)$/.test(name)) return new Response("Arquivo não encontrado.", { status: 404 });
    const bytes = await readFile(path.join(projectDirectory(id), name));
    return new Response(bytes, { headers: { "Content-Type": name.endsWith(".mp4") ? "video/mp4" : "image/png", "Content-Disposition": `attachment; filename="${name}"`, "Cache-Control": "no-store", "Content-Length": String(bytes.length) } });
  } catch { return new Response("Arquivo não encontrado.", { status: 404 }); }
}
