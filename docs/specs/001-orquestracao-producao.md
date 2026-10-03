# Spec 001: Orquestração da produção de vídeo (roteiro → geração → edição)

> **Status:** rascunho para revisão cruzada. Todas as decisões estão na seção Decisões. A pergunta de reconstrução e a revisão cruzada ainda estão pendentes.

## 1. Objetivo

Permitir que um criador de conteúdo leve um roteiro até um vídeo editado final dentro de um único fluxo, sem copiar e colar prompts nem mover arquivos entre ferramentas manualmente.

## 2. Escopo

**Entra:**
- Receber um roteiro em texto e dividi-lo em cenas.
- Gerar uma imagem ou clipe para cada cena.
- Montar as cenas geradas em uma edição final.
- Informar o estado de cada etapa ao criador.

**Não entra (nesta feature):**
- Ideação ou geração do roteiro pelo sistema.
- Publicação automática no YouTube ou em outras redes.
- Edição fina manual dentro da plataforma (a edição final é gerada pelo fluxo).
- Cobrança, assinatura e controle de acesso beta.
- Suporte a idiomas diferentes do português.

## 3. Atores

- **Criador de conteúdo:** envia o roteiro, acompanha o andamento e baixa o resultado.
- **Sistema orquestrador:** executa as etapas em ordem e registra o estado de cada uma.
- **Serviços externos de geração e edição:** produzem as imagens, os clipes e a montagem final. Não são controlados pelo criador.

## 4. Dados

- **Roteiro:** texto livre, com cada cena separada por uma linha em branco. Mínimo de 1 cena e máximo de 10 cenas (ver RN-10).
- **Cena:** número sequencial, texto da cena, estado (pendente, gerada, falhou) e referência ao arquivo gerado.
- **Projeto de vídeo:** roteiro, lista de cenas, estado geral (em andamento, concluído, falhou) e arquivo final.

## 5. Regras de negócio

- **RN-01:** um roteiro deve conter pelo menos 1 cena para ser aceito.
- **RN-02:** o roteiro é dividido em cenas na ordem em que aparece no texto.
- **RN-03:** uma execução é cada envio do projeto pelo criador, seja a criação ou uma reexecução (RN-06). Em cada execução, o sistema processa cada cena no máximo uma vez. Uma cena já gerada não é recriada.
- **RN-04:** o sistema inicia a edição final somente quando todas as cenas do projeto estiverem geradas.
- **RN-05:** se uma cena falhar, o projeto fica com estado "falhou" e a cena fica com estado "falhou" e uma mensagem de erro registrada no projeto. O sistema mantém o estado e o arquivo das demais cenas geradas.
- **RN-06:** o criador pode reexecutar um projeto que falhou. O sistema processa novamente apenas as cenas com estado "falhou" ou "pendente".
- **RN-07:** o projeto concluído expõe um único arquivo de vídeo final para download.
- **RN-08:** se a geração de uma cena não terminar em 10 minutos, contados a partir do início da geração da cena (o tempo de espera antes desse início não conta), a cena é considerada falhou.
- **RN-09:** o sistema não repete automaticamente uma cena que falhou. Apenas o criador dispara novas tentativas, pelo fluxo da RN-06.
- **RN-11:** a edição final deve terminar em até 30 minutos, contados a partir do início do processamento da edição final (o tempo de espera antes desse início não conta). Se passar desse tempo, o projeto fica com estado "falhou" e a mensagem "A edição final excedeu o limite de 30 minutos.", e as cenas geradas são mantidas.
- **RN-10:** um roteiro com mais de 10 cenas, ou com alguma cena com mais de 2.000 caracteres, é recusado com a mensagem "O roteiro excede o limite de 10 cenas de até 2.000 caracteres cada." e nenhum projeto é criado.

## 6. Critérios de aceite

**CA-01: roteiro válido gera um projeto**
- **Dado** que o criador envia um roteiro com 3 cenas,
- **Quando** o envio é confirmado,
- **Então** o sistema cria um projeto com 3 cenas na ordem do roteiro, todas no estado "pendente".

**CA-02: projeto concluído entrega um vídeo**
- **Dado** que todas as cenas de um projeto foram geradas,
- **Quando** a edição final termina,
- **Então** o projeto muda para "concluído" em até 30 minutos depois de a edição final começar a ser processada (RN-11). O tempo de espera antes desse início não conta. O projeto expõe um arquivo de vídeo para download.

**CA-03: falha em uma cena não apaga o trabalho feito**
- **Dado** que um projeto de 3 cenas teve as cenas 1 e 2 geradas e a cena 3 falhou,
- **Quando** o criador consulta o projeto,
- **Então** o projeto está "falhou", a cena 3 exibe uma mensagem de erro não vazia, e as cenas 1 e 2 continuam disponíveis para download no projeto.

**CA-04: reexecução processa apenas o que falhou**
- **Dado** um projeto de 3 cenas em que as cenas 1 e 2 foram geradas e a cena 3 falhou,
- **Quando** o criador solicita a reexecução,
- **Então** a cena 3 passa a mostrar o estado "gerada" na tela do projeto, e as cenas 1 e 2 continuam com o mesmo arquivo que tinham antes da reexecução.

