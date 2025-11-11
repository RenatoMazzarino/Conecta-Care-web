# Modelo de Pedido ao Agente (Agent Request Template)

Use este template sempre que solicitar uma tarefa grande ao agente (BD, RLS, triggers, migrations, features cross-cutting). Preencha todos os campos relevantes. O agente irá gerar os artefatos solicitados (SQL em `sql/`, Zod schema em `src/schemas/`, server action em `src/app/...`, testes em `src/__tests__/`) e abrir um PR draft com checklist. A execução do SQL em produção sempre requer aprovação humana marcada no PR.

----

## Metadados
- request_id: <uuid ou short id, p.ex. bloco-5-financeiro>
- title: <título curto e descritivo>
- priority: low | medium | high
- actor (quem pediu): <nome/email do solicitante>
- date: <YYYY-MM-DD>
 - auto_execute: yes | no    # se 'yes', o agente tentará executar os passos que alterem o DB automaticamente (ver seção de segurança)
 - target_env: staging | production | dev
 - credentials_provided: yes | no   # indica se as credenciais/segredos necessários foram fornecidos (ex.: GitHub Secrets)
 - required_approval: human-review | auto-approve

## Escopo e objetivo (resumo)
- Descreva em 1–3 frases o objetivo do pedido e o que deve ser criado/alterado.

## Artefatos esperados (marque o que aplica)
- [ ] SQL file in `sql/` (full SQL block)
- [ ] Prisma migration / instructions
- [ ] Zod schema in `src/schemas/`
- [ ] Server action in `src/app/...` (upsert/handlers)
- [ ] Unit tests in `src/__tests__/`
- [ ] Documentation/notes in `docs/` or PR description

## Riscos e pré-condições
- Liste riscos (RLS, PII, integrações externas) e pré-condições (backup, tenant checks, staging). Indique se execução em produção é permitida sem revisão humana (YES/NO).

## Passos que o agente deve executar (o que gerar)
1. Criar arquivo SQL em `sql/` com header contendo: objetivo, riscos, rollback SQL e instruções de execução (Supabase SQL Editor or CLI).
2. Criar/atualizar Zod schema em `src/schemas/` (snake_case quando for tabela SQL em snake_case).
3. Criar server action em `src/app/...` que valide com Zod e faça upsert usando Supabase Server Client.
4. Criar testes unitários que validem parsing Zod e que o server action trata erros corretamente (mock supabase client).
5. Rodar localmente `npm run typecheck` e `npm run db:generate` e incluir saída no PR.
6. Abrir PR draft em branch `agent/<request_id>-<shortdesc>` com checklist preenchido e marcar revisores.

## Aprovação e execução (etapa humana)
- Se o pedido inclui execução de SQL (migrations, RLS, triggers), o agente deve aguardar aprovação humana no PR antes de executar qualquer comando que altere bancos de produção.
- Incluir checklist para o mantenedor que vai executar a SQL: 1) backup, 2) rodar em staging, 3) confirmar tenants, 4) aplicar em produção.

### Notas sobre `auto_execute`
- Se `auto_execute: yes` o agente só deverá executar passos que alterem o banco se **TODAS** as condições abaixo forem verdadeiras:
	1. `credentials_provided: yes` e as credenciais necessárias estiverem armazenadas de forma segura (GitHub Actions secrets ou outro secret manager) com nomes padronizados (ex.: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).
	2. `target_env` for `staging` ou `dev`. Para `production`, `required_approval` deve ser `human-review` a menos que um processo de war-room e autorização explícita exista.
	3. O PR draft foi revisado por um humano e marcado como aprovado para execução (comentário com `/deploy` ou tag equivalente).
- Se alguma condição não for atendida, o agente deverá gerar os artefatos e abrir o PR draft, mas NÃO executar comandos que alterem o banco.

### Campos esperados para credenciais (padrão)
- SUPABASE_URL — URL do projeto Supabase
- SUPABASE_SERVICE_ROLE_KEY — chave service_role (guardá-la em segredo e dar permissões restritas)
- GITHUB_TOKEN (para criar PRs automaticamente, opcional)


----

O exemplo preenchido para BLOCO 5 está em `.github/AGENT_REQUEST_EXAMPLE_BLOCO5.md`.
