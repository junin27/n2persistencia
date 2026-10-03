# Teste dos três dedos: Spec 001

Roteiro para a equipe testar os critérios de aceite da spec `001-orquestracao-producao.md`. Tempo estimado: 10 minutos.

## Como fazer

Para cada critério, leia em voz alta e responda às três perguntas:

1. **Binário:** o resultado é só passa ou não passa? Não existe "parcialmente" ou "quase"?
2. **Observável:** dá para verificar de fora do sistema, pelo que o criador vê ou recebe?
3. **Livre de implementação:** o texto evita citar classe, tabela, framework ou biblioteca?

Se qualquer resposta for "não" ou "depende", o critério não passa e precisa ser reescrito. Não marque como aprovado antes de reescrever e testar de novo.

## Critérios

| Critério | Binário | Observável | Livre de implementação | Resultado | Testado por | Data |
|---|---|---|---|---|---|---|
| CA-01: roteiro válido gera um projeto | ☐ | ☐ | ☐ | ☐ passa ☐ não passa | | |
| CA-02: projeto concluído entrega um vídeo | ☐ | ☐ | ☐ | ☐ passa ☐ não passa | | |
| CA-03: falha em uma cena não apaga o trabalho feito | ☐ | ☐ | ☐ | ☐ passa ☐ não passa | | |
| CA-04: reexecução processa apenas o que falhou | ☐ | ☐ | ☐ | ☐ passa ☐ não passa | | |
| CA-05: roteiro sem cena é recusado | ☐ | ☐ | ☐ | ☐ passa ☐ não passa | | |
| CA-06: roteiro com mais de 10 cenas é recusado | ☐ | ☐ | ☐ | ☐ passa ☐ não passa | | |
| CA-07: cena que passa de 10 minutos falha | ☐ | ☐ | ☐ | ☐ passa ☐ não passa | | |

## Pontos de atenção

- **CA-02:** "a edição final termina" não diz quanto tempo pode levar. Se a equipe quiser um limite, registre em Decisões.
- **CA-04:** o teste passa só se o criador conseguir ver que a cena 3 mudou para "gerada" e que o arquivo das cenas 1 e 2 é o mesmo. Se só o sistema sabe disso, não é observável.
- **CA-05:** o teste passa só se a mensagem exibida for exatamente "O roteiro precisa ter pelo menos uma cena.".

## Depois do teste

1. Preencher a tabela acima.
2. Copiar o resultado para o D-16 da spec `001-orquestracao-producao.md`, com o nome de quem testou e a data.
3. Se algum critério não passar, reescrever na spec e testar de novo.
