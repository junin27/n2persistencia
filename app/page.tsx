"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "../lib/project";
import styles from "./page.module.css";
const EXAMPLE = "O desperdício de água afeta o nosso futuro.\n\nUma torneira aberta desperdiça água todos os dias.\n\nFeche a torneira e conserte vazamentos para economizar.";
async function api(url: string, options?: RequestInit): Promise<Project> {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Não foi possível realizar a operação.");
  return data;
}
export default function Home() {
  const [script, setScript] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [id, setId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | undefined>();
  const actionVersion = useRef(0);
  useEffect(() => {
    if (!processingId) return;
    let active = true;
    const version = actionVersion.current;
    const timer = setInterval(() => { api(`/api/projects/${processingId}`).then(updated => { if (active && actionVersion.current === version) setProject(updated); }).catch(() => {}); }, 1000);
    return () => { active = false; clearInterval(timer); };
  }, [processingId]);
  async function action(work: () => Promise<Project>, pollId?: string) {
    actionVersion.current += 1;
    setBusy(true); setError(""); setProcessingId(pollId);
    try {
      const updated = await work(); actionVersion.current += 1; setProject(updated); setId(updated.id);
      localStorage.setItem("dsa-last-project", updated.id);
    } catch (error) { setError((error as Error).message); }
    finally { actionVersion.current += 1; setBusy(false); setProcessingId(undefined); }
  }
  const fileUrl = (name: string) => `/api/projects/${project!.id}/files/${name}`;
  return <main className={styles.main}>
    <header className={styles.header}>
      <span className={styles.eyebrow}>DEPLOY SEXTA AUTOMATION</span>
      <h1>Do roteiro ao seu primeiro vídeo</h1>
      <p>Organize suas cenas, acompanhe a produção e baixe o resultado.</p>
      <p className={styles.note}>Versão local: imagens com o texto das cenas, 3 segundos por cena, sem áudio. Geração com IA e serviços externos são etapas futuras.</p>
    </header>
    <section className={styles.panel} aria-labelledby="script-title">
      <h2 id="script-title">1. Escreva seu roteiro</h2>
      <label htmlFor="script">Separe cada cena por uma linha em branco. Até 10 cenas de 2.000 caracteres.</label>
      <textarea id="script" rows={7} value={script} onChange={event => setScript(event.target.value)} placeholder="Escreva a primeira cena..." disabled={busy} />
      <div className={styles.actions}>
        <button disabled={busy} onClick={() => action(() => api("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ script }) }))}>Criar projeto</button>
        <button className={styles.secondary} disabled={busy} onClick={() => setScript(EXAMPLE)}>Usar roteiro de exemplo</button>
      </div>
    </section>
    <details className={styles.reopen}>
      <summary>Reabrir um projeto salvo nesta máquina</summary>
      <label htmlFor="project-id">Identificador do projeto</label>
      <input id="project-id" value={id} onChange={event => setId(event.target.value)} />
      <div className={styles.actions}>
        <button className={styles.secondary} disabled={busy || !id} onClick={() => action(() => api(`/api/projects/${encodeURIComponent(id)}`))}>Abrir projeto</button>
        <button className={styles.secondary} disabled={busy} onClick={() => {
          const saved = localStorage.getItem("dsa-last-project");
          if (saved) action(() => api(`/api/projects/${saved}`));
          else setError("Nenhum projeto anterior foi salvo neste navegador.");
        }}>Abrir último projeto</button>
      </div>
    </details>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {project && <section className={styles.panel} aria-labelledby="project-title">
      <h2 id="project-title">2. Produza e acompanhe</h2>
      <p className={styles.identifier}>Projeto: {project.id}</p>
      <div aria-live="polite" className={styles.status}>
        <strong>Estado: {project.status}</strong><span>Etapa: {project.phase}</span>
        {busy && <span>Processando… você pode acompanhar as cenas abaixo.</span>}
      </div>
      {project.error && <p role="alert" className={styles.error}>{project.error}</p>}
      <div className={styles.actions}>
        <button disabled={busy || project.status === "concluído"} onClick={() => action(() => api(`/api/projects/${project.id}`, { method: "POST" }), project.id)}>{project.status === "falhou" ? "Tentar novamente o que faltou" : "Gerar vídeo"}</button>
        <button className={styles.secondary} disabled={busy} onClick={() => action(() => api(`/api/projects/${project.id}`))}>Atualizar andamento</button>
      </div>
      <ol className={styles.scenes}>
        {project.scenes.map(scene => <li key={scene.number}>
          <div className={styles.sceneHeader}><h3>Cena {scene.number}</h3><span>{scene.status}</span></div>
          <p className={styles.sceneText}>{scene.text}</p>
          {scene.error && <p className={styles.error}>{scene.error}</p>}
          {scene.file && scene.status === "gerada" && <a href={fileUrl(scene.file)} download>Baixar imagem da cena {scene.number}</a>}
        </li>)}
      </ol>
      {project.finalFile && project.status === "concluído" && <div className={styles.result}>
        <h2>3. Seu vídeo está pronto</h2>
        <p>MP4 · 1920 × 1080 · {project.scenes.length * 3} segundos · sem áudio</p>
        <video controls src={fileUrl(project.finalFile)} aria-label="Vídeo final" />
        <a className={styles.download} href={fileUrl(project.finalFile)} download>Baixar vídeo MP4</a>
      </div>}
    </section>}
    <footer className={styles.footer}>Se uma cena falhar, as imagens já produzidas ficam guardadas. Seus projetos permanecem nesta máquina.</footer>
  </main>;
}
