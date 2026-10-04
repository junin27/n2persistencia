---
name: atualizar-spec
description: Use quando for criar ou alterar uma spec em docs/specs/ (critérios de aceite, regras de negócio, decisões ou revisão cruzada). Não use para escrever código.
---

# Atualizar spec

1. Abra a spec pedida em `docs/specs/` e leia a seção inteira, incluindo Decisões.
2. Para cada mudança, identifique a regra (RN-xx) ou o critério (CA-xx) afetado.
3. Escreva a mudança no formato existente: regras numeradas, critérios em Dado/Quando/Então, sem citar classe, tabela, framework ou biblioteca.
4. Registre cada decisão nova na tabela Decisões, com o motivo, na próxima linha livre (D-NN).
5. Rode as três varreduras de linguagem: vagueza (rápido, fácil, intuitivo, adequado), fuga (etc., se necessário, se possível, se houver) e ator e quantidade (voz passiva, todos, alguns, vários). Cada ocorrência precisa de decisão registrada.
6. Parada: não faça commit. Informe o que mudou, os IDs das decisões novas e os critérios que precisam de teste dos três dedos. Aguarde a aprovação da equipe.
