# AGENTS.md

Projeto: Deploy Sexta Automation (DSA), micro-SaaS que orquestra a produção de vídeo para criadores de conteúdo.

## Comandos

- Instalar: `npm install`
- Rodar: `npm run dev` (sobe em http://localhost:3000)
- Build: `npm run build`
- Lint: `npm run lint`
- Testar: `npm test` (Jest, com Testing Library). Os testes ficam em `__tests__/` e terminam em `.test.ts` ou `.test.tsx`.

Se algum comando for necessário e não estiver aqui, pergunte.

## Stack e versões

- Linguagem: TypeScript sobre Node.js.
- Framework: Next.js (aplicação web).
- Versões: pendente. Registrar aqui a versão do Node e do Next.js quando o projeto for criado.
- Teste: pendente. A equipe ainda não escolheu o framework de teste.

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

Em `docs/specs/`. Cada feature tem um arquivo `NNN-<nome>.md` com as sete seções: objetivo, escopo, atores, dados, regras de negócio, critérios de aceite e restrições. A seção Decisões fica no fim de cada spec. Arquivos como `NNN-revisao.md` e `NNN-teste-tres-dedos.md` são documentos de apoio da spec `NNN`, não são specs e não têm as sete seções.

## Como você deve trabalhar

- Declare suas suposições. Se o pedido admite duas leituras, pergunte antes de escolher uma.
- O mínimo que resolve. Sem abstração de uso único, sem opção que ninguém pediu, sem tratar erro que não acontece.
- Toque só no necessário. Mantenha o estilo do arquivo e não refatore código que funciona e não faz parte do pedido.
- Diga como vai provar que funcionou, e rode a prova antes de dizer que terminou.
