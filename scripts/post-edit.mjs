import { spawnSync } from "node:child_process";
import path from "node:path";

console.log("[PostToolUse] Executando ESLint nos arquivos de código do projeto.");
const result = spawnSync(process.execPath, [path.join(process.cwd(), "node_modules", "eslint", "bin", "eslint.js"), "."], { stdio: "inherit", windowsHide: true });
if (result.error) console.error("[PostToolUse] Não foi possível iniciar o lint:", result.error.message);
const code = result.status ?? 1;
console.log(`[PostToolUse] ESLint terminou com código ${code}.`);
process.exitCode = code;