**CA-06: roteiro com mais de 10 cenas é recusado**
- **Dado** que o criador envia um roteiro com 11 cenas,
- **Quando** o envio é confirmado,
- **Então** o sistema mostra a mensagem "O roteiro excede o limite de 10 cenas de até 2.000 caracteres cada." e nenhum projeto é criado.

**CA-07: cena que passa de 10 minutos falha**
- **Dado** que a geração de uma cena de um projeto começou há 10 minutos e ainda não terminou (o tempo de espera antes do início não conta, RN-08),
- **Quando** o limite de 10 minutos é atingido,
- **Então** a cena muda para "falhou", exibe a mensagem "A geração da cena excedeu 10 minutos." e o projeto muda para "falhou".

**CA-05: roteiro sem cena é recusado**
- **Dado** que o criador envia um roteiro vazio ou formado só por espaços,
- **Quando** o envio é confirmado,
- **Então** o sistema mostra a mensagem "O roteiro precisa ter pelo menos uma cena." e nenhum projeto é criado.

## Exemplos da regra RN-05 (falha em cena)

RN-05 é a regra mais importante desta feature: ela define se o criador perde o trabalho já feito quando algo falha.

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Feliz | Projeto de 3 cenas, todas geradas com sucesso | Projeto "concluído", vídeo final disponível para download (RN-07) |
| Borda | Projeto de 3 cenas; a cena 2 falha, o criador reexecuta (RN-06) e a cena 2 é gerada | Projeto "concluído". Cenas 1 e 3 mantêm o mesmo arquivo, sem recriação (RN-03) |
| Erro | Projeto de 3 cenas; o serviço externo falha em todas as cenas | Projeto "falhou", as 3 cenas com estado "falhou" e mensagem de erro. Nenhum vídeo final é gerado |

## 7. Restrições

- O sistema depende de serviços externos de geração e edição. Se um deles estiver indisponível, a cena correspondente falha sem derrubar o projeto inteiro.
- O sistema gera o vídeo final em MP4, 1080p, 16:9.
- Não há orçamento de chamadas aos serviços externos por projeto nesta feature. O limite de cenas (RN-10) restringe o número de chamadas. A equipe medirá o custo real por projeto no beta e tratará o orçamento em feature futura.
- Os criadores e o sistema usam apenas português no texto do roteiro e na interface.

---

## Decisões

Cada ambiguidade encontrada e o que a equipe decidiu. Preencher antes da revisão cruzada.

_Validação das decisões D-01 a D-17 pela equipe: validado em 03/10/2026. As decisões D-18 a D-23, vindas da revisão cruzada, foram validadas pela equipe em 03/10/2026. CA-06 e CA-07 aguardam o teste dos três dedos._

