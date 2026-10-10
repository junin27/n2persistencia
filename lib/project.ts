export type Scene = { number: number; text: string; status: "pendente" | "gerada" | "falhou"; file?: string; error?: string };
export type Project = {
  id: string; script: string; scenes: Scene[];
  status: "em andamento" | "concluído" | "falhou";
  phase: "aguardando" | "gerando cenas" | "montando vídeo" | "finalizado";
  finalFile?: string; error?: string;
};
export const EMPTY_SCRIPT = "O roteiro precisa ter pelo menos uma cena.";
export const SCRIPT_LIMIT = "O roteiro excede o limite de 10 cenas de até 2.000 caracteres cada.";
export const SCENE_TIMEOUT = "A geração da cena excedeu 10 minutos.";
export const EDIT_TIMEOUT = "A edição final excedeu o limite de 30 minutos.";

export function createProject(script: string, id: string): Project {
  const texts = script.replace(/\r\n?/g, "\n").split(/\n[\t ]*\n+/).map(text => text.trim()).filter(Boolean);
  if (!texts.length) throw new Error(EMPTY_SCRIPT);
  if (texts.length > 10 || texts.some(text => Array.from(text).length > 2000)) throw new Error(SCRIPT_LIMIT);
  return { id, script, scenes: texts.map((text, i) => ({ number: i + 1, text, status: "pendente" })), status: "em andamento", phase: "aguardando" };
}
export interface MediaProvider {
  generate(scene: Scene, signal: AbortSignal): Promise<string>;
  assemble(scenes: Scene[], signal: AbortSignal): Promise<string>;
}
function failureMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message.trim() ? error.message : fallback;
}
async function timed<T>(work: (signal: AbortSignal) => Promise<T>, milliseconds: number, message: string): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([work(controller.signal), new Promise<never>((_, reject) => {
      timer = setTimeout(() => { reject(new Error(message)); controller.abort(); }, milliseconds);
    })]);
  } finally { clearTimeout(timer); }
}
export async function processProject(project: Project, provider: MediaProvider, save: (p: Project) => Promise<void> = async () => {}) {
  if (project.status === "concluído") return project;
  project.status = "em andamento"; project.phase = "gerando cenas"; delete project.error;
  await save(project);
  for (const scene of project.scenes) {
    if (scene.status === "gerada") continue;
    scene.status = "pendente"; delete scene.error;
    await save(project);
    try {
      scene.file = await timed(signal => provider.generate(scene, signal), 600000, SCENE_TIMEOUT);
      scene.status = "gerada";
    } catch (error) {
      scene.status = "falhou";
      scene.error = failureMessage(error, "Não foi possível gerar a cena.");
      project.status = "falhou"; project.error = scene.error;
    }
    await save(project);
  }
  if (project.scenes.every(scene => scene.status === "gerada")) {
    project.phase = "montando vídeo"; await save(project);
    try {
      project.finalFile = await timed(signal => provider.assemble(project.scenes, signal), 1800000, EDIT_TIMEOUT);
      project.status = "concluído";
    } catch (error) {
      project.status = "falhou"; project.error = failureMessage(error, "Não foi possível montar o vídeo.");
    }
  }
  project.phase = "finalizado"; await save(project); return project;
}
