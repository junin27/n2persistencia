import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "../app/page";
import { createProject } from "../lib/project";

afterEach(() => jest.restoreAllMocks());
function reply(data: unknown, ok = true) { return { ok, json: async () => data } as Response; }

test("CA-01 interface: criação mostra três cenas pendentes e permite iniciar", async () => {
  const project = createProject("Cena um\n\nCena dois\n\nCena três", "id");
  global.fetch = jest.fn(async () => reply(project));
  render(<Home />);
  fireEvent.change(screen.getByLabelText(/Separe cada cena/), { target: { value: project.script } });
  fireEvent.click(screen.getByRole("button", { name: "Criar projeto" }));
  expect(await screen.findByText("Cena 3")).toBeInTheDocument();
  expect(screen.getAllByText("pendente")).toHaveLength(3);
  await waitFor(() => expect(screen.getByRole("button", { name: "Gerar vídeo" })).toBeEnabled());
});

test("CA-05 interface: exibe recusa do roteiro sem criar cenas", async () => {
  global.fetch = jest.fn(async () => reply({ error: "O roteiro precisa ter pelo menos uma cena." }, false));
  render(<Home />);
  fireEvent.click(screen.getByRole("button", { name: "Criar projeto" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("O roteiro precisa ter pelo menos uma cena.");
  expect(screen.queryByText("Cena 1")).not.toBeInTheDocument();
});

test("CA-03/CA-04 interface: mostra erro, downloads preservados e resultado da reexecução", async () => {
  const failed = createProject("Um\n\nDois\n\nTrês", "id");
  failed.status = "falhou"; failed.phase = "finalizado";
  failed.scenes[0] = { ...failed.scenes[0], status: "gerada", file: "scene-1.png" };
  failed.scenes[1] = { ...failed.scenes[1], status: "gerada", file: "scene-2.png" };
  failed.scenes[2] = { ...failed.scenes[2], status: "falhou", error: "Falha na cena 3." };
  const completed = JSON.parse(JSON.stringify(failed));
  completed.status = "concluído"; completed.finalFile = "final.mp4";
  completed.scenes[2] = { ...completed.scenes[2], status: "gerada", file: "scene-3.png", error: undefined };
  global.fetch = jest.fn().mockResolvedValueOnce(reply(failed)).mockResolvedValueOnce(reply(completed));
  render(<Home />);
  fireEvent.click(screen.getByRole("button", { name: "Criar projeto" }));
  expect(await screen.findByText("Falha na cena 3.")).toBeInTheDocument();
  const firstUrl = screen.getByRole("link", { name: "Baixar imagem da cena 1" }).getAttribute("href");
  await waitFor(() => expect(screen.getByRole("button", { name: "Tentar novamente o que faltou" })).toBeEnabled());
  fireEvent.click(screen.getByRole("button", { name: "Tentar novamente o que faltou" }));
  expect(await screen.findByRole("link", { name: "Baixar vídeo MP4" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Baixar imagem da cena 1" })).toHaveAttribute("href", firstUrl);
  expect(screen.queryByText("Falha na cena 3.")).not.toBeInTheDocument();
});
