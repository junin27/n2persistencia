# Spec 001: Orquestração da produção de vídeo (roteiro → geração → edição)

> **Status:** versão local implementada e revisada tecnicamente pelo Codex em 10/10/2026, a pedido do usuário. Revisão textual dos sete critérios em 001-teste-tres-dedos.md. Revisão cruzada histórica de 03/10 preservada. Os quatro integrantes aprovaram D-26 a D-33 e o plano em 10/10/2026, depois da implementação: Gabriel diretamente (D-34); Maycon, Danilo e Gilberto conforme informado por Gabriel (D-35). A aceitação da mudança de escopo pelo professor não foi confirmada.

## 1. Objetivo

Permitir que um criador de conteúdo leve um roteiro até um vídeo editado final dentro de um único fluxo, sem copiar e colar prompts nem mover arquivos entre ferramentas manualmente.

## 2. Escopo

**Entra:**
- Receber um roteiro em texto e dividi-lo em cenas.
- Gerar uma imagem com o texto completo de cada cena na versão local (D-26).
- Montar as cenas geradas em uma edição final.
- Informar o estado de cada etapa ao criador.

**Não entra (nesta feature):**
- Ideação ou geração do roteiro pelo sistema.
- Publicação automática no YouTube ou em outras redes.
- Edição fina manual dentro da plataforma (a edição final é gerada pelo fluxo).
- Cobrança, assinatura e controle de acesso beta.
- Suporte a idiomas diferentes do português.
- Geração por IA e integração com serviços externos na versão local (D-26).

## 3. Atores

- **Criador de conteúdo:** envia o roteiro, acompanha o andamento e baixa o resultado.
- **Sistema orquestrador:** executa as etapas em ordem e registra o estado de cada uma.
- **Serviços locais de geração e edição:** produzem imagens com texto e montam o vídeo final. Nesta versão não chamam APIs externas (D-26).

## 4. Dados

- **Roteiro:** texto livre, com cada cena separada por uma linha em branco. Mínimo de 1 cena e máximo de 10 cenas (ver RN-10).
- **Cena:** número sequencial, texto da cena, estado (pendente, gerada, falhou) e referência ao arquivo gerado.
- **Projeto de vídeo:** roteiro, lista de cenas, estado geral (em andamento, concluído, falhou) e arquivo final.

## 5. Regras de negócio

- **RN-01:** um roteiro deve conter pelo menos 1 cena para ser aceito.
- **RN-02:** o roteiro é dividido em cenas na ordem em que aparece no texto.
- **RN-03:** uma execução é cada envio do projeto pelo criador, seja a criação ou uma reexecução (RN-06). Em cada execução, o sistema processa cada cena no máximo uma vez. Uma cena já gerada não é recriada.
- **RN-04:** o sistema inicia a edição final somente quando todas as cenas do projeto estiverem geradas.
- **RN-05:** se uma cena falhar, o projeto fica com estado "falhou" e a cena fica com estado "falhou" e uma mensagem de erro registrada na cena e no projeto. O sistema mantém o estado e o arquivo das demais cenas geradas.
- **RN-06:** o criador pode reexecutar um projeto que falhou. O sistema processa novamente apenas as cenas com estado "falhou" ou "pendente".
- **RN-07:** o projeto concluído expõe um único arquivo de vídeo final para download.
- **RN-08:** se a geração de uma cena não terminar em 10 minutos, contados a partir do início da geração da cena (o tempo de espera antes desse início não conta), a cena é considerada falhou.
- **RN-09:** o sistema não repete automaticamente uma cena que falhou. Apenas o criador dispara novas tentativas, pelo fluxo da RN-06.
- **RN-10:** um roteiro com mais de 10 cenas, ou com alguma cena com mais de 2.000 caracteres, é recusado com a mensagem "O roteiro excede o limite de 10 cenas de até 2.000 caracteres cada." e nenhum projeto é criado.
- **RN-11:** a edição final deve terminar em até 30 minutos, contados a partir do início do processamento da edição final (o tempo de espera antes desse início não conta). Se passar desse tempo, o projeto fica com estado "falhou" e a mensagem "A edição final excedeu o limite de 30 minutos.", e as cenas geradas são mantidas.

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
- **Dado** um projeto de 3 cenas em que as cenas 1 e 2 foram geradas, a cena 3 falhou e o serviço de geração está disponível na nova tentativa,
- **Quando** o criador solicita a reexecução,
- **Então** a cena 3 passa a mostrar o estado "gerada" na tela do projeto, e as cenas 1 e 2 continuam com o mesmo arquivo que tinham antes da reexecução.