| # | Ambiguidade | Decisão | Motivo |
|---|---|---|---|
| D-01 | Formato de entrada do roteiro e limites (seção 4, RN-10) | Texto livre, cenas separadas por linha em branco; máximo de 10 cenas de 2.000 caracteres | Formato simples, de divisão previsível e verificável pelo teste dos três dedos |
| D-02 | Tempo máximo por cena (RN-08) | 10 minutos | Valor inicial. Deve ser validado com medição real nos testes. Alterar este valor exige nova decisão nesta tabela |
| D-03 | Limite de reexecuções automáticas (RN-09) | Superado por D-06 | Não há reexecução automática, então não há limite a definir |
| D-04 | Tamanho e formato do vídeo final (seção 7) | MP4, 1080p, 16:9 | Formato padrão do YouTube. Confirmar com o formato do canal (se for Shorts, muda) |
| D-05 | Orçamento de chamadas externas (seção 7) | Sem orçamento por projeto nesta feature | O limite de cenas (RN-10) já restringe as chamadas; o custo real só aparece no beta |
| D-06 | Cláusula "se houver" em RN-09 (fuga de linguagem) | Não há reexecução automática; só o criador reexecuta (RN-06) | Evita regra aberta e mantém o custo de chamadas sob controle do criador |
| D-07 | "Mensagem que explica o motivo" em CA-05 (vagueza) | Texto fixo: "O roteiro precisa ter pelo menos uma cena." | Permite verificar o comportamento pelo teste dos três dedos |
| D-08 | "Mensagem do serviço externo" em RN-05 (dependência de serviço) | Mensagem de erro registrada no projeto, sem depender do texto do serviço | Mantém a regra independente do fornecedor escolhido |
| D-09 | Regra mais importante para a tabela de exemplos | RN-05 (falha em cena) | Define se o criador perde o trabalho feito, que é o risco central do produto |
| D-10 | Voz passiva sem ator em RN-03, RN-04, RN-05, RN-06, CA-04 e seção 7 ("é processada", "é iniciada", "são mantidas", "é gerado") | Ator explícito: "o sistema" em cada frase | Atende ao teste de ator e quantidade; a spec não deixa dúvida sobre quem executa |
| D-11 | Voz passiva sem ator na seção 7 ("será medido no beta") | "A equipe medirá o custo real no beta" | Mesmo critério de D-10 |
| D-12 | "Alterar este valor exige nova decisão" (D-02) | Sem condição aberta; a mudança sempre passa pela tabela | Remove a cláusula condicional "se a medição mudar", que é uma fuga de linguagem |
| D-13 | "Todas as cenas" em RN-04 e CA-02 (quantidade) | Significa todas as cenas do próprio projeto, no número definido na criação | Quantidade fechada, sem ambiguidade sobre o escopo da regra |
| D-14 | Varredura de vagueza (rápido, fácil, intuitivo, adequado) | Nenhuma ocorrência encontrada no corpo da spec. As únicas citações estão nesta tabela, como exemplo de decisão tomada | Sem ação necessária |
| D-15 | Varredura de fuga (etc., se necessário, se possível, se houver) | Único caso ("se houver", RN-09) resolvido por D-06. Demais citações estão nesta tabela | Sem cláusula aberta restante no corpo da spec |
| D-16 | Teste dos três dedos nos critérios CA-01 a CA-05 (binário, observável, livre de implementação) | Primeira rodada (03/10/2026): Maycon (produto), Danilo (técnico) e Gabriel (QA). Reprovados: CA-02 (Danilo), CA-03 (Maycon, Gabriel), CA-04 (Maycon). Reteste (03/10/2026): CA-02 por Danilo, CA-03 e CA-04 por Maycon e Gabriel, todos aprovados. Ajustes feitos a partir do reteste: início da contagem dos 30 minutos explicitado no CA-02; CA-04 agora descreve o próprio cenário, sem depender do CA-03. Nenhum critério cita classe, tabela, framework ou biblioteca | Maycon e Gabriel aprovaram o CA-02 na versão anterior, sem o limite de 30 minutos. Pedir que confirmem a versão atual |
| D-18 | Ambiguidade de "mantém as demais cenas geradas" (RN-05) | Mantém o estado e o arquivo das demais cenas | Apontado na revisão cruzada (P2) |
| D-19 | Ambiguidade de "execução" (RN-03) | Execução é cada envio do projeto pelo criador, criação ou reexecução | Apontado na revisão cruzada (P2) |
| D-20 | Ambiguidade de contagem de 30 minutos (CA-02, RN-11) | A contagem começa quando a edição final começa a ser processada. Espera na fila não conta | Apontado na revisão cruzada (P2) |
| D-21 | Falta de critério para roteiro com mais de 10 cenas (RN-10) | Criado CA-06 | Apontado na revisão cruzada (P3) |
| D-22 | Lacuna sobre como o criador acompanha o andamento | Mantido como lacuna na pergunta de reconstrução | Apontado na revisão cruzada (P1). Definir o acompanhamento exige decisão da equipe |
| D-23 | Falta de critério para cena que passa de 10 minutos (RN-08) | Criado CA-07, com mensagem "A geração da cena excedeu 10 minutos." | Apontado na revisão cruzada (P3). A mensagem é nova e precisa de validação da equipe |
| D-24 | Início da contagem de 10 minutos (RN-08, CA-07) | A contagem começa quando a geração da cena começa, como em D-20. A espera antes disso não conta | Reprovado por Danilo e Gilberto no teste de CA-07: sem o início definido, dois testadores podem chegar a resultados diferentes. Reteste em 03/10/2026 por Danilo e Gilberto, com o texto novo: passa, em linha com o resultado de Maycon |
| D-25 | Casos de borda de CA-06 (10 cenas aceitas, 11 recusadas) | Sem mudança no critério. Os casos ficam como anotação para os testes | Sugestão do Gabriel. CA-06 cobre o caso de 11 cenas. O caso de 10 cenas aceitas não tem critério próprio e fica como anotação para o teste |
| D-17 | Limite de tempo da edição final (CA-02, RN-11) | 30 minutos. Aplicado na spec como RN-11 e no CA-02. Aguarda confirmação da equipe | Reprovado por Danilo no teste dos três dedos: sem prazo, a espera pode ser indefinida. Valor proposto pelo autor, não definido em nenhum documento da disciplina |

**Pergunta de reconstrução:** se o código fosse apagado agora, esta spec seria suficiente para reconstruí-lo?

_Resposta:_ **Não.** A spec define o comportamento visível (projeto, cenas, estados, regras e exemplos), mas não define o suficiente para reimplementar o sistema. Falta:
- **Serviços externos:** quais serviços de geração e de edição são usados, e o formato de entrada e saída de cada chamada.
- **Montagem da edição final:** ordem das cenas, transições, áudio e duração do vídeo.
- **Acompanhamento:** como o criador vê o andamento (atualização automática ou consulta manual) e o formato da mensagem de erro.
- **Armazenamento:** onde os arquivos das cenas e o vídeo final ficam guardados, por quanto tempo e como o download é feito.
- **Tratamento de falha de serviço externo:** o que acontece com uma cena se o serviço ficar indisponível durante a geração, além do tempo máximo de RN-08.

Essas lacunas devem entrar na spec antes da revisão cruzada, ou ser registradas como decisões explícitas de fora de escopo.
