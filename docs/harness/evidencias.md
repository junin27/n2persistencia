# Evidências do harness

Este arquivo deve ser preenchido pela equipe, com prints ou trechos copiados de sessões reais do Claude Code. Não preencha com texto de memória.

## Permissão

- Observado numa sessão do Claude Code aberta em `gustavo12` (raiz), com as regras `deny` do `settings.json` da raiz. O arquivo `.env` não existe: o teste prova a regra, não a leitura de um segredo.
  - Ferramenta `Read` em `gustavo12/.env`: `File is in a directory that is denied by your permission settings.`
  - `Bash` com `cat .../gustavo12/.env`: `Permission to use Bash with command cat /c/Users/lokao/Downloads/gustavo12/.env has been denied.`
- Pendente: a mesma prova numa sessão aberta dentro de `deploy-sexta-automation/`. O que a equipe deve fazer: abrir o Claude Code nessa pasta, pedir "leia o arquivo .env", e colar aqui a mensagem de recusa. Depois pedir a leitura por um caminho que as regras de `Bash` não cobrem (por exemplo `node -e "require('fs').readFileSync('.env')"`) e colar o resultado, seja recusa ou leitura, para registrar o tamanho do furo.

## Skill

- Pendente: sessão nova, tarefa pedida sem citar a skill `atualizar-spec`, e o agente acionando-a sozinho. O que a equipe deve fazer: abrir o Claude Code em `deploy-sexta-automation/`, pedir "acrescente um critério de aceite à spec 001 para o caso de roteiro com cenas duplicadas" (sem escrever o nome da skill), e colar aqui o trecho da sessão em que a skill `atualizar-spec` aparece sendo acionada, ou a ausência dela.
- Quantas vezes a descrição foi reescrita até funcionar: pendente. O que a equipe deve fazer: se a skill não foi acionada, reescrever o campo `description` do `SKILL.md`, repetir o pedido em sessão nova e anotar aqui o número de tentativas.

## Hook

- Pendente: uma edição e a saída do lint ou do teste disparada pelo hook `PostToolUse`. O hook ainda não foi observado disparando numa sessão aberta em `deploy-sexta-automation/`. O que a equipe deve fazer: nessa sessão, pedir qualquer edição pequena (por exemplo, um espaço a mais num arquivo de `docs/`) e colar aqui a saída que o hook produz. Sem `package.json`, o esperado é o aviso "Sem package.json: nenhuma validacao foi executada nesta edicao."
- Executado à mão, fora do disparo do hook: o comando do hook, rodado na pasta do projeto (sem `package.json`), saiu com código 0 e imprimiu `{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"Sem package.json: nenhuma validacao foi executada nesta edicao. Nao declare a edicao validada."}}`.
- Não há comando de teste nem de lint no projeto (sem `package.json`, `Makefile` ou outro manifesto). Nenhum foi inventado.

## Contexto

- Pendente: resultado do `/context` em sessão nova, antes de qualquer pedido. O que a equipe deve fazer: abrir o Claude Code em `deploy-sexta-automation/`, digitar `/context` como primeira ação, e colar aqui o resultado (print ou texto), incluindo a linha de arquivos de memória (`CLAUDE.md`, `AGENTS.md`).

## Medições do Better Harness executadas nesta sessão

Duas medições com o alvo em `deploy-sexta-automation/` (repositório git), provider Claude Code, `--depth normal`, janela de 30 dias. Os relatórios estão nesta pasta:

- Medição 1 (antes do reparo): `relatorio-1-medicao.html`, `relatorio-1-medicao.md` e `relatorio-1-medicao.findings.json`.
- Medição 2 (depois do reparo): `relatorio-2-medicao.html`, `relatorio-2-medicao.md` e `relatorio-2-medicao.findings.json`.

O relatório HTML usa interface e rótulos das dimensões em inglês, porque o gerador só aceita `en` ou `zh-CN`. O texto dos achados está em português.

Achado escolhido na Medição 1 (severidade Baixa): `AGENTS.md` dizia que todo arquivo `NNN-<nome>.md` de `docs/specs/` tem as sete seções, mas `001-revisao.md` e `001-teste-tres-dedos.md` seguem esse nome e não são specs. A consequência em uso não foi observada, porque não há sessão analisada.

