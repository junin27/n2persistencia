/** @jest-environment node */
import { mkdir, mkdtemp, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";
import { localMedia } from "../lib/local-media";
import { createProject, processProject } from "../lib/project";
import { createHash } from "node:crypto";

test("CA-02 integração: gera PNGs e MP4 real de 9 segundos, 1080p e cenas na ordem", async () => {
  const root = path.join(process.cwd(), "tmp", "media-tests");
  await mkdir(root, { recursive: true });
  const directory = await mkdtemp(path.join(root, "run-"));
  const project = await processProject(createProject("Água & vida <primeira cena>\n\nSegunda cena\n\nTerceira cena", "integration"), localMedia(directory));
  expect(project.status).toBe("concluído");
  for (const scene of project.scenes) {
    const metadata = await sharp(path.join(directory, scene.file!)).metadata();
    expect([metadata.width, metadata.height, metadata.format]).toEqual([1920, 1080, "png"]);
  }
  const video = path.join(directory, project.finalFile!);
  expect((await readFile(video)).subarray(4, 8).toString()).toBe("ftyp");
  const inspection = spawnSync(ffmpegPath!, ["-i", video, "-f", "null", "-"], { windowsHide: true, encoding: "utf8" });
  expect(inspection.status).toBe(0);
  expect(inspection.stderr).toContain("1920x1080");
  expect(inspection.stderr).toContain("Duration: 00:00:09.00");
  for (let index = 0; index < 3; index++) {
    const frame = spawnSync(ffmpegPath!, ["-ss", String(index * 3 + 1), "-i", video, "-frames:v", "1", "-f", "image2pipe", "-c:v", "png", "-"], { windowsHide: true, maxBuffer: 20 * 1024 * 1024 });
    expect(frame.status).toBe(0);
    const actual = await sharp(frame.stdout).resize(192, 108).raw().toBuffer();
    const expected = await sharp(path.join(directory, project.scenes[index].file!)).resize(192, 108).removeAlpha().raw().toBuffer();
    const error = actual.reduce((sum, value, i) => sum + Math.abs(value - expected[i]), 0) / actual.length;
    expect(error).toBeLessThan(5);
  }
}, 60000);

test("CA-03/CA-04 integração: falha controlada e reexecução preservam os bytes das cenas anteriores", async () => {
  const root = path.join(process.cwd(), "tmp", "media-tests");
  await mkdir(root, { recursive: true });
  const directory = await mkdtemp(path.join(root, "retry-"));
  const real = localMedia(directory);
  let fail = true;
  const media = { ...real, generate: async (...args: Parameters<typeof real.generate>) => {
    if (args[0].number === 3 && fail) { fail = false; throw new Error("Falha controlada na terceira cena."); }
    return real.generate(...args);
  } };
  const project = await processProject(createProject("Primeira\n\nSegunda\n\nTerceira", "integration-retry"), media);
  expect(project.status).toBe("falhou");
  const hash = async (name: string) => createHash("sha256").update(await readFile(path.join(directory, name))).digest("hex");
  const before = await Promise.all([hash("scene-1.png"), hash("scene-2.png")]);
  await processProject(project, media);
  expect(project.status).toBe("concluído");
  expect(await Promise.all([hash("scene-1.png"), hash("scene-2.png")])).toEqual(before);
}, 60000);

test("D-33: muitas quebras de linha não sobrepõem o texto e o roteiro original é preservado", async () => {
  const root = path.join(process.cwd(), "tmp", "media-tests");
  await mkdir(root, { recursive: true });
  const directory = await mkdtemp(path.join(root, "layout-"));
  const source = "A\n".repeat(900).trim();
  const project = createProject(source, "layout");
  const media = localMedia(directory);
  const signal = new AbortController().signal;
  const withBreaks = await media.generate(project.scenes[0], signal);
  const before = createHash("sha256").update(await readFile(path.join(directory, withBreaks))).digest("hex");
  const normalized = await media.generate({ ...project.scenes[0], text: source.replace(/\s+/g, " ") }, signal);
  const after = createHash("sha256").update(await readFile(path.join(directory, normalized))).digest("hex");
  expect(before).toBe(after);
  expect(project.scenes[0].text).toBe(source);
});
