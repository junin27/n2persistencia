# Diário do agente - feature 001 (10/10/2026)

Registro desta sessão no Codex. A equipe já usava Claude Code; este diário não apresenta ferramentas do Codex como prova de execução do harness Claude Code.

**Autonomia.** O usuário pediu orientação por estar perdido, recebeu uma proposta de versão local e autorizou continuar. O agente preparou decisões/plano e implementou a versão local, com verificações antes de declarar conclusão. A autonomia foi de implementação e verificação local; não houve aprovação atribuída aos demais integrantes, commit, push ou entrega no AVA.

**Erro e sensor.** A primeira montagem produziu um MP4 de três cenas com 8,96 segundos, quando a decisão previa 9 segundos. O teste de integração decodificou o arquivo com FFmpeg e falhou na duração. O agente corrigiu a montagem para produzir 72 quadros por cena a 24 fps. O mesmo teste passou sem alterar a expectativa. O build também encontrou assinatura de mocks incompatível com os tipos; os mocks foram tipados sem desativar a verificação.

**Pergunta antes de assumir.** O agente perguntou quais serviços externos haviam sido escolhidos. O usuário informou que a equipe estava perdida e pediu uma sugestão. A proposta local foi explicada, distinguindo-a de integração externa e IA; o usuário autorizou continuar. Essa autorização não significa aprovação do professor ou revisão dos quatro integrantes.

**Melhoria do harness.** Incluir geração/decodificação real na prova de entrega: testar apenas estado/arquivo fictício não detectaria a duração incorreta. AGENTS.md recebeu comandos reproduzíveis, versões, instalação de FFmpeg e a prova HTTP. A geração automática de instruções do Next foi desativada para preservar o AGENTS.md curto. O hook agora usa um script Node portátil com saída explícita do lint; seu comando passou em execução direta. Ainda falta capturar o acionamento real pelo Claude Code e fechar a prova de bloqueio de segredos no próprio projeto. Não há hash de reparo, pois esta sessão não criou commits.

**Limites.** O provedor local gera imagens de texto e monta MP4, sem chamadas externas/IA. Isso altera o escopo inicial e está nas novas Decisões. Os testes rápidos simulam falha/latência de maneira explícita; testes de integração geram mídia real. A revisão pelos demais integrantes e clone limpo humano continuam pendentes.

**Revisão delegada.** A pedido do usuário, o Codex revisou critérios/documentação e corrigiu mensagens vazias, sobreposição por quebras de linha e consulta atrasada na interface. Foram acrescentados três testes úteis: a suíte passou com 21 testes. D-33 registra as correções do texto/erro. O teste dos três dedos identifica o executor como agente, sem assinaturas humanas.
