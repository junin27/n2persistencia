import { readProject } from "../../../../lib/store";
import { executeProject } from "../../../../lib/execution";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
export async function GET(_request: Request, context: Context) {
  try { return Response.json(await readProject((await context.params).id), { headers: { "Cache-Control": "no-store" } }); }
  catch { return Response.json({ error: "Projeto não encontrado." }, { status: 404 }); }
}
export async function POST(_request: Request, context: Context) {
  const { id } = await context.params;
  try { await readProject(id); }
  catch { return Response.json({ error: "Projeto não encontrado." }, { status: 404 }); }
  try { return Response.json(await executeProject(id)); }
  catch (error) {
    if ((error as Error).message === "Este projeto já está sendo processado.") return Response.json({ error: (error as Error).message }, { status: 409 });
    return Response.json({ error: "Não foi possível concluir o processamento. Atualize o projeto e tente novamente." }, { status: 500 });
  }
}
