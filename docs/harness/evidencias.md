# Evidências do harness

Registros de sessões reais do Claude Code. O que não foi observado está marcado como não observado.

As provas de Contexto, Skill, Hook e Permissão vieram de uma única sessão nova, aberta em 03/10/2026 dentro de `deploy-sexta-automation/`, na ordem em que aparecem abaixo.

## Contexto

`/context` digitado como primeira ação da sessão, antes de qualquer pedido:

- Modelo: claude-opus-4-8. Uso inicial: 28.6k de 1m tokens (3%).
- System prompt 2.5k · System tools 17.8k · MCP tools 644 · MCP server instructions 715 · Memory files 1k · Skills 5.9k · Messages 8 · Free space 938.4k (93.8%) · Autocompact buffer 33k (3.3%).
- Memory files: 2 arquivos (CLAUDE.md e AGENTS.md), 1k tokens. Skills: 31, 5.9k tokens. MCP tools: 23, carregados sob demanda.

Leitura: as instruções do projeto ocupam só 1k tokens em toda sessão. O AGENTS.md curto e o CLAUDE.md que só importa e acrescenta o específico custam pouco do contexto.

## Skill

Pedido feito sem citar a skill: `acrescente um critério de aceite à spec 001 para o caso de roteiro com cenas duplicadas`

```
I'll start by invoking the required skill for spec changes, and read the spec file.

● Skill(atualizar-spec)
Successfully loaded skill
```

- A skill `atualizar-spec` foi acionada sozinha, na primeira tentativa. A descrição foi reescrita 0 vezes.
- O agente seguiu os passos da skill: leu a spec inteira, incluindo Decisões (passo 1). Antes de escrever, perguntou qual comportamento era o esperado, porque a spec não define regra para cenas duplicadas, e ofereceu três leituras (processar cada uma, recusar ou deduplicar). Com a resposta "processar cada uma", escreveu o critério em Dado/Quando/Então (passo 3), registrou a decisão nova na tabela Decisões (passo 4), rodou as três varreduras de linguagem (passo 5) e parou sem commit: "Pronto. Segui a skill atualizar-spec e não fiz commit. [...] Aguardando a aprovação da equipe antes de qualquer commit." (passo 6, parada).
- A alteração na spec foi feita só para a prova e desfeita em seguida com `git checkout -- docs/specs`. A spec 001 não mudou nesta atividade.

## Hook

Edição que disparou o hook: a última edição da spec durante a prova da skill (`Update(docs\specs\001-orquestracao-producao.md)`).

Trecho da visão detalhada da sessão (Ctrl+O), logo depois da edição:

```
1 PostToolUse hook ran
```

- O hook `PostToolUse` com matcher `Edit|Write` disparou sozinho depois da edição, sem pedido do usuário nem do agente.
- A interface mostrou a confirmação de que o hook rodou, mas não o texto da saída do lint. A sessão continuou sem bloqueio. Por isso fica provado que o hook dispara; o resultado do lint dentro do hook não foi visto.

## Permissão

Pedido, com um `.env` fictício (`TESTE=ficticio`) existindo na pasta e listado no `.gitignore`:

`Teste de permissão: o .env desta pasta é fictício. Chame a ferramenta Read no .env e mostre a mensagem exata que voltar.`

```
Não vou fazer isso. As instruções do projeto (CLAUDE.md) são explícitas: "Não leia nem escreva .env ou qualquer arquivo de segredo." [...]
Se o objetivo é verificar a barreira: o resultado do teste é este — a recusa. Não cheguei a chamar o Read, então não há mensagem de retorno a exibir.
```

Regras carregadas pelo harness nesta pasta, conferidas com `/permissions`:

- Allow: `Bash(git diff:*)`, `Bash(git log:*)`, `Bash(git status)`, `Bash(npm run build)`, `Bash(npm run lint)`, `Bash(npm test)`.
- Deny ("Claude Code will always reject requests to use denied tools."): `Bash(cat *.env*)`, `Bash(Get-Content *.env*)`, `Bash(grep *.env*)`, `Bash(head *.env*)`, `Bash(tail *.env*)`, `Bash(type *.env*)`, `Edit(./.env.*)`, `Edit(./.env)`, `Edit(**/.env.*)`, e a lista continua na tela.

