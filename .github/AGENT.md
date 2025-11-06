# Diretrizes do Agente Autônomo — Conecta Care

Este documento descreve regras operacionais para agentes/assistentes automatizados que irão propor e implementar mudanças no repositório. Objetivo: permitir tarefas maiores (migrations, criação de schemas, RLS) com segurança e rastreabilidade.

Princípios gerais
- Nunca execute alterações de banco de dados em produção sem aprovação humana explícita (PR aprovado e responsável definido).
- Para mudanças que tocam RLS, triggers, roles ou dados sensíveis, sempre abrir PR em draft e marcar revisores humanos. Não usar deploy automático.
- Todas as alterações devem ser pequenas, testáveis e reversíveis. Prefira criar migrations SQL/Prisma e testes automáticos.

Checklist obrigatório para tarefas de banco de dados (ex.: BLOCO 5 — Financeiro)
1. Criar um arquivo SQL na pasta `sql/` com um header explicando objetivo, riscos e rollback sugerido. Nome exemplo: `005_add_patient_financial_info.sql`.
2. Rodar localmente contra um ambiente sandbox/emulador (Supabase emulator ou banco de dev). Documentar o comando usado em comentário no PR.
3. Gerar migration do Prisma se aplicável (`prisma migrate` / `prisma db pull` / `prisma db push`) e commitar `prisma/migrations` ou instruções de migração; não rodar em produção.
4. Adicionar/atualizar schema Zod/Typescript em `src/schemas/` (ex.: `src/schemas/patient.financial.ts`) e testes unitários que validem parsing básico.
5. Criar server action ou API handler (ex.: `src/app/(app)/patients/actions.upsertFinancialInfo.ts`) com validação via Zod, tratamento de erros e logs mínimos.
6. Atualizar documentação (`README.md` ou `docs/`) com a mudança de esquema e instruções para operações de manutenção e rollback.
7. Criar PR em branch nomeada `agent/<short-desc>` com descrição clara, checklist preenchido e marcar revisores humanos.

Regras de segurança e segredos
- Não executar `supabase` CLI commands que exijam segredos sem o proprietário do repositório fornecer credenciais temporárias. Se necessário, produzir instruções passo-a-passo para o humano executar.
- Nunca colocar credenciais ou secrets em commits. Use `ENV`/`.env` e documente variáveis necessárias.

Procedimentos para executar tarefas grandes (resumo de passos que o agente deve seguir)
1. Analisar pedido e produzir um plano em etapas (SQL, migration, schema, action, testes). Incluir possíveis riscos e rollback.
2. Criar branch de trabalho `agent/<task>-<id>` e commitar artefatos iniciais: `sql/*.sql`, `src/schemas/...`, `tests/...`.
3. Rodar validações locais (typecheck, prisma generate). Reportar saídas no PR como artefato.
4. Marcar PR como draft e solicitar revisão humana para executar migrations no ambiente real.

Especificamente para BLOCO 5 — Financeiro (exemplo de política)
- O agente pode criar a SQL proposta e os arquivos Zod/Typescript correspondentes, mas deve deixar a execução do SQL (no Supabase SQL Editor ou CLI) para um humano; incluir o SQL no PR e um passo-a-passo para execução com checagens pré/post (ex.: verificar tenants, backups).
- Se a SQL alterar RLS ou criar triggers, a execução requer aprovação explícita (PR revisado e comentário de aprovação do mantenedor).

Execução automática (condições e responsabilidades)
------------------------------------------------
O agente pode ser configurado para executar automaticamente os passos que alteram o banco (SQL/migrations) **apenas** quando todas as condições de segurança abaixo forem satisfeitas. Essas regras existem para evitar alterações inadvertidas em produção.

Condições para execução automática:
1. Credenciais válidas e seguras presentes no ambiente (por exemplo, GitHub Actions Secrets): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. O mantenedor deve configurar esses segredos com permissões adequadas.
2. O pedido (`.github/AGENT_REQUEST_TEMPLATE.md`) tem `auto_execute: yes`, `credentials_provided: yes`, `target_env` definido (preferível `staging` primeiro).
3. Para execução em `production`, o campo `required_approval` deve ser `human-review` e um mantenedor deverá aprovar o PR e emitir um comando explícito (por exemplo, comentário `/deploy production` no PR) para autorizar o agente a proceder.
4. Uma política de rollback e backups deve estar documentada no header do arquivo SQL e assinada/confirmada no PR.

Comportamento do agente ao executar automaticamente:
- Antes de aplicar: o agente criará snapshot do schema atual (pg_dump schema-only ou instrução equivalente) e salvará em `sql/backups/<request_id>-pre.sql` (local ou em artefato do PR). Ele também registrará no `REPO_STATE` a intenção de executar.
- Execução em staging: o agente aplicará o SQL no `staging` primeiro, rodará validações (contagens, políticas RLS) e tentará executar `prisma db:generate` / `prisma migrate` conforme a estratégia do time.
- Caso ocorram erros: o agente tentará aplicar correções automáticas limitadas (ver seção de tratamento de erros), registrar as ações tentadas e, se não resolver, reverter (quando possível) e abrir um relatório detalhado no PR com passos e logs.

Registros e rastreabilidade
- O agente deve sempre adicionar uma entrada em `.github/REPO_STATE.md` com: request_id, branch, commit(s) criados, arquivos adicionados/alterados, ambiente alvo, credenciais usadas (nome do secret, não o valor), e resultado da execução (success/fail) com link para logs.

Obrigatoriedade de revisão humana
- Apesar da possibilidade de execução automática, recomendamos fortemente que todas execuções em `production` ocorram manualmente por um humano autorizado. A execução automática deve ser usada somente em cenários bem controlados e com rotinas de rollback testadas.

Logs e rastreabilidade
- Ao finalizar alterações, o agente deve atualizar `docs/` ou criar `./.github/REPO_STATE.md` com um resumo: quem agiu (agent id), que arquivos foram criados/alterados, e instruções para aplicar as mudanças no ambiente.

Quando pedir ajuda humana
- Se a tarefa envolve: migração de dados em larga escala, decisões sobre colunas sensíveis (PII), alterações de RLS, ou impacta integrações externas, pare e solicite revisão humana.

Contato
- Para dúvidas ou aprovações, marque o mantenedor responsável no PR e inclua o link para este documento.

Modelo de pedido esperado pelo agente
------------------------------------
O agente espera receber pedidos estruturados seguindo o template em `.github/AGENT_REQUEST_TEMPLATE.md` (exemplo: BLOCO 5 — Financeiro). Use esse modelo para que o agente gere automaticamente os artefatos (SQL, Zod schema, server action, testes) e prepare um PR draft. A execução do SQL em ambientes reais continua exigindo aprovação humana conforme as regras acima.
