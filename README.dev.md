# Desenvolvimento local — Conecta Care (dev)

Este arquivo descreve os passos rápidos para desenvolver e depurar o projeto localmente no Windows (PowerShell) usando VS Code.

Pré-requisitos
- Node.js (>=18 recomendado)
- npm
- VS Code

Instalar dependências
```powershell
npm install
```

Iniciar servidor de desenvolvimento (Next.js)
```powershell
npm run dev
# ou usar a task do VS Code: Run Task -> Start Dev Server
```

Debug cliente (browser) via VS Code
1. No VS Code, abra a paleta (Ctrl+Shift+P) e escolha `Run and Debug`.
2. Selecione `Launch Chrome (localhost)` — isso abrirá o navegador apontando para http://localhost:9003 e iniciará o dev server antes.
3. Coloque breakpoints em arquivos cliente, por exemplo `src/app/login/page.tsx`.

Debug servidor (Node / server actions)
1. Pare o servidor se estiver rodando.
2. Inicie o Next com o inspector:
```powershell
node --inspect-brk .\node_modules\next\dist\bin\next dev -- -p 9003
```
3. No VS Code, escolha `Attach to Node (Next)` em Run and Debug.
4. Coloque breakpoints em `src/app/login/actions.ts` e em outras actions do servidor.

Firebase CLI (sem instalar globalmente)
- Login:
```powershell
npx firebase-tools login --no-localhost
```
- Iniciar emuladores (se configurado):
```powershell
npx firebase-tools emulators:start
```

VS Code tasks úteis
- Run Task -> Start Dev Server
- Run Task -> Firebase: Login
- Run Task -> Firebase: Emulators Start

Se preferir instalar o Firebase CLI globalmente:
```powershell
npm install -g firebase-tools
firebase login --no-localhost
```

Observações
- Se ver erros relacionados a importação de módulos client em código server (ex.: `initializeFirebase` importado em server action), siga o padrão: autenticação com Firebase deve acontecer no cliente; as server actions devem apenas criar sessão a partir do `uid`/`email` enviada pelo cliente.

Se quiser, eu crio também um `tasks` composto que inicia emuladores e dev server simultaneamente. Peça que eu crie quando quiser.
