# Apresentação N2 — Maycon

**Suas partes:** 5. Medição · 7. Aprendizados e encerramento
**Tempo:** 08:00 – 09:30 (1 min 30 s) e 12:00 – 13:00 (1 min). Você fecha o vídeo.
**Antes da parte 5:** Gilberto (provas). **Depois da parte 5:** Gilberto (esqueleto).

Ordem completa: Gabriel (1–2) → Danilo (3) → Gilberto (4) → Maycon (5) → Gilberto (6) → Maycon (7). Meta de 13 min.

---

## Parte 5 — Medição com o Better Harness (08:00 – 09:30)

**Na tela:** [relatorio-1-medicao.html](../../harness/relatorio-1-medicao.html) e [relatorio-2-medicao.html](../../harness/relatorio-2-medicao.html) lado a lado. Depois, [comparacao.md](../../harness/comparacao.md).

**O achado e o reparo (30 s):**

> "Medimos o harness antes e depois de mexer nele. O primeiro relatório achou um problema: o AGENTS.md dizia que todo arquivo `NNN-nome.md` em `docs/specs` era uma spec, mas a revisão e o teste dos três dedos seguem esse nome e não são specs. O agente podia confundir os dois. Corrigimos com uma frase no AGENTS.md, no commit `e12fd8d`."

**O que mudou (30 s):**

> "Entre o primeiro e o segundo relatório, só uma dimensão mudou: Entendimento da tarefa, de 66 para 70. Execução controlada ficou em 55, Validação em 45, Entrega em 50 e Aprendizado em 35."

**A leitura honesta (30 s):**

> "Essa melhora foi só nos arquivos. Os dois relatórios analisaram zero sessões, então a ferramenta não viu o agente trabalhando. Existir não é o mesmo que ser usado. Fizemos uma terceira medição dentro da pasta do projeto, mas com outro alvo e outra profundidade; por isso não comparamos as notas dela direto com as duas primeiras."

**Não diga:** que Execução controlada subiu entre a 1 e a 2. Ela ficou em 55 nas duas; o 58 é da terceira medição.

---

## Parte 7 — Aprendizados e encerramento (12:00 – 13:00)

**Na tela:** [docs/harness/diario-001.md](../../harness/diario-001.md) e o histórico de commits no GitHub.

**Um erro real e o sensor que pegou (25 s):**

> "Um erro real: a primeira montagem gerou um vídeo de três cenas com 8,96 segundos, quando a spec pedia 9. Quem pegou foi o teste de integração, que abre o MP4 com o FFmpeg e confere a duração. O agente corrigiu a montagem e o mesmo teste passou, sem mudarmos a expectativa. Se testássemos só o estado do projeto, esse erro passaria."

Outro exemplo, se preferir ou se sobrar tempo:

> "Na validação, o agente achou que o servidor estava no ar porque recebeu HTTP 200 na porta 3000, mas quem respondia era outro projeto da máquina. O log do `npm start`, com EADDRINUSE, mostrou o erro antes da nossa conferência. Isso virou uma linha nova no AGENTS.md."

**Autonomia e pergunta (15 s):**

> "Trabalhamos com autonomia de implementação e verificação: o agente escrevia e testava, mas commit e push pediam confirmação humana. Antes de começar, o agente perguntou quais serviços externos tínhamos escolhido em vez de inventar um; foi daí que veio a versão local."

**O que mudou no harness (10 s):**

> "Depois desta feature, o hook passou a devolver o resultado do lint ao agente, no commit `2acd505`, e o AGENTS.md ganhou a instrução da porta."

**Encerramento (10 s):**

> "Esse é o esqueleto do Deploy Sexta Automation: a feature 001 rodando de ponta a ponta, com um teste por critério de aceite e um commit por tarefa do plano. Obrigado."

---

## Pontos para não contradizer no vídeo

- **Commits:** o Gabriel organizou o trabalho em nove commits por tarefa (`6dcf0dc` a `8e4b88b`) **depois** da implementação, sem alterar as datas. Se perguntarem, diga isso.
- **Diário:** a implementação foi numa sessão do Codex; o fechamento, as provas e os commits foram no Claude Code. O diário já diz isso.
- **Sua aprovação:** a D-35 diz que você aprovou as decisões D-26 a D-33 "conforme informado por Gabriel". Se puder, confirme isso em voz alta no vídeo, por exemplo: "eu também revisei e aprovei a mudança para a versão local".

## Antes de gravar

- [ ] Abrir os dois relatórios HTML lado a lado no navegador.
- [ ] Abrir o diário e a página de commits do GitHub (https://github.com/junin27/n2persistencia/commits/main).
