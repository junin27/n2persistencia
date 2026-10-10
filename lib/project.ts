export type Scene = { number: number; text: string; status: "pendente" | "gerada" | "falhou"; file?: string; error?: string };
export type Project = {
  id: string; script: string; scenes: Scene[];
  status: "em andamento" | "concluído" | "falhou";
  phase: "aguardando" | "gerando cenas" | "montando vídeo" | "finalizado";
  finalFile?: string; error?: string;
};
export const EMPTY_SCRIPT = "O roteiro precisa ter pelo menos uma cena.";
export const SCRIPT_LIMIT = "O roteiro excede o limite de 10 cenas de até 2.000 caracteres cada.";

export function createProject(script: string, id: string): Project {
  const texts = script.replace(/\r\n?/g, "\n").split(/\n[\t ]*\n+/).map(text => text.trim()).filter(Boolean);
  if (!texts.length) throw new Error(EMPTY_SCRIPT);
  if (texts.length > 10 || texts.some(text => Array.from(text).length > 2000)) throw new Error(SCRIPT_LIMIT);
  return { id, script, scenes: texts.map((text, i) => ({ number: i + 1, text, status: "pendente" })), status: "em andamento", phase: "aguardando" };
}
