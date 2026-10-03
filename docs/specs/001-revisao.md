# Revisão cruzada: Spec 001 (orquestração da produção de vídeo)

- **Spec revisada:** `docs/specs/001-orquestracao-producao.md` (Deploy Sexta Automation)
- **Equipe revisora:** Enildo e Maria Goetz
- **Data da revisão:** 03/10/2026

## 1. Consegui entender o que deve ser construído sem perguntar nada a vocês?

**Resposta da equipe revisora:**

Em grande parte, sim. Deu para entender o fluxo: o criador envia um roteiro, o sistema divide em cenas, gera cada uma e monta o vídeo final. As regras de falha e reexecução também ficaram claras. O que não deu para entender sem perguntar foi como o criador acompanha o andamento (a spec diz que o sistema informa o estado, mas não como) e quais serviços de geração e edição são usados.

*Respondido por: Enildo*

## 2. Achei alguma frase que admite duas leituras diferentes?

**Resposta da equipe revisora:**

Achamos três. Na RN-05, "mantém as demais cenas geradas" pode significar manter o arquivo ou manter também o estado "gerada". Na RN-03, "uma única vez por execução" não deixa claro o que conta como uma execução. No CA-02, "em até 30 minutos depois do início da edição final" não diz se o tempo de espera na fila entra na contagem.

*Respondido por: Maria Goetz*

## 3. Consigo dizer, lendo só os critérios de aceite, se a feature está pronta?

**Resposta da equipe revisora:**

Para o caminho principal, sim: CA-01 a CA-05 cobrem criar o projeto, entregar o vídeo, falhar uma cena, reexecutar e recusar roteiro vazio. Mas não dá para dizer que a feature está pronta, porque nenhum critério cobre a recusa de roteiro com mais de 10 cenas (RN-10) nem o limite de 10 minutos por cena (RN-08).

*Respondido por: Maria Goetz e Enildo*

## Ações tomadas pela equipe autora

| Resposta | Ação tomada | Onde foi registrada |
|---|---|---|
| P1: falta como o criador acompanha o andamento | Mantido como lacuna | Seção Decisões, D-22 |
| P2: RN-05 "mantém as demais cenas geradas" | Reescrito para "mantém o estado e o arquivo das demais cenas geradas" | D-18 |
| P2: RN-03 "execução" | Definido: cada envio do projeto pelo criador, seja a criação ou uma reexecução | D-19 |
| P2: CA-02 fila | Contagem de 30 minutos começa quando a edição final começa a ser processada | D-20 |
| P3: faltam critérios para RN-10 e RN-08 | Criados CA-06 e CA-07 | D-21 e D-23 |
