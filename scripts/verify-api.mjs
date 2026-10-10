import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import path from 'node:path';
const port = 3011;
const base = `http://127.0.0.1:${port}`;
let server;
let output = '';
async function start() {
  server = spawn(process.execPath, [path.join(process.cwd(), 'node_modules', 'next', 'dist', 'bin', 'next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], { windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  output = '';
  server.stdout.on('data', chunk => { output += chunk; });
  server.stderr.on('data', chunk => { output += chunk; });
  for (let i = 0; i < 80; i++) {
    if (server.exitCode !== null) throw new Error(output);
    try { if ((await fetch(base)).ok) return; } catch {}
    await delay(200);
  }
  throw new Error(`Servidor não iniciou: ${output}`);
}
async function stop() {
  if (!server || server.exitCode !== null) return;
  const exited = new Promise(resolve => server.once('exit', resolve));
  server.kill(); await exited;
}
async function create(script) {
  return fetch(`${base}/api/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ script }) });
}
async function main() {
  await start();
  const page = await (await fetch(base)).text();
  assert(page.includes('Do roteiro ao seu primeiro vídeo'));
  for (const script of ['', Array(11).fill('Cena').join('\n\n'), 'x'.repeat(2001)]) assert.equal((await create(script)).status, 400);
  const created = await create('O desperdício de água afeta o nosso futuro.\n\nUma torneira aberta desperdiça água todos os dias.\n\nFeche a torneira e conserte vazamentos para economizar.');
  assert.equal(created.status, 201);
  const project = await created.json();
  assert(project.scenes.every(scene => scene.status === 'pendente'));
  const url = `${base}/api/projects/${project.id}`;
  const work = fetch(url, { method: 'POST' });
  await delay(100);
  const duplicate = await fetch(url, { method: 'POST' });
  assert.equal(duplicate.status, 409);
  const processed = await (await work).json();
  assert.equal(processed.status, 'concluído');
  const movie = await fetch(`${url}/files/final.mp4`);
  assert.equal(movie.status, 200); assert.equal(movie.headers.get('content-type'), 'video/mp4');
  const bytes = Buffer.from(await movie.arrayBuffer());
  assert.equal(bytes.subarray(4, 8).toString(), 'ftyp');
  assert.equal((await fetch(`${url}/files/scene-1.png`)).status, 200);
  assert.equal((await fetch(`${url}/files/project.json`)).status, 404);
  assert.equal((await fetch(`${base}/api/projects/invalid`)).status, 404);
  await stop(); await start();
  const recovered = await (await fetch(url)).json();
  assert.equal(recovered.status, 'concluído'); assert.equal(recovered.finalFile, 'final.mp4');
  const repeated = await (await fetch(url, { method: 'POST' })).json();
  assert.deepEqual(repeated, recovered);
  const result = { id: project.id, status: 'passou', http: 200, videoBytes: bytes.length, scenes: 3, persistenceAfterRestart: true, concurrentExecutionRejected: true, videoPath: path.join('data', 'projects', project.id, 'final.mp4') };
  await fs.mkdir('tmp', { recursive: true });
  await fs.writeFile('tmp/verification-api.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
}
main().catch(error => { console.error(error); process.exitCode = 1; }).finally(stop);
