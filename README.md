# Conecta Care - Web & Supabase

Aplicação Next.js (App Router) integrada ao Supabase (Postgres, Auth, Storage, Edge Functions) e fluxos Genkit/AI. O fluxo recomendado é desenvolver no Supabase local (Docker) e sincronizar com o projeto cloud `nalwsuifppxvrikztwcz` apenas quando necessário.

## Visão Geral
- Front-end em Next.js 15 + Tailwind + componentes Shadcn.
- Back-end dirigido via Supabase (migrations SQL puras + Edge Functions).
- Documentação consolidada em `docs/` (arquitetura, workflows, histórico de limpeza).
- Scripts auxiliares para alternar ambientes, testar conectividade e depurar UI headless.

## Como começar
1. **Instalar dependências**
   ```powershell
   npm install
   ```
   - Se for usar `scripts/debug-headless.js`, rode `npx playwright install` uma vez para baixar os navegadores.
2. **Configurar variáveis de ambiente**
   ```powershell
   Copy-Item .env.template .env.local.dev
   Copy-Item scripts/env-presets.example.json scripts/env-presets.json
   ```
   - Preencha `scripts/env-presets.json` com as chaves reais (anon/service role locais e cloud).
   - Rode `./scripts/switch-env.ps1 -Mode local` ou `-Mode cloud` para popular `.env.local.dev` automaticamente.
3. **Iniciar Supabase local (opcional mas recomendado)**
   ```powershell
   npx supabase start
   npx supabase status   # URLs/chaves locais
   ```
4. **Vincular o projeto cloud (uma vez)**
   ```powershell
   npm run sb:link   # usa o project-ref nalwsuifppxvrikztwcz
   ```
5. **Rodar a aplicação**
   ```powershell
   npm run dev
   ```
   - O dashboard abre em http://localhost:9003.
   - Use `./scripts/switch-env.ps1` para alternar em segundos entre local/cloud.

## Scripts npm principais
| Script | Descrição |
| --- | --- |
| `npm run dev` | Next.js + Turbopack em `:9003`. |
| `npm run build` / `npm run start` | Build e execução em modo produção. |
| `npm run lint` / `npm run typecheck` | Qualidade (ESLint + tsc). |
| `npm run genkit:dev` / `npm run genkit:watch` | Execução de flows Genkit. |
| `npm run sb:link` | Liga Supabase CLI ao projeto `nalwsuifppxvrikztwcz`. |
| `npm run sb:functions:deploy` | Deploy das Edge Functions em `supabase/functions/*`. |

## Estrutura do repositório
```
├── docs/                     # Documentação central (API, workflow, schemas, cleanups)
│   ├── schemas/              # Referências completas do banco (combined + legacy)
│   ├── CLEANUP-REPORT.md     # Histórico detalhado da faxina
│   ├── supabase-workflow.md  # Passo a passo Local ↔ Cloud
│   └── SYNC-STATUS.md        # Estado atual das migrations
├── scripts/                  # Scripts utilitários (env switch, conectividade, debug)
├── src/                      # Código Next.js (app router, components, hooks, lib, server)
├── supabase/                 # Migrations e Edge Functions oficiais
├── .env.template             # Template único (local + overrides cloud)
├── package.json              # Scripts/npm deps
└── README.md                 # Este guia
```
- SQL legados/duplicados vivem agora apenas em `docs/schemas/legacy-sql/` para consulta.
- Todo schema oficial é versionado em `supabase/migrations/*.sql` (ver `docs/SYNC-STATUS.md`).

## Supabase, banco e migrations
- **Ambiente local**: `npx supabase start`, `stop`, `status`, `db reset` quando quiser um banco limpo.
- **Gerar migrations**: `npx supabase db diff -f nome_da_migration` (gera arquivos em `supabase/migrations/`).
- **Sincronizar**:
  - Cloud → local: `npx supabase db pull`.
  - Local → cloud: `npx supabase db push` seguido de `npm run sb:functions:deploy` (se alterou funções).
- **Referências**:
  - `docs/schemas/combined-schema-baseline.sql` traz o schema completo atual.
  - `docs/supabase-workflow.md` descreve o ciclo completo Local ↔ Cloud + troubleshooting.
  - `docs/SYNC-STATUS.md` mantém o status validado das migrations (baseline + 2 remotas aplicadas).

## Utilitários & diagnósticos
- `scripts/switch-env.ps1`: gera `.env.local.dev` com base nos presets (sem expor chaves no repo).
- `scripts/test-supabase-connectivity.ps1`: testa DNS/API/porta 443 e oferece ajuste automático de DNS.
- `scripts/debug-headless.js`: usa Playwright para renderizar `/login` headless, salvar screenshot + logs (rode `npx playwright install` antes de usar).

## Documentação complementar
- `docs/api.md`: endpoints planejados e payloads de referência.
- `docs/blueprint.md`: visão macro do produto.
- `docs/backend.json`: inventário completo de entidades/campos consumido pela UI.
- `docs/CLEANUP-REPORT.md`: decisões e pendências da faxina (atualizado constantemente).
- `docs/supabase-remote-only.md`: mantido como histórico (modo somente cloud) – ler nota no topo.

## Checklist rápido
- [ ] `.env.local.dev` criado a partir do template e preenchido via `switch-env`.
- [ ] `npm run dev` sem erros (conferir warnings de lint/typecheck).
- [ ] `npx supabase status` aponta URLs/chaves que batem com o preset selecionado.
- [ ] `supabase/migrations` revisado antes de `db push` (fonte da verdade do schema).
- [ ] Edge Functions (`supabase/functions/*`) atualizadas com `npm run sb:functions:deploy` após alterações.
- [ ] Documentação sincronizada (`docs/` ≈ código) – atualize `docs/CLEANUP-REPORT.md` ao concluir tarefas grandes.

Bons builds! 💙
