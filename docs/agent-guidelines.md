Diretrizes para agentes automatizados (resumo)

- Antes de executar qualquer SQL no banco real, crie um arquivo `sql/*.sql` e inclua instruções de execução e rollback no PR.
- Para mudanças que envolvem RLS/triggers, solicite revisão humana e não execute nada em produção.
- Sempre adicione/atualize schemas Zod em `src/schemas/` e crie testes unitários mínimos para validação.
- Ao alterar nomes de campos (ex.: camelCase -> snake_case), documente o mapeamento e atualize server actions/forms para compatibilidade.
