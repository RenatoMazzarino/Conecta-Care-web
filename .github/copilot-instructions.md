# Instruções rápidas para agentes (Copilot / Assistentes)

Use este resumo quando fizer mudanças automáticas no repo.

- Sempre crie uma branch com prefixo `agent/` para mudanças automáticas.
- Para mudanças de esquema/BD: não rode SQL em produção; crie arquivo `sql/*.sql` e inclua instruções passo-a-passo; abra PR draft.
- Para alterações que mexem em políticas de segurança (RLS, triggers): pare e solicite revisão humana antes de executar qualquer comando contra o banco.
- Execute `npm run typecheck` e `npm run db:generate` localmente e cole saídas importantes no PR como artefato.
- Não comite secrets. Use variáveis de ambiente e documente como configurar locals.

Se precisar executar algo que requer o supabase CLI ou acesso a um projeto real, peça ao mantenedor para fornecer credenciais temporárias e instruções.

Formato mínimo de PR do agente
- Descrição curta do objetivo
- Checklist com: typecheck, prisma generate, migrations, testes, revisão humana para RLS
- SQL adicionado (em `sql/`) e instruções de execução manual
- Tags: `area infra`, `needs-review`
