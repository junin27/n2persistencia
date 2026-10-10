# Apresentação N2 — Gabriel

**Suas partes:** 1. Problema e proposta · 2. Spec 001
**Tempo:** 00:00 – 04:00 (cerca de 4 min). Você abre o vídeo.
**Depois de você:** Danilo (harness).

Ordem completa: Gabriel (1–2) → Danilo (3) → Gilberto (4) → Maycon (5) → Gilberto (6) → Maycon (7). Meta de 13 min; o vídeo precisa ter entre 10 e 15.

---

## Parte 1 — Problema e proposta (00:00 – 01:30)

**Na tela:** a página inicial do app (http://localhost:3000) e depois [EVIDENCIA-DO-PROBLEMA.md](../EVIDENCIA-DO-PROBLEMA.md).

**Fala-base:**

> "Nosso projeto é o Deploy Sexta Automation. Ele atende criadores de conteúdo que precisam transformar um roteiro em vídeo. Hoje isso exige separar o roteiro em cenas, gerar cada parte numa ferramenta e juntar tudo em outra, movendo arquivo na mão. Quando uma etapa falha no meio, é comum perder o que já estava pronto.
>
> A nossa proposta é um fluxo único: o criador cola o roteiro, o sistema divide em cenas, gera cada uma, monta o vídeo e, se alguma cena falhar, guarda as que deram certo e refaz só o que faltou."

**Evidência da dor.** Mostre o arquivo e diga com honestidade o que ele é:

> "Como evidência, usamos o relato público de um criador no blog do Descript, que descreve o trabalho de cortar, reorganizar e corrigir continuidade na edição. Esse relato fala de edição de gravações; ele não prova que alguém pagaria pela nossa ferramenta. Ainda não fizemos entrevista com o nosso público."

**Não diga:** que entrevistaram criadores, nem cite número ou estatística. Não existe esse registro.

---

## Parte 2 — Spec 001 (01:30 – 04:00)

**Na tela:** [docs/specs/001-orquestracao-producao.md](../../specs/001-orquestracao-producao.md), descendo pelas seções sem ler tudo.

**1. As sete seções (30 s).** Passe por Objetivo, Escopo, Atores, Dados, Regras, Critérios e Restrições.

> "A spec é o documento que define o comportamento antes do código. Entra: receber o roteiro, dividir em cenas, gerar, montar e mostrar o estado. Fica de fora: publicar no YouTube, cobrança, edição manual e outros idiomas."

**2. A regra mais importante (40 s).** Mostre RN-05 e RN-06 e a tabela "Exemplos da regra RN-05".

> "A RN-05 é a regra central: se uma cena falha, o projeto fica 'falhou', mas o estado e o arquivo das outras cenas continuam. A RN-06 deixa o criador reexecutar, e o sistema processa só o que falhou ou estava pendente."

**3. Um critério de aceite (30 s).** Mostre o CA-03 em Dado/Quando/Então.

> "Cada critério é binário, dá para observar de fora e não cita framework nem banco. É isso que permite virar teste automático depois."

**4. A revisão cruzada (40 s).** Abra [001-revisao.md](../../specs/001-revisao.md).

> "A Maria Goetz, da equipe revisora, apontou que 'mantém as demais cenas geradas' podia significar manter só o arquivo ou também o estado. Corrigimos na D-18: a RN-05 agora diz estado **e** arquivo. Ela também mostrou que faltavam critérios para mais de 10 cenas e para o limite de 10 minutos; criamos o CA-06 e o CA-07."

**5. A mudança de escopo (40 s).** Volte à tabela Decisões e mostre de D-26 a D-35.

> "Quando fomos implementar, percebemos que ainda não tínhamos escolhido os serviços de geração. Decidimos fazer uma versão local: cada cena vira uma imagem com o texto, e o sistema monta um MP4 de verdade, 3 segundos por cena, sem áudio. IA e serviços externos ficaram fora desta versão. Isso está registrado na D-26, e não escondemos a mudança: a spec foi atualizada antes de dizermos que a feature está pronta. Eu revisei e aprovei o plano e essas decisões (D-34), e o restante da equipe confirmou (D-35)."

**Seja honesto em um ponto:** a D-34 diz que a aprovação do plano veio **depois** da implementação, mas o PDF pedia antes. Se o professor perguntar, confirme isso.

**Ao terminar:**

> "Agora o Danilo mostra como configuramos o assistente que construiu isso."

---

## Antes de gravar

- [ ] Deixar o app aberto em http://localhost:3000 (ou na porta 3002, se a 3000 estiver ocupada).
- [ ] Deixar a spec aberta com zoom bom para leitura e a tabela Decisões fácil de achar.

## Depois de gravar (entrega no AVA)

- [ ] Commitar e dar push nestes arquivos de apresentação e em qualquer registro novo; anotar o **hash do commit final**.
- [ ] Publicar o vídeo (YouTube não listado ou Drive com acesso por link).
- [ ] Os quatro enviam no AVA o mesmo conteúdo: link do repositório, link do commit final da feature 001, link do vídeo e os nomes dos quatro.
- [ ] Prazo: 10/10/2026, 23h59.
