# AGENTS.md

Projeto: Deploy Sexta Automation (DSA), micro-SaaS que orquestra a produção de vídeo para criadores de conteúdo.

## Comandos

Ainda não definidos. A stack do projeto será escolhida pela equipe. Quando houver código, preencher:

- Instalar: `<pendente>`
- Rodar: `<pendente>`
- Testar: `<pendente>`
- Lint: `<pendente>`

Enquanto isso, não invente comandos. Se algum comando for necessário e não estiver aqui, pergunte.

## Stack e versões

Pendente. Definir linguagem, framework e versões antes da primeira linha de código.

## Estrutura de pastas

```
docs/
  specs/          specs das features (001-orquestracao-producao.md, ...)
  harness/        relatórios do Better Harness e evidências do harness
.claude/          configuração do Claude Code (settings.json, skills)
AGENTS.md         este arquivo
CLAUDE.md         importa este arquivo e acrescenta o específico do harness
```

## Onde ficam as specs

Em `docs/specs/`. Cada feature tem um arquivo `NNN-<nome>.md` com as sete seções: objetivo, escopo, atores, dados, regras de negócio, critérios de aceite e restrições. A seção Decisões fica no fim de cada spec.

## Como você deve trabalhar

- Declare suas suposições. Se o pedido admite duas leituras, pergunte antes de escolher uma.
- O mínimo que resolve. Sem abstração de uso único, sem opção que ninguém pediu, sem tratar erro que não acontece.
- Toque só no necessário. Mantenha o estilo do arquivo e não refatore código que funciona e não faz parte do pedido.
- Diga como vai provar que funcionou, e rode a prova antes de dizer que terminou.