**CA-05: roteiro sem cena é recusado**
- **Dado** que o criador envia um roteiro vazio ou formado só por espaços,
- **Quando** o envio é confirmado,
- **Então** o sistema mostra a mensagem "O roteiro precisa ter pelo menos uma cena." e nenhum projeto é criado.

**CA-06: roteiro com mais de 10 cenas é recusado**
- **Dado** que o criador envia um roteiro com 11 cenas,
- **Quando** o envio é confirmado,
- **Então** o sistema mostra a mensagem "O roteiro excede o limite de 10 cenas de até 2.000 caracteres cada." e nenhum projeto é criado.

**CA-07: cena que passa de 10 minutos falha**
- **Dado** que a geração de uma cena de um projeto começou há 10 minutos e ainda não terminou (o tempo de espera antes do início não conta, RN-08),
- **Quando** o limite de 10 minutos é atingido,
- **Então** a cena muda para "falhou", exibe a mensagem "A geração da cena excedeu 10 minutos." e o projeto muda para "falhou".

## Exemplos da regra RN-05 (falha em cena)

RN-05 é a regra mais importante desta feature: ela define se o criador perde o trabalho já feito quando algo falha.

| Caso | Entrada | Resultado esperado |
|---|---|---|
| Feliz | Projeto de 3 cenas, todas geradas com sucesso | Projeto "concluído", vídeo final disponível para download (RN-07) |
| Borda | Projeto de 3 cenas; a cena 2 falha, o criador reexecuta (RN-06) e a cena 2 é gerada | Projeto "concluído". Cenas 1 e 3 mantêm o mesmo arquivo, sem recriação (RN-03) |
| Erro | Projeto de 3 cenas; o serviço de geração falha em todas as cenas | Projeto "falhou", as 3 cenas com estado "falhou" e mensagem de erro. Nenhum vídeo final é gerado |

## 7. Restrições

- Na versão local, o sistema gera imagens de texto e monta o vídeo com serviços executados na própria máquina. Falha de uma cena não impede tentar as demais; falha da montagem preserva as imagens (D-26, D-30).
- O sistema gera o vídeo final em MP4, 1080p, 16:9.
- A versão local não faz chamadas externas. Orçamento e custo de fornecedores externos serão definidos somente quando essa integração entrar no escopo.
- Os criadores e o sistema usam apenas português no texto do roteiro e na interface.

---

## Decisões

Registro histórico das ambiguidades e decisões. As novas decisões de 10/10 foram revisadas tecnicamente pelo Codex a pedido do usuário e aprovadas pelos quatro integrantes (D-34 e D-35).

