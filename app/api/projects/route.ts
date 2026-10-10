import { randomUUID } from "node:crypto";
import { createProject } from "../../../lib/project";
import { saveProject } from "../../../lib/store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  let script: unknown;
  try { script = (await request.json()).script; }
  catch { return Response.json({ error: "Envie um roteiro em texto." }, { status: 400 }); }
  if (typeof script !== "string") return Response.json({ error: "Envie um roteiro em texto." }, { status: 400 });
  let project;
  try { project = createProject(script, randomUUID()); }
  catch (error) { return Response.json({ error: (error as Error).message }, { status: 400 }); }
  try { await saveProject(project); return Response.json(project, { status: 201 }); }
  catch { return Response.json({ error: "Não foi possível salvar o projeto na máquina local." }, { status: 500 }); }
}