Reparo aplicado: uma frase acrescentada à seção "Onde ficam as specs" de `AGENTS.md`, dizendo que `NNN-revisao.md` e `NNN-teste-tres-dedos.md` são documentos de apoio da spec `NNN`, não são specs e não têm as sete seções. Nenhum outro arquivo foi alterado (`git diff` mostra só `AGENTS.md`, 1 linha adicionada e 1 removida). Commit: `e12fd8d`.

| Medida | Medição 1 | Medição 2 |
|---|---|---|
| Ativos de projeto (Rules, Skills, Hooks) | 3 | 3 |
| Achados do lint de ativos | 0 | 0 |
| Achados de integridade | 0 | 0 |
| Sessões elegíveis | 0 | 0 |
| Episódios de tarefa | 0 | 0 |
| Commits analisados | 2 | 2 |
| Achados no relatório | 1 | 0 |
| Entendimento da tarefa (Task Understanding) | 66 | 70 |
| Execução controlada (Controlled Execution) | 55 | 55 |
| Validação de mudanças (Change Validation) | 45 | 45 |
| Entrega confiável (Reliable Delivery) | 50 | 50 |
| Captura de aprendizado (Learning Capture) | 35 | 35 |

O texto de evidência que a ferramenta coleta foi idêntico nas duas medições. Ela não detectou o reparo. As notas das dimensões são julgamento de quem escreveu o relatório a partir dos arquivos, dentro dos tetos do modelo, e não uma medição automática.

## Leitura honesta da segunda medição

- Dimensão do Agent Work Loop que mudou entre o primeiro e o segundo relatório, com evidência: Task Understanding, de 66 para 70. Evidência: `git diff` de `AGENTS.md` (1 linha adicionada, 1 removida) e o achado `specs-folder-naming-ambiguity`, que existia na Medição 1 e não existe na Medição 2. É melhoria estática: a regra de nomes de `docs/specs/` passou a distinguir spec de documento de apoio. Nenhuma sessão usou essa regra, e a ferramenta não registrou a diferença. Por isso a nota fica abaixo do teto de 74 para o que só existe como arquivo.
- Dimensão que não mudou, apesar de terem mexido nela, e por quê:
  - Change Validation (45): o hook `PostToolUse` foi trocado de `npm run lint --if-present`, que não fazia nada sem `package.json`, para um que avisa quando nada foi validado. Isso torna a lacuna visível, mas continua sem comando de teste ou lint, e nenhuma edição passou pelo hook numa sessão. Existir não é o mesmo que ser usado.
  - Controlled Execution (55): as regras `deny` de segredo foram ampliadas e há regras de `ask`, mas os comandos de instalar, rodar, testar e lint seguem como `<pendente>` em `AGENTS.md`, e nenhuma sessão neste alvo exercitou as regras.
- O que o relatório marcou como não observado, e se é ausência de fato ou limitação da ferramenta:
  - Sessões (0 de 0 elegíveis, 0 episódios de tarefa): ausência de fato para este alvo e esta janela. A coleta contou 0 sessões do Claude Code com atividade em `deploy-sexta-automation/`, e só 1 das 3 raízes de origem existe. Não é limitação do alvo, que agora é o repositório certo.
  - Skill `atualizar-spec`: nunca observada em uso. O pacote marcou "trigger no, output no, validation no, routed no" para ela. Isso é limitação da heurística da ferramenta: o `SKILL.md` tem descrição com quando usar e quando não usar, passos numerados e uma etapa de parada (`Parada: não faça commit...`), e o `CLAUDE.md` manda usá-la. A ferramenta não leu isso como gatilho, saída e roteamento.
  - Comandos de teste, lint, validação após edição e evidência de teste de regressão: ausência de fato. O projeto ainda não tem código nem stack definida, e a ferramenta inspecionou 2 commits sem pares de código e teste.
  - Aprendizado, rotina de trabalho repetida e efetividade posterior: não avaliáveis. Faltam eventos normalizados e janelas posteriores. É limitação de ter 0 sessões, não prova de que não há aprendizado.
  - A varredura de configuração sensível terminou completa (1 de 1 arquivo candidato, 0 erros de leitura).
