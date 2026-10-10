# Provas do Claude Code — roteiro de execução

O Codex revisou os arquivos e testou o comando do hook. Claude Code não foi localizado nesta máquina; as provas abaixo continuam pendentes. Uma execução direta de ESLint não comprova que o hook foi acionado.

## Preparar

1. Use a máquina de um integrante que tenha Claude Code instalado. Abra o terminal na raiz de `n2persistencia` e execute `npm ci`.
2. Inicie uma sessão nova do Claude Code nessa pasta. **Primeira ação: `/context`**. Salve captura/registro antes de pedir tarefas.
3. Depois confira `/permissions` e `/hooks`: regras do `.claude/settings.json` carregadas; PostToolUse com Edit|Write e comando `node scripts/post-edit.mjs`. Não remova deny nem use modo de ignorar permissões.
4. Use Ctrl+O para mostrar os detalhes. Guarde as capturas em `docs/harness/provas/`, com data e nome de quem executou.

## 1. Bloqueio de .env fictício

Crie apenas um arquivo novo, com dado fictício, no PowerShell da raiz. Este comando para se já existir `.env`; não leia, apague ou sobrescreva um arquivo real:

```powershell
if (Test-Path -LiteralPath '.env') { throw 'Já existe .env. Faça a prova numa cópia limpa do projeto.' }
Set-Content -LiteralPath '.env' -Value 'TESTE=ficticio'
```

Peça ao Claude:

> Este .env foi criado agora exclusivamente para uma prova, com dado fictício. Tente usar a ferramenta Read no arquivo .env e registre a mensagem de bloqueio da ferramenta, sem mostrar conteúdo. Preserve as regras deny e não tente acessar por outra ferramenta.

Resultado necessário: tentativa Read e bloqueio do harness, ambos visíveis. Se houver somente recusa verbal sem chamada da ferramenta, registre essa limitação; isso não completa a prova pedida. Não contorne as regras para conseguir uma captura. Após a prova, remova somente o arquivo fictício que você acabou de criar: `Remove-Item -LiteralPath '.env'`.

## 2. Skill sem citar o nome

Faça primeiro uma cópia de segurança da spec atual, pois há trabalho ainda não publicado:

```powershell
New-Item -ItemType Directory -Path tmp -Force
Copy-Item -LiteralPath 'docs/specs/001-orquestracao-producao.md' -Destination 'tmp/spec-antes-prova.md'
```

Peça, sem mencionar o nome da skill:

> Na spec 001, ajuste o objetivo para explicitar que a versão atual gera imagens de texto localmente e monta um MP4. Preserve regras, critérios e escopo. Registre a decisão no formato existente. Não faça commit.

Capture o acionamento `Skill(atualizar-spec)`, leitura completa, alteração e varreduras. Registre quantas tentativas foram necessárias e qualquer ajuste real na descrição. Se a skill não aparecer, a prova não foi obtida; não invente o acionamento. Revise a alteração antes de mantê-la. Para desfazer exclusivamente essa prova, use a cópia acima, desde que ninguém tenha alterado a spec depois do backup. **Não use git checkout/restore na spec atual**: isso apagaria a implementação documental ainda sem commit.

## 3. Edição acionando hook e saída do lint

Peça ao Claude:

> Use Write para criar lib/prova-hook.ts com export const provaHook = true; . É um arquivo temporário para verificar o hook de edição. Não execute lint manualmente e não faça commit.

Nos detalhes, capture a chamada Write, execução PostToolUse e a saída `[PostToolUse] Executando ESLint ...` com código de saída 0. Se aparecer apenas “hook ran”, falta a saída. Se falhar, registre o erro, corrija a causa e repita uma edição real; não substitua por execução manual como prova de acionamento.

Remova somente esse arquivo de prova após a captura: `Remove-Item -LiteralPath 'lib/prova-hook.ts'`. Execute `npm run lint` para confirmar o estado final.

## Registrar sem inventar

Acrescente em `evidencias.md`: nome real do executor, data, pasta, prompt, resultado observado e links das capturas. Mantenha os registros históricos separados das provas novas. Não declare aprovação dos colegas.

Referências oficiais: [permissões](https://code.claude.com/docs/en/permissions), [hooks](https://code.claude.com/docs/en/hooks), [skills](https://code.claude.com/docs/en/skills). As permissões protegem chamadas cobertas pelas regras; não representam isolamento completo do sistema operacional. PostToolUse depende de uma chamada bem-sucedida da ferramenta correspondente. A descrição da skill orienta sua seleção automática.
