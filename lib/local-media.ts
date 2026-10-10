import path from "node:path";
import { spawn } from "node:child_process";
import { writeFile, rename, rm } from "node:fs/promises";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import type { MediaProvider } from "./project";
function escapeXml(text: string) {
  return text.replace(/[<>&"']/g, char => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[char]!));
}
function lines(text: string) {
  const result: string[] = [];
  // Keep the original script in the project; normalize only its visual layout.
  for (const paragraph of [text.replace(/\s+/gu, " ").trim()]) {
    const chars = Array.from(paragraph);
    if (!chars.length) result.push("");
    while (chars.length) result.push(chars.splice(0, 80).join(""));
  }
  return result;
}
function ffmpeg(args: string[], signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (!ffmpegPath) return reject(new Error("FFmpeg não está disponível. Reinstale as dependências."));
    const child = spawn(ffmpegPath, args, { windowsHide: true, signal, stdio: ["ignore", "ignore", "pipe"] });
    let diagnostic = "";
    child.stderr.on("data", chunk => { diagnostic = (diagnostic + chunk.toString()).slice(-3000); });
    child.on("error", () => reject(new Error("Não foi possível iniciar a montagem do vídeo.")));
    child.on("close", code => {
      if (code === 0) resolve();
      else { console.error("Falha no FFmpeg:", diagnostic); reject(new Error("Não foi possível montar o vídeo. Verifique o serviço local e tente novamente.")); }
    });
  });
}
export function localMedia(directory: string): MediaProvider {
  return {
    async generate(scene, signal) {
      const wrapped = lines(scene.text);
      const size = Math.min(32, Math.floor(720 / Math.max(1, wrapped.length)));
      const content = wrapped.map((line, index) => `<text x="110" y="${230 + index * size}" font-size="${Math.max(1, size - 3)}">${escapeXml(line)}</text>`).join("");
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#102a43"/><g fill="#ffffff" font-family="monospace"><text x="110" y="130" font-size="46">Cena ${scene.number}</text>${content}<text x="110" y="1020" font-size="20">Deploy Sexta Automation · versão local</text></g></svg>`;
      const temporary = path.join(directory, `scene-${scene.number}.tmp.png`);
      try { await sharp(Buffer.from(svg)).png().toFile(temporary); }
      catch { throw new Error("Não foi possível gerar a imagem desta cena. Tente novamente."); }
      if (signal.aborted) { await rm(temporary, { force: true }); throw new Error("Geração interrompida."); }
      const name = `scene-${scene.number}.png`;
      await rename(temporary, path.join(directory, name)); return name;
    },
    async assemble(scenes, signal) {
      const list = scenes.flatMap(scene => [`file '${scene.file}'`, "duration 3"]);
      list.push(`file '${scenes.at(-1)!.file}'`);
      const listPath = path.join(directory, "concat.txt");
      await writeFile(listPath, list.join("\n"), "utf8");
      const temporary = path.join(directory, "final.tmp.mp4");
      await ffmpeg(["-y", "-f", "concat", "-safe", "1", "-i", listPath, "-vf", "fps=24,tpad=stop_mode=clone:stop_duration=1", "-frames:v", String(scenes.length * 72), "-c:v", "libx264", "-preset", "ultrafast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", temporary], signal);
      if (signal.aborted) throw new Error("Montagem interrompida.");
      await rename(temporary, path.join(directory, "final.mp4")); return "final.mp4";
    },
  };
}
