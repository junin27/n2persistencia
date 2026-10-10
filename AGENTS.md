# AGENTS.md
Projeto: Deploy Sexta Automation. Versão local: roteiro -> imagens de texto -> MP4; sem IA ou APIs externas.

## Comandos (na raiz)
- Instalar: `npm ci` (internet na primeira instalação para baixar dependências e FFmpeg).
- Rodar: `npm run dev` e abrir http://localhost:3000.
- Build: `npm run build`; produção: `npm start`.
- Testar: `npm test -- --runInBand`; inclui geração de vídeo real, não exige FFmpeg global.
- No PowerShell, use `npm.cmd test -- --runInBand` para preservar os argumentos do Jest.
- Lint: `npm run lint`.
- Prova HTTP/reinício: `npm run build` e `node scripts/verify-api.mjs` (usa porta 3011).
- Parar servidor iniciado no terminal: Ctrl+C. Use uma única instância local do aplicativo.

## Stack e versões
Node 22.16.0 (`.nvmrc`); TypeScript 5.9.3; Next.js 16.3.8; React 19.2.8; Jest 30.5.2; ESLint 9.39.5; Sharp 0.35.5; ffmpeg-static 5.3.0. Versões diretas exatas em package.json; transitivas em package-lock.json. Next usa webpack para evitar junctions de pacotes nativos no Windows. Nenhum MCP é necessário para rodar esta feature.

## Pastas e specs
- `app/`: interface e API; `lib/`: regras, persistência e mídia local.
- `__tests__/`: testes dos critérios, interface e integração real.
- `scripts/`: verificação HTTP; `data/`: projetos e arquivos gerados, ignorados pelo Git.
- `docs/specs/`: spec `001-orquestracao-producao.md` e plano `001-plano.md`.
- `001-revisao.md` e `001-teste-tres-dedos.md` são apoio, não specs; o plano também é apoio.
- `docs/harness/`: relatórios, evidências e diário; `.claude/`: permissões, hook e skill.
- `CLAUDE.md`: importa estas instruções e acrescenta o específico do Claude Code.

## Como você deve trabalhar
- Declare suposições; se o pedido tem duas leituras, pergunte antes de escolher.
- Faça o mínimo que resolve; não acrescente abstrações ou opções sem necessidade.
- Toque só no necessário; preserve o estilo e o código fora do pedido.
- Diga como vai provar e execute a prova antes de declarar conclusão.
