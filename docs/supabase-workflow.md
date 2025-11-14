# Fluxo de trabalho Supabase (Local ↔ Cloud)

Este projeto está configurado para desenvolvimento local sincronizado com o projeto Supabase Cloud.

## Conceito: Desenvolvimento Local + Cloud

- **Local**: Ambiente completo (Postgres, Auth, Storage, Studio) rodando no Docker
- **Cloud**: Projeto remoto "Conecta Care" (nalwsuifppxvrikztwcz) em produção/staging
- **Sincronização**: Você desenvolve localmente, testa, e depois envia para a cloud (ou puxa mudanças da cloud para local)

## Comandos principais

### Iniciar ambiente local
```powershell
npx supabase start
```
Sobe todos os serviços no Docker. URLs e chaves locais serão exibidas no terminal.

### Parar ambiente local
```powershell
npx supabase stop
```

### Ver status
```powershell
npx supabase status
```
Mostra URLs, portas e chaves do ambiente local.

### Sincronização: Cloud → Local (puxar schema)
```powershell
npx supabase db pull
```
Baixa o schema atual da cloud e cria/atualiza migrations locais.

### Sincronização: Local → Cloud (enviar mudanças)
```powershell
# Enviar migrations (schema changes)
npx supabase db push

# Deploy de edge functions
npx supabase functions deploy <function-name>

# Ou deploy de todas:
npx supabase functions deploy
```

### Resetar banco local (apaga dados, reaplica migrations)
```powershell
npx supabase db reset
```

### Gerar migration a partir de mudanças locais
```powershell
npx supabase db diff -f <nome-da-migration>
```
Cria um arquivo de migration com as diferenças entre o estado atual e o último migration.

## Fluxo típico de desenvolvimento

1. **Iniciar ambiente local**:
   ```powershell
   npx supabase start
   ```

2. **Desenvolver localmente**:
   - Edite schema via Studio local (http://127.0.0.1:54323)
   - Ou edite arquivos SQL em `supabase/migrations/`
   - Teste sua aplicação apontando para o Supabase local

3. **Testar mudanças**:
   - Sua app usa `.env.local` que pode ter URLs locais ou Cloud (veja abaixo)
   - Rode testes

4. **Aplicar na cloud**:
   ```powershell
   npx supabase db push
   ```

5. **Ou puxar mudanças que alguém fez na cloud**:
   ```powershell
   npx supabase db pull
   ```

## Configuração de ambiente (.env.local)

Você pode ter dois `.env.local` ou usar variáveis diferentes:

**Para desenvolvimento local (apontando ao Docker local):**
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<chave-anon-local>
```

**Para desenvolvimento apontando à cloud:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://nalwsuifppxvrikztwcz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Atualmente seu `.env.local` aponta para a cloud. Se quiser testar localmente, mude temporariamente para as URLs locais (rode `npx supabase status` para obter as chaves locais).

## Extensão VS Code

Com o ambiente local rodando (`supabase start`):
- A extensão Supabase vai detectar o projeto local automaticamente
- Você pode explorar tabelas, executar queries, etc.
- A extensão também permite conectar ao projeto remoto (cloud) via "Connect to Project"

## Migrations

- Migrations ficam em `supabase/migrations/`
- São aplicadas sequencialmente (ordem de timestamp no nome do arquivo)
- Para criar uma nova migration manualmente: crie um arquivo `.sql` com timestamp, ex:
  `supabase/migrations/20251113000000_add_new_table.sql`
- Para gerar automaticamente: `npx supabase db diff -f nome-descritivo`

## Dicas

- Sempre commit suas migrations no git
- Antes de fazer `db push`, revise as migrations que serão aplicadas
- Use `db pull` regularmente se trabalhar em equipe (para sincronizar mudanças que outros fizeram)
- O ambiente local é isolado — pode resetar (`db reset`) sem afetar a cloud

## Troubleshooting

### Comandos travando ao conectar na cloud (db pull, migration repair)

Se `npx supabase db pull` ou `migration repair` travarem em "Initialising login role...":

**Causas comuns:**
- Firewall/antivírus bloqueando conexão
- Timeout de rede
- Proxy corporativo
- API do Supabase Cloud temporariamente lenta

**Soluções:**

1. **Trabalhar apenas localmente (sem sincronização temporária):**
   - Continue desenvolvendo no ambiente local
   - Acesse Studio local: http://127.0.0.1:54323
   - Faça mudanças no schema localmente
   - Sincronize manualmente mais tarde quando a conexão estiver estável

2. **Aumentar timeout (teste posteriormente):**
   ```powershell
   $env:SUPABASE_INTERNAL_REQUEST_TIMEOUT="60000"
   npx supabase db pull
   ```

3. **Verificar conectividade:**
   ```powershell
   Test-NetConnection -ComputerName api.supabase.com -Port 443
   curl https://nalwsuifppxvrikztwcz.supabase.co/rest/v1/
   ```

4. **Alternativa: usar Dashboard web:**
   - Vá em https://supabase.com/dashboard
   - Faça mudanças no schema via interface web
   - Depois, localmente, crie migration manualmente refletindo essas mudanças

### Histórico de migrations divergente

Se receber erro "remote database's migration history does not match local files":

```powershell
# Repare conforme sugerido pela mensagem de erro, exemplo:
npx supabase migration repair --status reverted 20251105232715
npx supabase migration repair --status applied 20251111020500
```

Se os comandos repair travarem (problema de conexão), você pode:
- Resetar o ambiente local: `npx supabase db reset`
- Trabalhar localmente sem sincronizar por enquanto

## Referências

- [Supabase CLI docs](https://supabase.com/docs/guides/cli)
- [Local development guide](https://supabase.com/docs/guides/cli/local-development)
- [Managing environments](https://supabase.com/docs/guides/cli/managing-environments)
