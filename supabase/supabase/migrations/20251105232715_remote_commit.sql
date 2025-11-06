


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."current_tenant"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id','')::uuid
$$;


ALTER FUNCTION "public"."current_tenant"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" bigint NOT NULL,
    "tenant_id" "uuid",
    "entity" "text",
    "entity_id" "uuid",
    "action" "text",
    "actor_id" "uuid",
    "payload" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


COMMENT ON TABLE "public"."audit_logs" IS 'Auditoria de ações (e leituras sensíveis quando aplicável).';



CREATE SEQUENCE IF NOT EXISTS "public"."audit_logs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."audit_logs_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."audit_logs_id_seq" OWNED BY "public"."audit_logs"."id";



CREATE TABLE IF NOT EXISTS "public"."inventory_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "name" "text" NOT NULL,
    "unit" "text",
    "min_stock" integer,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."inventory_items" OWNER TO "postgres";


COMMENT ON TABLE "public"."inventory_items" IS 'Catálogo de materiais/insumos.';



CREATE TABLE IF NOT EXISTS "public"."patient_addresses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "cep" "text",
    "address_line" "text",
    "number" "text",
    "complement" "text",
    "neighborhood" "text",
    "city" "text",
    "state" "text",
    "reference_point" "text",
    "geo_lat" numeric(9,6),
    "geo_lng" numeric(9,6),
    "zone_type" "text",
    "gatehouse_name" "text",
    "visit_hours" "jsonb",
    "local_security" "text"[],
    "facade_photo_url" "text",
    "residence_type" "text",
    "floor" integer,
    "internal_access" "text",
    "accessibility" "jsonb",
    "stay_location" "text",
    "electric_infra" "text",
    "water_source" "text",
    "has_wifi" boolean,
    "backup_power" "text",
    "adapted_bathroom" boolean,
    "ambulance_access" "text",
    "parking" "text",
    "entry_procedure" "text",
    "avg_eta_min" integer,
    "works_or_obstacles" "text",
    "night_access_risk" "text",
    "pets" "jsonb",
    "residents" "jsonb",
    "caregivers" "jsonb",
    "hygiene_rating" "text",
    "environmental_risk" "text"[],
    "has_smokers" boolean,
    "ventilation" "text",
    "noise_level" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone
);


ALTER TABLE "public"."patient_addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."patient_admin_info" (
    "patient_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "status" "text",
    "admission_type" "text",
    "complexity" "text",
    "service_package" "text",
    "start_date" "date",
    "end_date" "date",
    "supervisor_id" "uuid",
    "escalista_id" "uuid",
    "nurse_responsible_id" "uuid",
    "frequency" "text",
    "operation_area" "text",
    "admission_source" "text",
    "contract_id" "text",
    "last_audit_date" "date",
    "last_audit_by" "uuid",
    "notes_internal" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone,
    "last_update_by" "text",
    "meta" "jsonb"
);


