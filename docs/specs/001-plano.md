# Plano da feature 001 - versão local

Preparado antes do código de domínio em 10/10/2026; atualizado após revisão para incluir D-33. O usuário recebeu a proposta de roteiro -> imagens de texto -> MP4 real e autorizou continuar. A revisão pelos demais integrantes ainda deve ser registrada; este documento não atribui aprovação a ninguém.

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

## Commits propostos após revisão humana

Não inventar histórico nem commitar em nome dos integrantes. Separar mudanças revisadas por tarefa: `docs(001): fecha decisões e plano`; `feat(001): valida roteiro CA-01 CA-05 CA-06`; `feat(001): preserva e reexecuta cenas CA-03 CA-04 CA-07`; `feat(001): monta MP4 CA-02`; `feat(001): conecta interface`; `docs(001): registra verificação e diário`.

## Revisão pendente

- [ ] Demais integrantes conferiram D-26 a D-33 e CA-04 atualizado.
- [x] Revisão técnica delegada do teste dos três dedos registrada como Codex, sem assinaturas humanas.
- [ ] Clone limpo rodado por integrante que não conduziu a sessão.
- [x] Comparação das medições corrigida.
- [ ] Evidências novas do Claude Code completadas.
