# Teste dos três dedos: Spec 001

Revisão técnica/textual feita pelo Codex em 10/10/2026, a pedido do usuário. As linhas abaixo são resultados do agente, não aprovações atribuídas aos integrantes. A confirmação da equipe continua pendente. Roteiro para a equipe testar os critérios de aceite da spec `001-orquestracao-producao.md`. Tempo estimado: 10 minutos.

## Como fazer

Para cada critério, leia em voz alta e responda às três perguntas:

1. **Binário:** o resultado é só passa ou não passa? Não existe "parcialmente" ou "quase"?
2. **Observável:** dá para verificar de fora do sistema, pelo que o criador vê ou recebe?
3. **Livre de implementação:** o texto evita citar classe, tabela, framework ou biblioteca?

Se qualquer resposta for "não" ou "depende", o critério não passa e precisa ser reescrito. Não marque como aprovado antes de reescrever e testar de novo.

## Critérios

| Critério | Binário | Observável | Livre de implementação | Resultado | Testado por | Data |
|---|---|---|---|---|---|---|
| CA-01: roteiro válido gera um projeto | Sim | Sim | Sim | Passa na revisão técnica | Codex (agente) | 10/10/2026 |
| CA-02: projeto concluído entrega um vídeo | Sim | Sim | Sim | Passa na revisão técnica | Codex (agente) | 10/10/2026 |
| CA-03: falha em uma cena não apaga o trabalho feito | Sim | Sim | Sim | Passa na revisão técnica | Codex (agente) | 10/10/2026 |
| CA-04: reexecução processa apenas o que falhou | Sim | Sim | Sim | Passa na revisão técnica | Codex (agente) | 10/10/2026 |
| CA-05: roteiro sem cena é recusado | Sim | Sim | Sim | Passa na revisão técnica | Codex (agente) | 10/10/2026 |
| CA-06: roteiro com mais de 10 cenas é recusado | Sim | Sim | Sim | Passa na revisão técnica | Codex (agente) | 10/10/2026 |
| CA-07: cena que passa de 10 minutos falha | Sim | Sim | Sim | Passa na revisão técnica | Codex (agente) | 10/10/2026 |

## Pontos de atenção

- **CA-02:** a versão atual define 30 minutos em RN-11. Confirmar o comportamento e o início da contagem na revisão humana.
- **CA-04:** o teste passa só se o criador conseguir ver que a cena 3 mudou para "gerada" e que o arquivo das cenas 1 e 2 é o mesmo. Se só o sistema sabe disso, não é observável.
- **CA-05:** o teste passa só se a mensagem exibida for exatamente "O roteiro precisa ter pelo menos uma cena.".

## Depois do teste

1. Preencher a tabela acima.
2. Registrar a confirmação humana com nome e data na próxima decisão livre da spec; preservar D-16 como registro histórico.
3. Se algum critério não passar, reescrever na spec e testar de novo.


## Justificativa da revisão técnica

- CA-01: quantidade, ordem e estados pendentes são observáveis na tela e no retorno da criação.
- CA-02: estado concluído e vídeo disponível são verificáveis; a geração real e a decodificação foram testadas. RN-11 define o limite de espera da edição.
- CA-03: estado falhou, erro não vazio e downloads preservados permitem decidir passa/não passa.
- CA-04: com sucesso da nova tentativa como condição, a terceira cena gerada e os arquivos anteriores iguais são verificáveis. A comparação de conteúdo foi testada com SHA-256.
- CA-05 e CA-06: mensagens exatas e ausência de criação são verificáveis; roteiro vazio e 11 cenas foram recusados pela API.
- CA-07: início e duração da contagem estão definidos; relógio controlado testou o instante de 10 minutos. O estado e a mensagem são visíveis na consulta do projeto.
- Nenhum critério cita classe, tabela, framework ou biblioteca. Termos técnicos aqui descrevem a prova, não o texto do critério.

Esta revisão não muda a autoria da revisão cruzada de 03/10 e não é nova revisão por outra equipe. O usuário delegou a revisão ao agente; não informou qual nome dos quatro integrantes corresponde a ele, portanto nenhum nome foi presumido.
