# Apresentação N2 — Danilo da Silva Faria

**Sua parte:** 3. Harness
**Tempo:** 04:00 – 06:30 (cerca de 2 min 30 s)
**Antes de você:** Gabriel (spec). **Depois de você:** Gilberto (provas).

Ordem completa: Gabriel (1–2) → Danilo (3) → Gilberto (4) → Maycon (5) → Gilberto (6) → Maycon (7). Meta de 13 min.

---

## Parte 3 — Harness (04:00 – 06:30)

Explique **o que cada peça faz e por que existe**. As provas de funcionamento são do Gilberto, logo depois. Você mostra os arquivos.

**Abertura (15 s):**

> "O harness é o conjunto de instruções e limites que o assistente de programação lê em toda sessão. Usamos o Claude Code. São cinco peças."

### 1. AGENTS.md (35 s)

**Na tela:** [AGENTS.md](../../../AGENTS.md)

> "O AGENTS.md cabe em uma página. Tem os comandos reais de instalar, rodar, testar, fazer lint e build, a stack com as versões fixadas (Node 22.16, Next 16.3.8, React 19.2.8, Jest 30.5.2) e onde ficam as pastas e as specs. No fim, a seção 'Como você deve trabalhar' tem os quatro princípios: declarar suposições e perguntar quando houver duas leituras, fazer o mínimo, tocar só no necessário e provar antes de declarar pronto."

Aponte a linha da porta 3000 ocupada: ela entrou depois que a validação do clone esbarrou nesse problema. É um exemplo do AGENTS.md melhorando com o uso.

### 2. CLAUDE.md (20 s)

**Na tela:** [CLAUDE.md](../../../CLAUDE.md)

> "O CLAUDE.md não repete nada: importa o AGENTS.md com `@AGENTS.md` e acrescenta só o que é do Claude Code: ler a spec inteira antes de editá-la, nunca tocar no .env e usar a skill para mudar specs."

### 3. Permissões (35 s)

**Na tela:** [.claude/settings.json](../../../.claude/settings.json), bloco `permissions`

> "Allow: comandos que o agente roda sem pedir: `npm test`, `npm run lint`, `npm run build` e git de leitura. Ask: `git commit` e `git push` sempre pedem confirmação humana. Deny: leitura e edição do `.env` em qualquer pasta, e também `cat`, `type`, `head`, `grep` e `Get-Content` em arquivos `.env`, para o agente não contornar a regra pelo terminal. O `.env` também está no `.gitignore`."

### 4. Skill `atualizar-spec` (30 s)

**Na tela:** [.claude/skills/atualizar-spec/SKILL.md](../../../.claude/skills/atualizar-spec/SKILL.md)

> "A skill é um procedimento carregado sob demanda. A descrição diz quando usar: criar ou alterar uma spec, nunca para escrever código. Os passos são numerados: ler a spec inteira, identificar a regra ou o critério afetado, escrever no formato Dado/Quando/Então, registrar a decisão e rodar as três varreduras de linguagem. O último passo é de parada: não fazer commit e esperar a aprovação da equipe."

### 5. Hook PostToolUse (35 s)

**Na tela:** o bloco `hooks` do settings.json e depois [scripts/post-edit.mjs](../../../scripts/post-edit.mjs)

> "O hook roda sozinho depois de toda edição com Edit ou Write e executa o ESLint. Ele já mudou duas vezes. Primeiro era um comando de shell POSIX, que não funcionava bem no Windows; trocamos por um script Node no commit `da1a2d6`. Depois vimos que o hook rodava, mas o agente não recebia o resultado. Agora o script devolve a saída do lint ao agente e, se o lint falhar, bloqueia para ele corrigir. Isso está no commit `2acd505`."

**Ao terminar:**

> "Arquivo existir não prova que funciona. O Gilberto mostra as provas."

---

## Cuidados

- Não diga que o hook "sempre funcionou": a primeira versão rodava sem devolver a saída. O conserto é justamente o que mostra o harness evoluindo.
- Não mostre nenhum `.env` na tela, nem fictício.
- Não há servidor MCP instalado no projeto; se perguntarem, diga isso (também está no AGENTS.md).

## Antes de gravar

- [ ] Abrir os cinco arquivos em abas, na ordem acima.
- [ ] Ter o link do GitHub dos commits `da1a2d6` e `2acd505`, caso queira mostrá-los.