ALTER TABLE "public"."patient_admin_info" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."patient_clinical_summaries" (
    "patient_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "summary" "jsonb" NOT NULL,
    "meta" "jsonb",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."patient_clinical_summaries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."patient_financial_info" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "bond_type" "text",
    "insurer" "text",
    "plan_name" "text",
    "card_number" "text",
    "validity" "date",
    "monthly_fee" numeric,
    "due_day" integer,
    "payment_method" "text",
    "billing_status" "text",
    "last_payment_date" "date",
    "last_payment_amount" numeric,
    "financial_contact" "text",
    "observations" "text",
    "invoice_history" "jsonb" DEFAULT '[]'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."patient_financial_info" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."patient_support_network" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "responsible_legal" "jsonb",
    "network" "jsonb" DEFAULT '[]'::"jsonb",
    "emergency_contact" "jsonb",
    "notes_support" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."patient_support_network" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."patients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "display_name" "text",
    "pronouns" "text",
    "photo_url" "text",
    "photo_consent" "jsonb",
    "cpf" "text",
    "cpf_status" "text" DEFAULT 'unknown'::"text",
    "rg" "text",
    "rg_issuer" "text",
    "rg_digital_url" "text",
    "cns" "text",
    "national_id" "text",
    "document_validation" "jsonb",
    "date_of_birth" "date",
    "sex_at_birth" "text" DEFAULT 'Unknown'::"text",
    "gender_identity" "text",
    "civil_status" "text",
    "nationality" "text",
    "place_of_birth" "text",
    "preferred_language" "text",
    "phones" "jsonb",
    "emails" "jsonb",
    "preferred_contact_method" "text",
    "communication_opt_out" "jsonb",
    "emergency_contacts" "jsonb",
    "legal_guardian" "jsonb",
    "external_ids" "jsonb",
    "identity_verification" "jsonb",
    "duplicate_candidates" "uuid"[],
    "risk_flags" "text"[],
    "sensitive_data_consent" "jsonb",
    "record_status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    "updated_at" timestamp with time zone,
    "updated_by" "uuid",
    "last_viewed_at" timestamp with time zone,
    "access_log_summary" "jsonb",
    CONSTRAINT "patients_cpf_status_check" CHECK (("cpf_status" = ANY (ARRAY['valid'::"text", 'invalid'::"text", 'unknown'::"text"]))),
    CONSTRAINT "patients_record_status_check" CHECK (("record_status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'deceased'::"text"]))),
    CONSTRAINT "patients_sex_at_birth_check" CHECK (("sex_at_birth" = ANY (ARRAY['M'::"text", 'F'::"text", 'Other'::"text", 'Unknown'::"text"])))
);


ALTER TABLE "public"."patients" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "author_id" "uuid",
    "shift_id" "uuid",
    "content" "text",
    "pinned" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."posts" REPLICA IDENTITY FULL;


ALTER TABLE "public"."posts" OWNER TO "postgres";


COMMENT ON TABLE "public"."posts" IS 'Publicações (mural) ligadas a um plantão.';



CREATE TABLE IF NOT EXISTS "public"."presence" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "user_id" "uuid",
    "shift_id" "uuid",
    "state" "text" NOT NULL,
    "last_seen" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."presence" REPLICA IDENTITY FULL;


ALTER TABLE "public"."presence" OWNER TO "postgres";


COMMENT ON TABLE "public"."presence" IS 'Estado de presença em tempo real por usuário e plantão.';



CREATE TABLE IF NOT EXISTS "public"."shifts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "owner_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "start_at" timestamp with time zone NOT NULL,
    "end_at" timestamp with time zone,
    "status" "text" DEFAULT 'scheduled'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."shifts" REPLICA IDENTITY FULL;


ALTER TABLE "public"."shifts" OWNER TO "postgres";


COMMENT ON TABLE "public"."shifts" IS 'Plantões/escala e seu ciclo de vida.';



CREATE TABLE IF NOT EXISTS "public"."supply_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "requester_id" "uuid",
    "shift_id" "uuid",
    "item_id" "uuid",
    "qty" integer NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."supply_requests" OWNER TO "postgres";


COMMENT ON TABLE "public"."supply_requests" IS 'Pedidos de insumos ligados a plantões, para reposição/entrega.';



CREATE TABLE IF NOT EXISTS "public"."tenants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tenants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "auth_user_id" "uuid",
    "email" "text",
    "name" "text",
    "phone" "text",
    "role" "text",
    "tenant_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_profiles" IS 'Perfis de usuário vinculados ao auth.users (camada de perfil do app).';



COMMENT ON COLUMN "public"."user_profiles"."tenant_id" IS 'Tenant/empresa do usuário para políticas de RLS.';



ALTER TABLE ONLY "public"."audit_logs" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."audit_logs_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."patient_addresses"
    ADD CONSTRAINT "patient_addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."patient_admin_info"
    ADD CONSTRAINT "patient_admin_info_pkey" PRIMARY KEY ("patient_id");



ALTER TABLE ONLY "public"."patient_clinical_summaries"
    ADD CONSTRAINT "patient_clinical_summaries_pkey" PRIMARY KEY ("patient_id");



ALTER TABLE ONLY "public"."patient_financial_info"
    ADD CONSTRAINT "patient_financial_info_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."patient_support_network"
    ADD CONSTRAINT "patient_support_network_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."presence"
    ADD CONSTRAINT "presence_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shifts"
    ADD CONSTRAINT "shifts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."supply_requests"
    ADD CONSTRAINT "supply_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_auth_user_id_key" UNIQUE ("auth_user_id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_pa_tenant_patient" ON "public"."patient_addresses" USING "btree" ("tenant_id", "patient_id");



CREATE INDEX "idx_patient_admin_info_patient" ON "public"."patient_admin_info" USING "btree" ("patient_id");



CREATE INDEX "idx_patient_admin_info_tenant" ON "public"."patient_admin_info" USING "btree" ("tenant_id");



CREATE INDEX "idx_patients_cpf" ON "public"."patients" USING "btree" ("cpf");



CREATE INDEX "idx_patients_tenant" ON "public"."patients" USING "btree" ("tenant_id");



CREATE INDEX "idx_pcs_patient" ON "public"."patient_clinical_summaries" USING "btree" ("patient_id");



CREATE INDEX "idx_pcs_tenant" ON "public"."patient_clinical_summaries" USING "btree" ("tenant_id");



CREATE INDEX "idx_pfi_patient" ON "public"."patient_financial_info" USING "btree" ("patient_id");



CREATE INDEX "idx_pfi_tenant" ON "public"."patient_financial_info" USING "btree" ("tenant_id");



CREATE INDEX "idx_posts_shift" ON "public"."posts" USING "btree" ("shift_id");



CREATE INDEX "idx_presence_shift_user" ON "public"."presence" USING "btree" ("shift_id", "user_id");



CREATE INDEX "idx_psn_patient" ON "public"."patient_support_network" USING "btree" ("patient_id");



CREATE INDEX "idx_psn_tenant" ON "public"."patient_support_network" USING "btree" ("tenant_id");



CREATE INDEX "idx_shifts_start" ON "public"."shifts" USING "btree" ("start_at");



CREATE INDEX "idx_shifts_status" ON "public"."shifts" USING "btree" ("status");



CREATE INDEX "idx_supply_requests_shift" ON "public"."supply_requests" USING "btree" ("shift_id");



CREATE UNIQUE INDEX "uq_user_profiles_auth" ON "public"."user_profiles" USING "btree" ("auth_user_id");



CREATE OR REPLACE TRIGGER "trg_pfi_updated_at" BEFORE UPDATE ON "public"."patient_financial_info" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_psn_updated_at" BEFORE UPDATE ON "public"."patient_support_network" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."patient_addresses"
    ADD CONSTRAINT "patient_addresses_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."patient_admin_info"
    ADD CONSTRAINT "patient_admin_info_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."patient_clinical_summaries"
    ADD CONSTRAINT "patient_clinical_summaries_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."patient_financial_info"
    ADD CONSTRAINT "patient_financial_info_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."patient_financial_info"
    ADD CONSTRAINT "patient_financial_info_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."patient_support_network"
    ADD CONSTRAINT "patient_support_network_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."patient_support_network"
    ADD CONSTRAINT "patient_support_network_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id");



ALTER TABLE ONLY "public"."presence"
    ADD CONSTRAINT "presence_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id");



ALTER TABLE ONLY "public"."presence"
    ADD CONSTRAINT "presence_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."shifts"
    ADD CONSTRAINT "shifts_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."supply_requests"
    ADD CONSTRAINT "supply_requests_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_items"("id");



ALTER TABLE ONLY "public"."supply_requests"
    ADD CONSTRAINT "supply_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."supply_requests"
    ADD CONSTRAINT "supply_requests_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id");



ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "audit_read_admins" ON "public"."audit_logs" FOR SELECT USING ((("tenant_id" = "public"."current_tenant"()) AND (EXISTS ( SELECT 1
   FROM "public"."user_profiles" "up"
  WHERE (("up"."auth_user_id" = "auth"."uid"()) AND ("up"."tenant_id" = "public"."current_tenant"()) AND ("up"."role" = ANY (ARRAY['admin'::"text", 'coordinator'::"text"])))))));



