# Plano da feature 001 - versão local

Preparado antes do código de domínio em 10/10/2026; atualizado após revisão para incluir D-33. O usuário recebeu a proposta de roteiro -> imagens de texto -> MP4 real e autorizou continuar. Gabriel revisou e aprovou este plano e D-26 a D-33 em 10/10/2026, depois da implementação (D-34 da spec); Maycon, Danilo e Gilberto aprovaram conforme informado por Gabriel (D-35).

## Escopo e prova

Implementar a versão local das decisões D-26 a D-33. Manter os sete critérios de aceite. Usar testes rápidos com provedor controlado para falhas/tempo e uma verificação de integração gerando e abrindo MP4 real. Nenhuma integração externa ou IA será anunciada como pronta.

## Tarefas pequenas

1. Ambiente: instalar versões fixadas de gerador de imagem e FFmpeg, preservar o lockfile, impedir alteração automática de AGENTS.md e retirar fontes remotas desnecessárias. Prova: instalação limpa e build.
2. Domínio: criar projetos/cenas, validar vazio, quantidade e tamanho. Prova: CA-01, CA-05, CA-06 e limites de 10 cenas/2000 caracteres.
3. Orquestração: gerar cenas, registrar erros, preservar arquivos, reexecutar apenas pendentes/falhas e limitar tempos. Prova: CA-03, CA-04, CA-07 e RN-11.
4. Mídia: imagens de texto e montagem MP4 1080p, 3 segundos/cena, sem áudio. Prova: CA-02 e inspeção real do vídeo.
5. Persistência/API: arquivos locais, recuperação pelo ID, consulta e downloads; uma execução ativa por projeto. Prova: API real, reinício e arquivos anteriores preservados.
6. Interface: formulário em português, cenas/erros/estados, execução, consulta e links de download. Prova: testes de interface e uso no navegador.
7. Fechamento: lint, testes, build, diário real e atualização da spec/documentação. Outro integrante precisa testar clone limpo antes da entrega.

## Commits por tarefa

Feitos por Gabriel em 10/10/2026, separando por tarefa a implementação que estava sem commit, sem alterar datas:

| Tarefa | Commit |
|---|---|
| Decisões e plano | `6dcf0dc` docs(001): fecha decisões D-26 a D-33 e plano da versão local |
| 1. Ambiente | `021daab` chore(001): fixa sharp e ffmpeg-static e prepara ambiente |
| 2. Domínio | `6772f7c` feat(001): cria projeto e valida roteiro CA-01 CA-05 CA-06 |
| 3. Orquestração | `f8dc0cc` feat(001): orquestra, preserva e reexecuta cenas CA-02 CA-03 CA-04 CA-07 |
| 4. Mídia | `3d7b80b` feat(001): gera imagens de texto e monta MP4 CA-02 |
| 5. Persistência/API | `5220cca` feat(001): persiste projetos e expõe API e downloads |
| 6. Interface | `5507937` feat(001): conecta interface CA-01 CA-03 CA-04 CA-05 |
| Harness | `da1a2d6` harness: troca hook POSIX por script Node portátil |
| 7. Fechamento | `8e4b88b` docs(001): registra verificação, diário e evidências |

Cada commit de tarefa passou isoladamente em TypeScript, lint e testes (1, 7, 15, 18, 18 e 21 testes).

## Revisão

- [x] Gabriel conferiu o plano, D-26 a D-33 e CA-04 atualizado (10/10/2026, depois da implementação).
- [x] Maycon, Danilo e Gilberto aprovaram D-26 a D-33 e CA-04 atualizado, conforme informado por Gabriel em 10/10/2026 (D-35 da spec).
- [x] Revisão técnica delegada do teste dos três dedos registrada como Codex, sem assinaturas humanas.
- [x] Clone limpo rodado por integrante que não conduziu a sessão de implementação: Gabriel, commit `8e4b88b` (ver `docs/entrega/VALIDACAO-OUTRO-INTEGRANTE.md`).
- [x] Comparação das medições corrigida.
- [x] Evidências novas do Claude Code completadas: deny do `.env` e hook com saída do ESLint, em 10/10/2026 (`docs/harness/evidencias.md`).
