# Comparação das medições do Better Harness

Medição 1 (antes do reparo): `relatorio-1-medicao.md` / `.html`.
Medição 2 (depois do reparo): `relatorio-2-medicao.md` / `.html`.

As notas são julgamento do relatório a partir dos arquivos, não medição automática. A ferramenta não coletou nenhuma sessão: 0 sessões analisadas de 0 elegíveis nas duas medições.

## Índices gerais

| Índice | Medição 1 | Medição 2 | Mudou? |
|---|---|---|---|
| Loop Effectiveness | 50/100 | 51/100 | Sim, +1 |
| Asset Health / Repair Progress | 0/100 (1 pendente) | 100/100 (0 pendentes) | Sim. O achado de nomes em `docs/specs/` foi fechado |

## Cinco dimensões do Agent Work Loop

| Dimensão | Medição 1 | Medição 2 | Mudou? | Evidência |
|---|---|---|---|---|
| Task Understanding (entendimento da tarefa) | 66/100 | 70/100 | Sim, +4 | Reparo em `AGENTS.md`: uma frase distinguindo spec de documento de apoio. Melhoria estática, sem sessão que a tenha usado |
| Controlled Execution (execução controlada) | 55/100 | 55/100 | Não | Regras de allow, ask e deny existem, mas comandos de teste e lint estão pendentes |
| Change Validation (validação da mudança) | 45/100 | 45/100 | Não | Não há comando de teste ou lint. O hook só avisa que nada foi validado |
| Reliable Delivery (entrega confiável) | 50/100 | 50/100 | Não | Commit e push pedem confirmação, mas nenhuma entrega foi observada |
| Learning Capture (captura de aprendizado) | 35/100 | 35/100 | Não | Nenhum episódio de tarefa foi observado |

## O que a comparação mostra

- A única dimensão que mudou foi Task Understanding, e a mudança é estática: o arquivo mudou, mas nenhuma sessão o usou.
- Controlled Execution e Change Validation não mudaram, embora tenham sido mexidas. O motivo é que as regras de permissão e o hook existem, mas não há comando de teste ou lint para exercitá-los. Existir não é o mesmo que ser usado.
- O relatório marcou quase tudo como "não observado". Isso significa que a ferramenta não tinha sessões para analisar, e não que o projeto está sem o mecanismo.
