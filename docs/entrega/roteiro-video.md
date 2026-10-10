# Roteiro do vídeo - 13 minutos

Todos os quatro integrantes precisam falar. Pode ser voz com tela compartilhada; o PDF não obriga mostrar o rosto. Seguir a ordem das sete partes. Usar as falas como guia, sem ler slides. Mostrar os arquivos e as provas.

**O fluxo local já foi implementado e verificado em 10/10. Ainda faltam a revisão humana e algumas provas do Claude Code. Nunca narrar uma entrevista ou prova que não aconteceu.**

| Tempo | Quem | Parte | O que mostrar |
|---|---|---|---|
| 00:00-01:30 | Maycon | 1. Problema e proposta | Fluxo roteiro/cenas/vídeo e evidência real da dor |
| 01:30-04:00 | Maycon | 2. Spec 001 | Spec, escopo, regras, critérios, decisões e revisão cruzada |
| 04:00-06:30 | Danilo da Silva Faria | 3. Harness | AGENTS.md, CLAUDE.md, permissões, skill e hook |
| 06:30-08:00 | Gilberto | 4. Provas | Bloqueio do .env, skill espontânea e lint disparado pelo hook |
| 08:00-09:30 | Gabriel | 5. Medição | Relatórios 1 e 2 lado a lado, comparação e limites |
| 09:30-12:00 | Gilberto | 6. Esqueleto rodando | Clone limpo, comandos, fluxo da feature, MP4 e sete testes |
| 12:00-13:00 | Gabriel | 7. Aprendizados | Erro real, mecanismo que o detectou e melhoria proposta |

## 1. Maycon: explicar o problema

Fala-base: “Nosso projeto é o Deploy Sexta Automation. Ele atende criadores que precisam transformar um roteiro em vídeo. Hoje, esse fluxo pode exigir separar cenas e mover arquivos entre ferramentas. Nossa proposta é reunir essas etapas e preservar o trabalho quando uma cena falha.”

Em seguida, apresentar **uma evidência real**: quem relatou ou realizou o fluxo, quando, quais passos e qual dificuldade foi observada. Atualmente essa evidência não está registrada no repositório. Se a equipe ainda não validou a dor, assumir isso explicitamente e não inventar entrevista ou estatística.

## 2. Maycon: mostrar a spec

Abrir `docs/specs/001-orquestracao-producao.md` e apontar as sete seções, sem ler tudo.

Fala-base: “A spec é o documento que define o comportamento esperado. Nesta primeira função entram roteiro, cenas, geração, montagem e acompanhamento. Publicação automática, cobrança e edição manual ficam de fora.”

Mostrar RN-05 e RN-06: preservação e reexecução. Mostrar CA-03 em Dado/Quando/Então. Explicar: resultado verificável como passa/não passa, visível ao usuário e sem impor framework.

Abrir `001-revisao.md`. Exemplo real já registrado: Maria Goetz apontou que “mantém as demais cenas geradas” podia significar manter somente o arquivo ou também o estado. Mostrar D-18 e RN-05 corrigida: manter estado **e** arquivo. Esse exemplo tem apoio no registro; não substituir por uma história inventada.

Se a versão local for adotada, mostrar a decisão nova e explicar a diferença para os serviços externos inicialmente previstos.

## 3. Danilo: explicar o harness sem complicar

Fala-base: “O harness é o conjunto de instruções e limites que usamos para trabalhar com o assistente de programação. Usamos Claude Code.”

- AGENTS.md: evita o agente adivinhar comandos, pastas e regras de trabalho. Mostrar comandos reais e os quatro princípios.
- CLAUDE.md: importa AGENTS.md e acrescenta instruções específicas do Claude Code.
- Allow: permite comandos de teste e lint; ask: exige confirmação em commit/push; deny: bloqueia leitura/edição de arquivos de segredo.
- Skill atualizar-spec: procedimento repetível para alterar regras, critérios e decisões. Mostrar descrição, passos e parada.
- Hook: tenta rodar o lint automaticamente depois de Edit/Write. Só dizer “executa o lint” quando a saída tiver sido capturada na prova.

