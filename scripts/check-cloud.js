const { Client } = require("pg");

const TABLES = [
  "patients",
  "patient_addresses",
  "patient_admin_info",
  "patient_financial_info",
  "patient_intelligence",
  "patient_operational_links",
  "patient_clinical_summaries",
  "patient_support_network",
  "patient_memberships",
  "patient_documents",
  "patient_consents",
  "patient_audit_logs",
  "payment_transactions",
  "whatsapp_message_logs",
  "routing_logs",
  "signature_requests",
  "integration_configs",
  "app_events",
];

async function main() {
  const dbUrl = process.env.SUPABASE_CLOUD_DB_URL || process.argv[2];
  if (!dbUrl) {
    throw new Error(
      "Missing connection string. Pass SUPABASE_CLOUD_DB_URL env var or as first argument."
    );
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    for (const table of TABLES) {
      const res = await client.query(`select count(*) as count from public.${table}`);
      console.log(`${table}: ${res.rows[0].count}`);
    }
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Failed to check cloud data:", err.message);
  process.exitCode = 1;
});
