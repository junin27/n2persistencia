import { spawnSync } from "node:child_process";
import path from "node:path";

// Devolve o resultado do ESLint ao agente (additionalContext); falha de lint bloqueia para correção.
const result = spawnSync(process.execPath, [path.join(process.cwd(), "node_modules", "eslint", "bin", "eslint.js"), "."], { encoding: "utf8", windowsHide: true });
const code = result.error ? 1 : result.status ?? 1;
const output = (result.error ? `Não foi possível iniciar o lint: ${result.error.message}` : `${result.stdout}${result.stderr}`).trim().slice(0, 4000);
const message = `[PostToolUse] ESLint executado após a edição; terminou com código ${code}.${output ? `\n${output}` : ""}`;
const response = { hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: message } };
if (code !== 0) Object.assign(response, { decision: "block", reason: message });
console.log(JSON.stringify(response));
