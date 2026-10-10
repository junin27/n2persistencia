# Validação por outro integrante

Execute depois que o responsável publicar a versão revisada. Quem não conduziu a implementação deve fazer a verificação e preencher o registro com resultados reais. A verificação técnica pelo Codex não substitui essa etapa.

## Partir do zero

Em uma pasta nova, com Node 22.16.0 e acesso à internet:

```powershell
git clone https://github.com/junin27/n2persistencia.git
cd n2persistencia
git rev-parse HEAD
npm ci
npm.cmd test -- --runInBand
npm run lint
npm run build
node scripts/verify-api.mjs
npm start
```

Abra http://localhost:3000. Digite três cenas separadas por uma linha em branco. Crie o projeto: confira três cenas pendentes e a ordem. Gere o vídeo: confira conclusão, imagens e MP4 de 9 segundos. Baixe e reproduza. Guarde o ID, reinicie o servidor e reabra o projeto para conferir persistência. Encerre com Ctrl+C.

A prova HTTP usa porta 3011; ela deve estar livre. Primeira instalação baixa FFmpeg automaticamente; não é necessário instalá-lo globalmente. Para versão ainda não publicada, uma extração nova do ZIP permite uma pré-verificação, mas não é clone do GitHub.

## Registro a preencher por quem executou

- Nome: Gabriel. Não conduziu a sessão de implementação (Codex). Os comandos rodaram numa sessão do Claude Code conduzida por Gabriel; a conferência no navegador foi feita por ele.
- Data e sistema operacional: 10/10/2026, Windows 10 Pro 19045, Node 22.15.1, npm 10.9.2.
- Commit retornado por git rev-parse HEAD: `8e4b88bae487387036e1272b38e921e34498193b`, clone novo do GitHub em pasta separada (`validacao-clone`).
- Instalação / testes / lint / build / prova HTTP: `npm ci` (679 pacotes, FFmpeg baixado automaticamente), 21 testes em 4 suítes, lint e build sem erro, `verify-api.mjs` com status "passou" (MP4 de 3 cenas, execução concorrente recusada, persistência após reinício).
- ID do projeto e reprodução do vídeo: `4b894813-81d3-4793-8df0-b37a81201718`. Três cenas criadas pendentes e na ordem, projeto concluído, três imagens e MP4 baixados e reproduzidos. MP4 H.264 de 9,00 s, 1920 x 1080, 16:9, 24 fps, sem áudio.
- Persistência após reinício: servidor parado e iniciado de novo; o projeto voltou "concluído" com as três cenas "gerada" e o MP4 baixou com HTTP 200 (84.382 bytes).
- Problemas encontrados e resolução: (1) a porta 3000 estava ocupada por outro projeto da máquina; `npm start` falhou com EADDRINUSE e foi usado `npm start -- -p 3002`. O AGENTS.md não dizia como trocar a porta; linha acrescentada. (2) Node 22.15.1 em vez do 22.16.0 do `.nvmrc`; todos os comandos passaram mesmo assim.
- Capturas ou log: imagens das cenas baixadas em `validacao-gabriel/cena-1.png` a `cena-3.png`.