CREATE POLICY "financial_insert_same_tenant" ON "public"."patient_financial_info" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "financial_select_same_tenant" ON "public"."patient_financial_info" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "financial_update_same_tenant" ON "public"."patient_financial_info" FOR UPDATE USING (("tenant_id" = "public"."current_tenant"())) WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "inv_select_same_tenant" ON "public"."inventory_items" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



ALTER TABLE "public"."inventory_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "pa_select_same_tenant" ON "public"."patient_addresses" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pa_update_same_tenant" ON "public"."patient_addresses" FOR UPDATE USING (("tenant_id" = "public"."current_tenant"())) WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pa_upsert_same_tenant" ON "public"."patient_addresses" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pai_insert_same_tenant" ON "public"."patient_admin_info" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pai_select_same_tenant" ON "public"."patient_admin_info" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pai_update_same_tenant" ON "public"."patient_admin_info" FOR UPDATE USING (("tenant_id" = "public"."current_tenant"())) WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pai_upsert_same_tenant" ON "public"."patient_admin_info" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



ALTER TABLE "public"."patient_addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."patient_admin_info" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."patient_clinical_summaries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."patient_financial_info" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."patient_support_network" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."patients" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "patients_insert_same_tenant" ON "public"."patients" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "patients_select_same_tenant" ON "public"."patients" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "patients_update_same_tenant" ON "public"."patients" FOR UPDATE USING (("tenant_id" = "public"."current_tenant"())) WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pcs_insert_same_tenant" ON "public"."patient_clinical_summaries" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pcs_select_same_tenant" ON "public"."patient_clinical_summaries" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pcs_update_same_tenant" ON "public"."patient_clinical_summaries" FOR UPDATE USING (("tenant_id" = "public"."current_tenant"())) WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "pcs_upsert_same_tenant" ON "public"."patient_clinical_summaries" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "posts_insert_same_tenant" ON "public"."posts" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "posts_select_same_tenant" ON "public"."posts" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



