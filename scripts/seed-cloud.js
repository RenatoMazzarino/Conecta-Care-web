const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

async function main() {
  const TENANT_ID = "a8b3cac8-f163-447d-a654-c4405170c316";
  const TENANT_NAME = "ConectaCare Demo";
  const dbUrl = process.env.SUPABASE_CLOUD_DB_URL || process.argv[2];
  if (!dbUrl) {
    throw new Error(
      "Missing connection string. Pass SUPABASE_CLOUD_DB_URL env var or as first argument."
    );
  }

  const seedFile = path.resolve(
    __dirname,
    "..",
    "supabase",
    "seeds",
    "patient-demo-data.sql"
  );
  if (!fs.existsSync(seedFile)) {
    throw new Error(`Seed file not found at ${seedFile}`);
  }
  const rawSql = fs.readFileSync(seedFile, "utf16le");
  const cleanedSql = rawSql
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return false;
      if (trimmed.startsWith("\\")) return false;
      if (trimmed.startsWith("--")) return false;
      return true;
    })
    .join("\n");
  const statements = splitStatements(cleanedSql);

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    const tablesToTruncate = [
      "patient_memberships",
      "patient_support_network",
      "patient_clinical_summaries",
      "patient_documents",
      "patient_consents",
      "patient_audit_logs",
      "payment_transactions",
      "routing_logs",
      "whatsapp_message_logs",
      "signature_requests",
      "integration_configs",
      "app_events",
      "ocr_jobs",
      "patient_financial_info",
      "patient_admin_info",
      "patient_addresses",
      "patient_intelligence",
      "patient_operational_links",
      "patients",
    ];
    await client.query(
      `TRUNCATE TABLE ${tablesToTruncate
        .map((t) => `public.${t}`)
        .join(", ")} RESTART IDENTITY CASCADE`
    );
    await client.query(
      "INSERT INTO tenants (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING",
      [TENANT_ID, TENANT_NAME]
    );
    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (stmtErr) {
        stmtErr.message = `${stmtErr.message}\nFailed statement:\n${statement.slice(
          0,
          200
        )}...`;
        throw stmtErr;
      }
    }
  } catch (err) {
    await client.query("ROLLBACK;").catch(() => {});
    throw err;
  } finally {
    await client.end();
  }
}

main()
  .then(() => {
    console.log("Seed data imported to Supabase cloud.");
  })
  .catch((err) => {
    console.error("Failed to seed cloud database:", err.message);
    process.exitCode = 1;
  });

function splitStatements(sql) {
  const statements = [];
  let current = "";
  let inSingle = false;

  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];

    current += char;

    if (char === "'" && !inSingle) {
      inSingle = true;
      continue;
    }

    if (char === "'" && inSingle) {
      if (next === "'") {
        current += next;
        i += 1;
        continue;
      }
      inSingle = false;
      continue;
    }

    if (!inSingle && char === ";" && current.trim().length > 0) {
      statements.push(current.trim());
      current = "";
    }
  }

  const tail = current.trim();
  if (tail) {
    statements.push(tail);
  }

  return statements;
}
