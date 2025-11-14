# Supabase remoto (local desativado)

> **Nota:** Documento mantido apenas como histórico. O repositório voltou a operar no modo **Local ↔ Cloud** com `supabase/config.toml`, Docker e scripts atualizados em novembro/2025. Consulte `docs/supabase-workflow.md` e `docs/SYNC-STATUS.md` para o fluxo suportado atualmente.

Este projeto usa somente o ambiente REMOTO do Supabase.

Mudanças aplicadas
- Removido `supabase/config.toml` e artefatos locais (`supabase/.temp`, `supabase/.branches`, `supabase/supabase/`).
- Scripts `scripts/supabase-*.ps1` foram desativados (apenas exibem aviso).

Como trabalhar (remoto)
- Extensão Supabase: faça login e selecione o projeto para navegar Database/Auth/Storage/Functions.
- SQL Editor (Dashboard): execute migrações/ajustes.
- CLI (opcional):
  - Link já configurado: `npm run sb:link`.
  - Deploy de functions: `npm run sb:functions:deploy`.

Conexão Postgres (pooler)
`postgresql://postgres.nalwsuifppxvrikztwcz@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require`

Senha: Dashboard → Settings → Database → Password.

Reativar local no futuro
- Rode `supabase init` para recriar `supabase/config.toml` e remova a proteção dos scripts.