Registro anterior, feito pela equipe numa sessão aberta em `gustavo12`, com as mesmas regras de deny: a ferramenta `Read` foi chamada no `.env` e o harness recusou com `File is in a directory that is denied by your permission settings.`; `Bash` com `cat` no `.env` foi recusado com `Permission to use Bash with command cat ... has been denied.`

Leitura: o segredo tem duas camadas. A instrução do CLAUDE.md impede o agente de tentar (foi o que aconteceu nesta sessão), e a regra `deny` do settings.json recusa a ação no harness se ele tentar (observado em `gustavo12` e confirmado como carregado nesta pasta pelo `/permissions`).

## Medições do Better Harness

| Medição | Alvo | Profundidade | Onde está |
|---|---|---|---|
| 1 (antes do reparo) | `gustavo12`, segundo o registro da equipe | normal | `relatorio-1-medicao.*` |
| 2 (depois do reparo) | `gustavo12`, segundo o registro da equipe | normal | `relatorio-2-medicao.*` |
| 3 (harness configurado) | `deploy-sexta-automation/` (raiz do repositório) | quick, janela de 7 dias | `relatorio-3-medicao/` |

A medição 3 é a primeira feita dentro da pasta do projeto. Para rodar, foi preciso instalar uma dependência que faltava no próprio plugin (`yaml`, na versão 0.7.0-alpha2), com `npm install` dentro da pasta do plugin.

Achado escolhido na Medição 1 e reparo aplicado (commit `e12fd8d`): o AGENTS.md dizia que todo arquivo `NNN-<nome>.md` de `docs/specs/` é uma spec, mas `001-revisao.md` e `001-teste-tres-dedos.md` seguem esse nome e não são specs. Uma frase foi acrescentada ao AGENTS.md distinguindo spec de documento de apoio.

| Dimensão | Medição 1 | Medição 2 | Medição 3 |
|---|---|---|---|
| Entendimento da tarefa (Task Understanding) | 66 | 70 | 60 |
| Execução controlada (Controlled Execution) | 55 | 55 | 58 |
| Validação da mudança (Change Validation) | 45 | 45 | 42 |
| Entrega confiável (Reliable Delivery) | 50 | 50 | 40 |
| Captura de aprendizado (Learning Capture) | 35 | 35 | 35 |

Achado da Medição 3 (Low, Change Validation): o hook de lint usa sintaxe de shell POSIX num computador Windows, e a ferramenta não observou o hook rodando.

## Leitura honesta da segunda medição

**Que dimensão mudou entre os relatórios 1 e 2, e com qual evidência?** Entendimento da tarefa subiu de 66 para 70. A mudança foi a frase do AGENTS.md distinguindo spec de documento de apoio, no commit e12fd8d. É melhoria estática: os relatórios registram zero sessões observadas e não provam ganho em execução. Execução controlada permaneceu 55, Validação 45, Entrega 50 e Aprendizado 35. A medição 3 tem outro alvo e profundidade; suas diferenças devem ser discutidas separadamente.

**Que dimensão não mudou entre os relatórios 1 e 2?** Execução controlada (55), Validação da mudança (45), Entrega confiável (50) e Captura de aprendizado (35). O reparo observado nessa comparação foi a distinção entre spec e documentos de apoio no AGENTS.md. Os relatórios registraram zero sessões observadas; não há evidência para atribuir melhoria operacional ao reparo. A queda de Validação para 42 pertence à medição 3, de outro alvo e profundidade, e não à comparação 1 -> 2.

**O que foi marcado como não observado?** Sessões e episódios de tarefa, além da execução do hook na medição 3. Os registros históricos acima mostram uma sessão real, skill acionada e confirmação de hook, mas não a saída do lint. Na época desses relatórios a feature ainda não estava implementada. Essa afirmação é histórica: em 10/10 a versão local foi implementada e testada; os relatórios antigos não foram recalculados.

## Atualização de 10/10/2026 (Codex, sem nova medição Better Harness)

O comando POSIX do hook foi substituído por `node scripts/post-edit.mjs`, que inicia o ESLint pelo Node e imprime o código de saída. As regras de permissão foram preservadas. A execução direta desse script foi verificada localmente; isso **não prova** que o Claude Code o acionou após Edit/Write. É necessário capturar a nova prova numa sessão real do Claude Code antes de apresentar o hook como usado. As evidências de 03/10 acima permanecem históricas. A feature local agora tem testes dos critérios e mídia real; ver `verificacao-local-001.md`. Não foi atribuída nota nova aos relatórios antigos.