## 4. Gilberto: apresentar três provas

Preparar trechos curtos gravados de sessões reais, sempre na pasta do projeto:

1. **Permissão:** mostrar a ferramenta recusando a leitura de um .env fictício, sem revelar seu conteúdo. A recusa textual do assistente antes de chamar Read não comprova sozinha o deny do harness. O registro atual de bloqueio pela ferramenta está em outra pasta; completar a prova neste projeto. Não remover o deny para realizar a demonstração.
2. **Skill:** em sessão nova, pedir uma alteração na spec sem citar o nome da skill. Mostrar o acionamento espontâneo e a parada. O registro já existente usa a tarefa de cenas duplicadas.
3. **Hook:** fazer uma edição com Edit/Write e mostrar a saída do lint automaticamente disparado, com resultado. “1 hook ran” sozinho é incompleto.

Comentar brevemente que o /context também foi registrado antes dos pedidos. Essa prova é exigida na documentação do harness, embora as três provas da parte 4 sejam permissão/skill/hook.

## 5. Gabriel: explicar a medição

Abrir os relatórios 1 e 2 lado a lado e mostrar o commit `e12fd8d`.

Fala-base: “O primeiro relatório apontou que o AGENTS.md confundia a spec com os documentos de apoio. Corrigimos essa instrução. Entendimento da tarefa passou de 66 para 70. As outras quatro dimensões permaneceram iguais.”

“Os relatórios não analisaram sessões reais, então esse resultado mostra uma melhoria nos arquivos, sem provar que o agente ficou mais eficiente em execução. A terceira medição usou outro alvo e outra profundidade; não usamos suas notas como comparação direta.”

Não afirmar que Execução controlada aumentou entre a medição 1 e a 2: ambas têm 55. A subida para 58 é da terceira medição.

## 6. Gilberto: demonstrar o produto funcionando

A versão local já gera imagens de texto e MP4 real. Mostrar essa simplificação e a decisão D-26, sem anunciar integração externa ou IA. Verificação pelo agente não substitui clone por outro integrante.

Depois de concluída: gravar a clonagem e instalação numa pasta nova, mostrar a sequência documentada em AGENTS.md, iniciar o aplicativo e usar roteiro de três cenas. Mostrar os estados, arquivos, vídeo final abrindo e download. Mostrar falha controlada na terceira cena, preservação das duas anteriores e reexecução apenas do que falta. Identificar condições simuladas como simulação.

Executar testes com nomes CA-01 a CA-07 e mostrar resultado, além de lint. Para caber no tempo, acelerar apenas trechos de instalação/espera e preservar o contexto do comando e o resultado; não cortar uma falha de maneira que pareça sucesso.

Fala-base após verificação real: “Este clone foi verificado por um integrante que não conduziu a sessão com o agente. Os sete critérios têm testes identificados. Além dos testes, abrimos o MP4 gerado para conferir o resultado real.”

Se isso não for verdade até a gravação, mostrar a limitação e assumir que o requisito continua pendente.

## 7. Gabriel: apresentar um aprendizado concreto

Usar o diário da sessão de implementação. Fala-base a preencher: “Durante [tarefa real], o agente fez [erro real]. [Teste/hook/revisão] detectou isso porque [resultado observado]. Corrigimos [mudança] e repetimos a prova. A partir disso, vamos mudar [instrução/skill/hook/permissão].”

Exemplo real da sessão de 10/10: a primeira montagem produziu 8,96 segundos; o teste de integração exigiu 9 segundos e falhou. A montagem foi corrigida e o teste passou sem reduzir a expectativa. O diário registra isso. Não usar uma hipótese do relatório como se fosse falha observada.

## Conferência da gravação e envio

Vídeo entre 10 e 15 minutos; meta de 13. Os sete blocos ficam dentro da ordem esperada. Nenhum segredo na tela. Tudo demonstrado deve estar commitado no repositório entregue. Publicar como YouTube não listado ou Drive acessível a qualquer pessoa com link. Os quatro integrantes entregam o mesmo conteúdo no AVA.

Prazo documental: 10/10/2026 às 23h59. Confirmar eventual prorrogação.
