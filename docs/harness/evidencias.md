# Evidências do harness

Este arquivo deve ser preenchido pela equipe, com prints ou trechos copiados de sessões reais do Claude Code. Não preencha com texto de memória.

## Permissão

- Observado numa sessão do Claude Code aberta em `gustavo12` (raiz), com as regras `deny` do `settings.json` da raiz. O arquivo `.env` não existe: o teste prova a regra, não a leitura de um segredo.
  - Ferramenta `Read` em `gustavo12/.env`: `File is in a directory that is denied by your permission settings.`
  - `Bash` com `cat .../gustavo12/.env`: `Permission to use Bash with command cat /c/Users/lokao/Downloads/gustavo12/.env has been denied.`
- Ainda não testado: sessão aberta dentro de `deploy-sexta-automation/`, e uma leitura por outro caminho de shell (por exemplo `node -e` ou `python`), que as regras de `Bash` não cobrem.

## Skill

- Pendente: sessão nova, tarefa pedida sem citar a skill `atualizar-spec`, e o agente acionando-a sozinho.
- Quantas vezes a descrição foi reescrita até funcionar: pendente.

## Hook

- Pendente: uma edição e a saída do lint ou do teste disparada pelo hook `PostToolUse`. O hook ainda não foi observado disparando numa sessão aberta em `deploy-sexta-automation/`.
- Executado à mão nesta sessão, fora do disparo do hook: o comando do hook, rodado na pasta do projeto (sem `package.json`), saiu com código 0 e imprimiu `{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"Sem package.json: nenhuma validacao foi executada nesta edicao. Nao declare a edicao validada."}}`.
- Não há comando de teste nem de lint no projeto (sem `package.json`, `Makefile` ou outro manifesto). Nenhum foi inventado.

## Contexto

- Pendente: resultado do `/context` em sessão nova, antes de qualquer pedido.

## Medições do Better Harness executadas nesta sessão

Três coletas do pacote de evidências, todas com provider Claude Code, `--depth quick`, janela de 7 dias, saída inline (nenhum relatório foi gravado em arquivo) e alvo `gustavo12` (a pasta acima do projeto, que não é repositório git). Nenhuma foi rodada com o alvo em `deploy-sexta-automation/`.

| Medida | 1ª | 2ª | 3ª |
|---|---|---|---|
| Ativos de projeto vistos | 0 | 1 (`CLAUDE.md` da raiz `gustavo12`) | 1 |
| Regras (`rules`) | 0 | 1 | 1 |
| Achados do lint de ativos | 0 | 0 | 0 |
| Achados de integridade | 0 | 0 | 0 |
| Sessões analisadas | 0 de 0 | 0 de 0 | 0 de 0 |
| Lane de Harness do projeto | indisponível (`GIT_COMMAND_FAILED`) | indisponível | indisponível |

Reparos aplicados entre as medições, e o que cada um mudou:

- Hook `PostToolUse`: o comando era `npm run lint --if-present`, que sai com sucesso sem rodar nada quando não há `package.json`. Passou a rodar `npm run lint` se houver `package.json` e, se não houver, a avisar que nada foi validado.
- Permissões de segredo: além de `./.env` e `./.env.*`, as regras `deny` passaram a cobrir `.env` em qualquer subpasta (`**/.env`, `**/.env.*`) e a leitura por `cat`, `type`, `head`, `tail`, `grep` e `Get-Content`.
- Raiz `gustavo12`: criados `CLAUDE.md` (importa o `CLAUDE.md` do projeto) e `.claude/settings.json` (só com as regras `deny` de segredo).

O relatório só enxerga ativos e sessões. Ele não mede os reparos de hook e de permissão.

## Leitura honesta da segunda medição

- Dimensão do Agent Work Loop que mudou entre o primeiro e o segundo relatório, com evidência: pendente. Não há sessões analisadas em nenhuma das medições, então nenhuma dimensão é comparável. O único dado que mudou foi o inventário (0 para 1 ativo de projeto na raiz `gustavo12`).
- Dimensão que não mudou, apesar de terem mexido nela, e por quê: pendente. Hook e permissões foram alterados, mas o relatório não os mede e não houve sessão que os exercitasse.
- O que o relatório marcou como não observado, e se é ausência de fato ou limitação da ferramenta:
  - Sessões (`analyzed 0 of 0 eligible sessions`): não confirmado se é ausência de fato. A ferramenta contou 0 sessões elegíveis para o alvo `gustavo12` na janela; se existem sessões abertas em `deploy-sexta-automation/`, essa coleta não as viu, porque o alvo era outro.
  - Lane de Harness do projeto (`GIT_COMMAND_FAILED`): limitação do alvo escolhido. `gustavo12` não é repositório git. `deploy-sexta-automation/` é, mas não foi usada como alvo.
  - Varredura de configuração sensível: cobertura parcial, 1 erro de leitura em 0 arquivos candidatos. O arquivo que causou o erro não foi identificado.
