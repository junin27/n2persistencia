/** @jest-environment node */
import { createProject, processProject, EMPTY_SCRIPT, SCRIPT_LIMIT, SCENE_TIMEOUT, EDIT_TIMEOUT, type MediaProvider } from "../lib/project";

const script = "Cena um\n\nCena dois\n\nCena três";
function provider(): jest.Mocked<MediaProvider> {
  return {
    generate: jest.fn<Promise<string>, Parameters<MediaProvider["generate"]>>(async scene => `scene-${scene.number}.png`),
    assemble: jest.fn<Promise<string>, Parameters<MediaProvider["assemble"]>>(async () => "final.mp4"),
  };
}

afterEach(() => jest.useRealTimers());

test("CA-01: cria três cenas pendentes na ordem do roteiro", () => {
  const project = createProject(script, "id");
  expect(project.scenes.map(s => [s.number, s.text, s.status])).toEqual([[1, "Cena um", "pendente"], [2, "Cena dois", "pendente"], [3, "Cena três", "pendente"]]);
  expect(project.finalFile).toBeUndefined();
});

test("CA-02: monta apenas depois de gerar todas as cenas e entrega arquivo final", async () => {
  const media = provider();
  media.assemble.mockImplementation(async scenes => {
    expect(scenes.every(s => s.status === "gerada" && s.file)).toBe(true);
    return "final.mp4";
  });
  const project = await processProject(createProject(script, "id"), media);
  expect(project.status).toBe("concluído");
  expect(project.finalFile).toBe("final.mp4");
  expect(media.generate).toHaveBeenCalledTimes(3);
  expect(media.assemble).toHaveBeenCalledTimes(1);
});

test("CA-03: falha da terceira cena preserva estado e arquivos das anteriores", async () => {
  const media = provider();
  media.generate.mockImplementation(async scene => {
    if (scene.number === 3) throw new Error("Falha controlada na cena 3.");
    return `scene-${scene.number}.png`;
  });
  const project = await processProject(createProject(script, "id"), media);
  expect(project.status).toBe("falhou");
  expect(project.scenes[2]).toMatchObject({ status: "falhou", error: "Falha controlada na cena 3." });
  expect(project.scenes.slice(0, 2).map(s => [s.status, s.file])).toEqual([["gerada", "scene-1.png"], ["gerada", "scene-2.png"]]);
  expect(media.assemble).not.toHaveBeenCalled();
});

test("CA-04: reexecução bem-sucedida só recria a cena falha", async () => {
  const media = provider();
  let failedOnce = false;
  media.generate.mockImplementation(async scene => {
    if (scene.number === 3 && !failedOnce) { failedOnce = true; throw new Error("Falha controlada."); }
    return `scene-${scene.number}.png`;
  });
  const project = await processProject(createProject(script, "id"), media);
  const kept = project.scenes.slice(0, 2).map(s => s.file);
  media.generate.mockClear();
  await processProject(project, media);
  expect(media.generate).toHaveBeenCalledTimes(1);
  expect(media.generate.mock.calls[0][0].number).toBe(3);
  expect(project.scenes.slice(0, 2).map(s => s.file)).toEqual(kept);
  expect(project.scenes.every(s => s.status === "gerada")).toBe(true);
  expect(project.status).toBe("concluído");
});

test.each(["", "   \n\t  "])("CA-05: recusa roteiro vazio sem projeto (%p)", text => {
  expect(() => createProject(text, "id")).toThrow(EMPTY_SCRIPT);
});

test("CA-06: recusa 11 cenas com mensagem exata", () => {
  expect(() => createProject(Array(11).fill("Cena").join("\n\n"), "id")).toThrow(SCRIPT_LIMIT);
});

test("CA-07: falha exatamente aos dez minutos e aborta o provedor", async () => {
  jest.useFakeTimers();
  const media = provider();
  let signal: AbortSignal | undefined;
  media.generate.mockImplementation((_scene, abort) => { signal = abort; return new Promise(() => {}); });
  const project = createProject("Cena lenta", "id");
  const result = processProject(project, media);
  await jest.advanceTimersByTimeAsync(599999);
  expect(project.scenes[0].status).toBe("pendente");
  await jest.advanceTimersByTimeAsync(1);
  await result;
  expect(project.status).toBe("falhou");
  expect(project.scenes[0]).toMatchObject({ status: "falhou", error: SCENE_TIMEOUT });
  expect(signal?.aborted).toBe(true);
  expect(media.assemble).not.toHaveBeenCalled();
});

test("RN-10: aceita os limites de 10 cenas e 2000 caracteres e recusa 2001", () => {
  expect(createProject(Array(10).fill("a".repeat(2000)).join("\n\n"), "id").scenes).toHaveLength(10);
  expect(() => createProject("a".repeat(2001), "id")).toThrow(SCRIPT_LIMIT);
  expect(createProject("😀".repeat(2000), "id").scenes).toHaveLength(1);
});

test("RN-02: normaliza quebras Windows, preserva linha simples e cenas duplicadas", () => {
  const project = createProject("Um\r\nDois\r\n  \r\nUm\r\nDois", "id");
  expect(project.scenes.map(s => s.text)).toEqual(["Um\nDois", "Um\nDois"]);
});

test("RN-11: timeout da edição preserva imagens e permite retentar somente montagem", async () => {
  jest.useFakeTimers();
  const media = provider();
  media.assemble.mockImplementationOnce(() => new Promise(() => {}));
  const project = createProject(script, "id");
  const result = processProject(project, media);
  await jest.advanceTimersByTimeAsync(1800000);
  await result;
  expect(project).toMatchObject({ status: "falhou", error: EDIT_TIMEOUT });
  expect(project.scenes.every(s => s.status === "gerada")).toBe(true);
  media.generate.mockClear();
  await processProject(project, media);
  expect(media.generate).not.toHaveBeenCalled();
  expect(project.status).toBe("concluído");
});

test("RN-03: projeto concluído não repete geração nem edição", async () => {
  const media = provider();
  const project = await processProject(createProject(script, "id"), media);
  media.generate.mockClear(); media.assemble.mockClear();
  await processProject(project, media);
  expect(media.generate).not.toHaveBeenCalled(); expect(media.assemble).not.toHaveBeenCalled();
});

test("RN-05: erros sem mensagem recebem explicação não vazia na cena e no projeto", async () => {
  const media = provider();
  media.generate.mockRejectedValue(new Error("   "));
  const project = await processProject(createProject("Cena", "id"), media);
  expect(project.status).toBe("falhou");
  expect(project.scenes[0].error).toBe("Não foi possível gerar a cena.");
  expect(project.error).toBe(project.scenes[0].error);
});

test("RN-11: erro vazio de montagem preserva cenas e recebe explicação", async () => {
  const media = provider();
  media.assemble.mockRejectedValue(new Error(""));
  const project = await processProject(createProject("Cena", "id"), media);
  expect(project.status).toBe("falhou");
  expect(project.scenes[0].status).toBe("gerada");
  expect(project.error).toBe("Não foi possível montar o vídeo.");
});
