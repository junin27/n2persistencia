# Validação por outro integrante

Execute depois que o responsável publicar a versão revisada. Quem não conduziu a implementação deve fazer a verificação e preencher o registro com resultados reais. A verificação técnica pelo Codex não substitui essa etapa.

## Partir do zero

Em uma pasta nova, com Node 22.16.0 e acesso à internet:

```powershell
git clone https://github.com/junin27/n2persistencia.git
cd n2persistencia
git rev-parse HEAD
npm ci
npm.cmd test -- --runInBand
npm run lint
npm run build
node scripts/verify-api.mjs
npm start
```

Abra http://localhost:3000. Digite três cenas separadas por uma linha em branco. Crie o projeto: confira três cenas pendentes e a ordem. Gere o vídeo: confira conclusão, imagens e MP4 de 9 segundos. Baixe e reproduza. Guarde o ID, reinicie o servidor e reabra o projeto para conferir persistência. Encerre com Ctrl+C.

A prova HTTP usa porta 3011; ela deve estar livre. Primeira instalação baixa FFmpeg automaticamente; não é necessário instalá-lo globalmente. Para versão ainda não publicada, uma extração nova do ZIP permite uma pré-verificação, mas não é clone do GitHub.

## Registro a preencher por quem executou

- Nome: PENDENTE
- Data e sistema operacional: PENDENTE
- Commit retornado por git rev-parse HEAD: PENDENTE
- Instalação / testes / lint / build / prova HTTP: PENDENTE
- ID do projeto e reprodução do vídeo: PENDENTE
- Persistência após reinício: PENDENTE
- Problemas encontrados e resolução: PENDENTE
- Capturas ou log: PENDENTE
