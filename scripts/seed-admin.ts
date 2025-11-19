import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '..', '.env.local.dev');

config({ path: envPath });

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY não definidos no .env.local.dev');
  process.exit(1);
}

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@conectacare.local';
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureAdminUser() {
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });

  if (listError) {
    throw listError;
  }

  const existing = listData.users.find(
    (user) => user.email?.toLowerCase() === adminEmail.toLowerCase()
  );

  if (existing) {
    console.log(`⚠️  Usuário ${adminEmail} já existe (id: ${existing.id}).`);
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { role: 'admin', seeded: true },
    app_metadata: { roles: ['admin'] },
  });

  if (error) {
    throw error;
  }

  console.log(`✅ Usuário admin criado: ${data.user?.email}`);
}

ensureAdminUser().catch((error) => {
  console.error('❌ Falha ao criar usuário admin:', error);
  process.exit(1);
});
