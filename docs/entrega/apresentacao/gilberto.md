# Apresentação N2 — Gilberto

**Suas partes:** 4. Provas do harness · 6. Esqueleto rodando
**Tempo:** 06:30 – 08:00 (1 min 30 s) e 09:30 – 12:00 (2 min 30 s)
**Antes da parte 4:** Danilo (harness). **Depois da parte 4:** Maycon (medição). **Depois da parte 6:** Maycon (aprendizados).

Ordem completa: Gabriel (1–2) → Danilo (3) → Gilberto (4) → Maycon (5) → Gilberto (6) → Maycon (7). Meta de 13 min.

---

## Parte 4 — Provas do harness (06:30 – 08:00)

**Na tela:** [docs/harness/evidencias.md](../../harness/evidencias.md), rolando até cada prova.

> "O Danilo mostrou os arquivos. Agora as provas de que cada mecanismo foi usado numa sessão real."

**Contexto (15 s).**

> "Numa sessão nova, antes de qualquer pedido, o `/context` mostrou 28,6 mil tokens de 1 milhão. As instruções do projeto, CLAUDE.md e AGENTS.md, ocupam só mil tokens. O harness custa pouco."

**Permissão (25 s).** Seção "Provas de 10/10/2026 → Permissão".

> "Pedimos ao agente que lesse o `.env`. Ele chamou a ferramenta Read e o harness recusou: 'File is in a directory that is denied by your permission settings'. Tentou `cat .env` pelo terminal e também foi recusado. Quem barrou foi a regra deny, não a boa vontade do agente."

**Skill (25 s).** Seção "Skill".

> "Numa sessão nova, pedimos para acrescentar um critério à spec sem citar a skill. O agente acionou `atualizar-spec` sozinho, na primeira tentativa, e não precisamos reescrever a descrição. Ele perguntou qual comportamento esperávamos antes de escrever, registrou a decisão e parou sem commit, como manda o último passo."

**Hook (25 s).** Seção "Provas de 10/10/2026 → Hook".

> "O agente criou um arquivo com Write, sem rodar lint manualmente. Logo depois, o Claude Code entregou a ele: 'ESLint executado após a edição; terminou com código 0'. Também testamos o caminho de falha com um arquivo de sintaxe inválida: código 1 e bloqueio."

**Não diga:** que a prova da skill é de hoje. Ela é de 03/10. As de permissão e hook são de 10/10.

---

## Parte 6 — Esqueleto rodando (09:30 – 12:00)

Esta é a parte que o PDF de 03/10 mais pede: **a feature 001 rodando de ponta a ponta a partir de um clone limpo**.

**Recomendação forte:** grave você mesmo o clone numa pasta nova. O PDF pede que "um integrante que não conduziu a sessão com o agente" faça isso, e você não conduziu nenhuma sessão. Se precisar perguntar alguma coisa, anote: é sinal de que falta comando no AGENTS.md.

### 1. Clone e comandos do AGENTS.md (50 s, pode acelerar a espera)

No PowerShell, numa pasta nova:

```powershell
git clone https://github.com/junin27/n2persistencia.git
cd n2persistencia
git rev-parse HEAD
npm ci
npm.cmd test -- --runInBand --verbose
npm run lint
npm run build
npm start
```

Se a porta 3000 estiver ocupada: `npm start -- -p 3002` (está no AGENTS.md).

> "Clonei do zero e segui só o AGENTS.md. O `npm ci` baixa até o FFmpeg; não precisei instalar nada além do Node."

**Nos testes, pare a tela no resultado:** 4 suítes e 21 testes passando. Aponte os nomes que começam com CA-01 a CA-07.

> "Cada critério de aceite da spec tem um teste com o nome do critério. Nenhum teste foi apagado ou ajustado para passar."

Acelere a instalação e a espera, mas **não corte o resultado final** de cada comando.

### 2. O fluxo no navegador (60 s)

1. Abra http://localhost:3000 e clique em **"Usar roteiro de exemplo"**.
2. Clique em **"Criar projeto"**: aparecem três cenas **pendentes**, na ordem (CA-01).
3. Clique em **"Gerar vídeo"**: as cenas mudam para **gerada** e o estado vira **concluído** (CA-02).
4. Dê play no vídeo: **9 segundos, 3 cenas, 1920 × 1080, sem áudio**. Baixe o MP4 e uma imagem.
5. Apague o roteiro e clique em "Criar projeto" vazio: aparece "O roteiro precisa ter pelo menos uma cena." (CA-05).

> "Este é o vídeo real que o sistema montou, não uma tela de mentira. É a versão local: imagem com o texto de cada cena, sem IA. Isso está na decisão D-26."

### 3. Falha e reexecução (30 s)

A interface não tem botão para forçar uma falha. Mostre isso pelos testes:

- [__tests__/local-media.test.ts](../../../__tests__/local-media.test.ts): o teste "CA-03/CA-04 integração" força a falha da cena 3, reexecuta e confere com SHA-256 que as imagens 1 e 2 são **exatamente os mesmos bytes**.
- [__tests__/project.test.ts](../../../__tests__/project.test.ts): o CA-07 usa um relógio controlado para provar que a cena falha exatamente aos 10 minutos.

> "Essa falha é simulada no teste, de propósito. Não dá para esperar 10 minutos no vídeo, então o teste controla o relógio."

### 4. Persistência (opcional, 10 s, se sobrar tempo)

Copie o ID do projeto, pare o servidor com Ctrl+C, rode `npm start` de novo e use **"Abrir último projeto"**: o projeto volta concluído.

**Ao terminar:**

> "Para fechar, o Maycon conta o que aprendemos construindo isso com o agente."

---

## Antes de gravar

- [ ] Node 22 instalado. Pasta nova, fora do repositório que já existe na máquina.
- [ ] Rodar tudo uma vez antes, para não ter surpresa durante a gravação.
- [ ] Se gravar o clone, anotar o hash do `git rev-parse HEAD` e qualquer dúvida que surgir, e passar ao Gabriel para registrar em `docs/entrega/VALIDACAO-OUTRO-INTEGRANTE.md`.
- [ ] Nenhum `.env` ou outro terminal com dados pessoais aparecendo na tela.