_O registro de 03/10 relata aprovação das decisões e reteste de CA-07 em D-24. Entretanto, D-17 e D-16 contêm confirmações pendentes. A revisão técnica pelo Codex de 10/10 está em 001-teste-tres-dedos.md; não substitui confirmação dos integrantes. Consolidar as confirmações históricas antes da entrega._

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
| D-26 | Serviços de geração/edição ainda não escolhidos | Versão local: cada cena vira uma imagem com seu texto; montagem local. Integrações externas e geração por IA ficam fora desta versão | Proposta explicada ao usuário, que autorizou continuar em 10/10. Simplificação explícita; não é prova de integração externa nem aprovação do professor |
| D-27 | Como acompanhar e quando começar | Criação mostra cenas pendentes. O criador usa “Gerar vídeo”; a tela consulta o andamento durante a execução e oferece atualização manual | Preserva CA-01 e torna o andamento observável; substitui a lacuna D-22 |
| D-28 | Montagem, áudio, duração e ordem | Cada cena ocupa 3 segundos; ordem original; cortes simples; sem áudio; MP4 1920 x 1080, 16:9 | Fecha montagem sem ampliar para editor manual ou narração |
| D-29 | Armazenamento e retenção | Projetos e arquivos ficam na máquina local, disponíveis após reiniciar. Sem expiração automática; operador pode remover dados locais com o servidor parado. Interface permite reabrir pelo identificador | Define download e continuidade sem prometer nuvem ou multiusuário |
| D-30 | Falha de cena e falha de edição | Registrar erro não vazio; tentar as demais cenas. Se a montagem falhar, preservar cenas e permitir reexecutar a montagem. Não repetir automaticamente | Concilia RN-03 a RN-06 e RN-09; novo erro de cena nunca invalida arquivos já gerados |
| D-31 | Quando CA-04 garante sucesso | A disponibilidade do serviço na nova tentativa é condição do cenário. Se falhar novamente, manter estado falhou e preservar arquivos anteriores | Evita prometer sucesso de fornecedor indisponível; CA-04 atualizado requer reteste humano |
| D-32 | Caracteres, separadores e quantidades | Linhas em branco separam cenas; espaços nas extremidades não contam; linhas simples permanecem na cena. Caracteres contam pontos Unicode. “Todas” refere-se às 1 a 10 cenas do projeto. Uma única execução ativa por projeto; concluído não reexecuta | Fecha limites de RN-10, quantidade e concorrência; implementação e testes devem usar a mesma regra |
| D-33 | Texto com muitas quebras de linha na imagem | Na imagem, espaços e quebras simples viram um espaço, mantendo as palavras na ordem. O texto original permanece no projeto e na tela. Erro sem mensagem recebe explicação não vazia | Revisão de 10/10 encontrou risco de sobreposição em cenas de até 2.000 caracteres; garante conteúdo visual e RN-05 sem ampliar o escopo |
| D-34 | Revisão humana do plano e de D-26 a D-33 (incluindo CA-04 atualizado) | Gabriel revisou e aprovou o plano e as decisões D-26 a D-33 em 10/10/2026. Maycon, Danilo e Gilberto ainda não confirmaram. A aprovação não é reteste dos três dedos do CA-04 pedido em D-31 | A atividade de 03/10 pede revisão do plano antes do código. Esta revisão ocorreu depois da implementação e fica registrada com a data real, sem retroagir |
| D-35 | Confirmação de Maycon, Danilo e Gilberto pendente em D-34 | Maycon, Danilo e Gilberto aprovaram o plano e as decisões D-26 a D-33, incluindo CA-04 atualizado, conforme informado por Gabriel em 10/10/2026. D-34 continua válida para a aprovação de Gabriel. A aprovação não é reteste dos três dedos do CA-04 pedido em D-31 | Atualiza a pendência de D-34 sem reescrevê-la. A fonte é o relato de Gabriel, registrado como tal |
| D-36 | Reteste humano do CA-04 atualizado, solicitado em D-31 | Maycon confirmou em 10/10/2026 que o CA-04 é binário, observável pela consulta do estado e comparação dos arquivos, e compreensível sem conhecer o código. Resultado: passa no teste dos três dedos; sem alteração no critério ou nas RN-03, RN-05 e RN-06 | Fecha o reteste humano pendente em D-31, D-34 e D-35. A conferência humana do vídeo normal e a prova automática de falha/reexecução estão separadas em REVISAO-MAYCON-CA04.md; não atribui aprovações aos demais integrantes |

**Pergunta de reconstrução:** se o código fosse apagado agora, esta spec seria suficiente para reconstruí-lo?

_Resposta em 10/10:_ **Sim para o comportamento da versão local descrita**, com imagens contendo o texto completo, 3 segundos por cena, montagem sem áudio, estados e downloads persistidos localmente. Não define uma integração externa ou geração por IA: essas funções estão explicitamente fora da versão local em D-26. A validação humana desta resposta pelos demais integrantes está pendente.

**Varreduras de 10/10:** termos de vagueza/fuga devem ser distinguidos de citações históricas nesta tabela. “Todas” tem quantidade fechada em D-32; “disponível” em CA-04 significa que a nova chamada termina com sucesso. A restrição histórica de custo de APIs aplica-se apenas à integração futura. Não há condição “se possível”/“se necessário” no comportamento da versão local.
