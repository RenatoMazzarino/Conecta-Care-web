/**
 * Seed script para ambientes controlados.
 * Usa a Service Role Key apenas em backend/CI (nunca em código cliente).
 */
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function ensureSupabaseUser(email: string, password: string, displayName: string) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set to seed auth users.');
  }

  const adminEndpoint = `${supabaseUrl}/auth/v1/admin/users`;

  const response = await fetch(adminEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serviceRoleKey}`,
      apiKey: serviceRoleKey,
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        display_name: displayName,
      },
    }),
  });

  if (!response.ok) {
    let payload: any = null;
    try {
      payload = await response.json();
    } catch {
      // ignore - we'll fall back to text below
    }
    const errorText = payload ? JSON.stringify(payload) : await response.text();

    const isEmailExists =
      response.status === 422 &&
      (payload?.error_code === 'email_exists' ||
        payload?.msg?.toLowerCase().includes('already been registered') ||
        errorText.toLowerCase().includes('already been registered'));

    if (isEmailExists) {
      const lookup = await fetch(`${adminEndpoint}?email=${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apiKey: serviceRoleKey,
        },
      });
      if (!lookup.ok) {
        throw new Error(`Failed to lookup existing user: ${lookup.status} - ${await lookup.text()}`);
      }
      const { users } = (await lookup.json()) as { users: Array<{ id: string }> };
      if (users?.length) {
        return users[0].id;
      }
      throw new Error('User already exists but could not retrieve id.');
    }

    throw new Error(`Failed to create auth user: ${response.status} - ${errorText}`);
  }

  const { id } = (await response.json()) as { id: string };
  return id;
}

async function main() {
  const adminEmail = 'admin@conecta-care.test';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';
  const adminName = 'Conecta Admin';

  const authUserId = await ensureSupabaseUser(adminEmail, adminPassword, adminName);

  // Prepara perfil (caso trigger não exista ou para garantir dados atualizados)
  await prisma.user_profiles.upsert({
    where: { auth_user_id: authUserId },
    update: {
      email: adminEmail,
      name: adminName,
      role: 'admin',
    },
    create: {
      id: randomUUID(),
      auth_user_id: authUserId,
      email: adminEmail,
      name: adminName,
      role: 'admin',
    },
  });

  // Plantão de teste
  const shift = await prisma.shift.create({
    data: {
      owner_id: authUserId,
      title: 'Plantão de Enfermagem',
      description: 'Plantão de 12h para acompanhamento domiciliar.',
      startAt: new Date(),
      endAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      status: 'published',
    },
  });

  // Post no mural
  await prisma.posts.create({
    data: {
      author_id: authUserId,
      shift_id: shift.id,
      content: 'Plantão iniciado. Sinais vitais dentro da normalidade.',
      pinned: false,
    },
  });

  // Presença em tempo real
  await prisma.presence.create({
    data: {
      user_id: authUserId,
      shift_id: shift.id,
      state: 'online',
      last_seen: new Date(),
    },
  });

  // Inventário + pedido de suprimento
  const inventoryItem = await prisma.inventoryItem.create({
    data: {
      name: 'Gaze Estéril 10x10',
      unit: 'pacote',
      minStock: 10,
    },
  });

  await prisma.supplyRequest.create({
    data: {
      requesterId: authUserId,
      shiftId: shift.id,
      itemId: inventoryItem.id,
      qty: 20,
      status: 'pending',
    },
  });

  // Audit log de demonstração
  await prisma.auditLog.create({
    data: {
      entity: 'shift',
      entityId: shift.id,
      action: 'seed:create',
      actorId: authUserId,
      payload: {
        message: 'Seed de dados criada pelo script.',
      },
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
