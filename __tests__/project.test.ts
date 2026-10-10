/** @jest-environment node */
import { createProject, EMPTY_SCRIPT, SCRIPT_LIMIT } from "../lib/project";

const script = "Cena um\n\nCena dois\n\nCena três";

test("CA-01: cria três cenas pendentes na ordem do roteiro", () => {
  const project = createProject(script, "id");
  expect(project.scenes.map(s => [s.number, s.text, s.status])).toEqual([[1, "Cena um", "pendente"], [2, "Cena dois", "pendente"], [3, "Cena três", "pendente"]]);
  expect(project.finalFile).toBeUndefined();
});

test.each(["", "   \n\t  "])("CA-05: recusa roteiro vazio sem projeto (%p)", text => {
  expect(() => createProject(text, "id")).toThrow(EMPTY_SCRIPT);
});

test("CA-06: recusa 11 cenas com mensagem exata", () => {
  expect(() => createProject(Array(11).fill("Cena").join("\n\n"), "id")).toThrow(SCRIPT_LIMIT);
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