ALTER TABLE "public"."presence" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "presence_select_same_tenant" ON "public"."presence" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "presence_self_update" ON "public"."presence" FOR UPDATE USING ((("tenant_id" = "public"."current_tenant"()) AND ("user_id" = "auth"."uid"())));



CREATE POLICY "presence_self_upsert" ON "public"."presence" FOR INSERT WITH CHECK ((("tenant_id" = "public"."current_tenant"()) AND ("user_id" = "auth"."uid"())));



ALTER TABLE "public"."shifts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "shifts_insert_same_tenant" ON "public"."shifts" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "shifts_select_same_tenant" ON "public"."shifts" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "sr_insert_same_tenant" ON "public"."supply_requests" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "sr_select_same_tenant" ON "public"."supply_requests" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



ALTER TABLE "public"."supply_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "support_insert_same_tenant" ON "public"."patient_support_network" FOR INSERT WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "support_select_same_tenant" ON "public"."patient_support_network" FOR SELECT USING (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "support_update_same_tenant" ON "public"."patient_support_network" FOR UPDATE USING (("tenant_id" = "public"."current_tenant"())) WITH CHECK (("tenant_id" = "public"."current_tenant"()));



CREATE POLICY "up_select_same_tenant" ON "public"."user_profiles" FOR SELECT USING ((("tenant_id" IS NULL) OR ("tenant_id" = "public"."current_tenant"())));



ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."posts";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."presence";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."shifts";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."current_tenant"() TO "anon";
GRANT ALL ON FUNCTION "public"."current_tenant"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_tenant"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."_prisma_migrations" TO "anon";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "authenticated";
GRANT ALL ON TABLE "public"."_prisma_migrations" TO "service_role";



GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."audit_logs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."audit_logs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."audit_logs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."inventory_items" TO "anon";
GRANT ALL ON TABLE "public"."inventory_items" TO "authenticated";
GRANT ALL ON TABLE "public"."inventory_items" TO "service_role";



GRANT ALL ON TABLE "public"."patient_addresses" TO "anon";
GRANT ALL ON TABLE "public"."patient_addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."patient_addresses" TO "service_role";



GRANT ALL ON TABLE "public"."patient_admin_info" TO "anon";
GRANT ALL ON TABLE "public"."patient_admin_info" TO "authenticated";
GRANT ALL ON TABLE "public"."patient_admin_info" TO "service_role";



GRANT ALL ON TABLE "public"."patient_clinical_summaries" TO "anon";
GRANT ALL ON TABLE "public"."patient_clinical_summaries" TO "authenticated";
GRANT ALL ON TABLE "public"."patient_clinical_summaries" TO "service_role";



GRANT ALL ON TABLE "public"."patient_financial_info" TO "anon";
GRANT ALL ON TABLE "public"."patient_financial_info" TO "authenticated";
GRANT ALL ON TABLE "public"."patient_financial_info" TO "service_role";



GRANT ALL ON TABLE "public"."patient_support_network" TO "anon";
GRANT ALL ON TABLE "public"."patient_support_network" TO "authenticated";
GRANT ALL ON TABLE "public"."patient_support_network" TO "service_role";



GRANT ALL ON TABLE "public"."patients" TO "anon";
GRANT ALL ON TABLE "public"."patients" TO "authenticated";
GRANT ALL ON TABLE "public"."patients" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."presence" TO "anon";
GRANT ALL ON TABLE "public"."presence" TO "authenticated";
GRANT ALL ON TABLE "public"."presence" TO "service_role";



GRANT ALL ON TABLE "public"."shifts" TO "anon";
GRANT ALL ON TABLE "public"."shifts" TO "authenticated";
GRANT ALL ON TABLE "public"."shifts" TO "service_role";



GRANT ALL ON TABLE "public"."supply_requests" TO "anon";
GRANT ALL ON TABLE "public"."supply_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."supply_requests" TO "service_role";



GRANT ALL ON TABLE "public"."tenants" TO "anon";
GRANT ALL ON TABLE "public"."tenants" TO "authenticated";
GRANT ALL ON TABLE "public"."tenants" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


