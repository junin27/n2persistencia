# Deploy Sexta Automation

Primeira versão local do micro-SaaS: recebe roteiro, cria cenas, gera imagens com o texto e monta um vídeo MP4 para download. Cada cena dura 3 segundos; vídeo 1920 x 1080, 16:9, sem áudio. Não usa IA ou APIs externas nesta versão; a diferença está registrada na spec, decisões D-26 a D-33.

Equipe: Maycon, Danilo da Silva Faria, Gabriel e Gilberto.

## Começar

Instale Node 22.16.0. Na pasta do projeto:

```sh
npm ci
npm run dev
```

Abra http://localhost:3000. Use “Usar roteiro de exemplo”, depois “Criar projeto” e “Gerar vídeo”. A criação mostra as cenas pendentes; o processamento é uma segunda ação. Baixe as imagens ou o MP4 ao terminar.

Sharp e FFmpeg são instalados pelo npm; não é necessário configurar um FFmpeg global. A primeira instalação exige internet para baixar os pacotes e o executável. Não use `--ignore-scripts` na instalação limpa: isso impede a preparação do FFmpeg. A execução/build não baixa fontes nem chama APIs externas.

## Verificar

```sh
npm test -- --runInBand
npm run lint
npm run build
node scripts/verify-api.mjs
```

Os testes incluem CA-01 a CA-07, falhas, timeouts com relógio controlado, interface e geração/decodificação real de MP4. O script HTTP exige build prévio e porta 3011 livre; inicia/encerra seu próprio servidor, confirma downloads, concorrência e persistência após reinício. Para servir o build normalmente: `npm start`.

## Dados locais

Os projetos ficam em `data/projects/<id>/`, ignorado pelo Git. Copie o identificador mostrado na tela ou use “Abrir último projeto” no mesmo navegador. Projetos sobrevivem a reinícios; imagens já geradas são reutilizadas na reexecução. Sem expiração automática. Para limpar dados de teste, pare o servidor e remova manualmente apenas os projetos locais que não precisa guardar.

Execute uma única instância do servidor local. O processamento ocorre no processo Node, sem fila distribuída. Se encerrar o servidor durante uma geração, reabra o projeto e inicie novamente; cenas já registradas como geradas permanecem. Esta versão não inclui autenticação, cobrança ou publicação em redes sociais.

## Documentos da entrega

- Regras: `docs/specs/001-orquestracao-producao.md`.
- Plano: `docs/specs/001-plano.md`.
- Diário real desta sessão: `docs/harness/diario-001.md`.
- Verificação realizada: `docs/harness/verificacao-local-001.md`.
- Próximas pendências e vídeo: `docs/entrega/status.md` e `docs/entrega/roteiro-video.md`.

Ainda é necessária a revisão humana das novas decisões, a verificação do clone por outro integrante e as provas faltantes do Claude Code. Alterações locais não equivalem a publicação no GitHub ou entrega no AVA.
