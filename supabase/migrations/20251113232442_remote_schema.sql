drop extension if exists "pg_net";

drop trigger if exists "trg_touch_app_users" on "public"."app_users";

drop trigger if exists "trg_touch_inventory" on "public"."inventory_items";

drop trigger if exists "trg_audit_patients" on "public"."patients";

drop trigger if exists "trg_touch_patients" on "public"."patients";

drop trigger if exists "trg_touch_professionals" on "public"."professionals";

drop trigger if exists "trg_audit_shift_posts" on "public"."shift_posts";

drop trigger if exists "trg_touch_shift_posts" on "public"."shift_posts";

drop trigger if exists "trg_audit_shift_presence" on "public"."shift_presence";

drop trigger if exists "trg_touch_shift_presence" on "public"."shift_presence";

drop trigger if exists "trg_audit_shifts" on "public"."shifts";

drop trigger if exists "trg_touch_shifts" on "public"."shifts";

drop trigger if exists "trg_audit_supply_requests" on "public"."supply_requests";

drop trigger if exists "trg_touch_supply_requests" on "public"."supply_requests";

drop trigger if exists "trg_touch_tenants" on "public"."tenants";

drop policy "users_manage_admin" on "public"."app_users";

drop policy "users_self_select" on "public"."app_users";

drop policy "audit_select_admin" on "public"."audit_logs";

drop policy "inventory_manage_roles" on "public"."inventory_items";

drop policy "inventory_select_same_tenant" on "public"."inventory_items";

drop policy "patients_update_roles" on "public"."patients";

drop policy "patients_write_roles" on "public"."patients";

drop policy "professionals_manage_admin" on "public"."professionals";

drop policy "professionals_select_same_tenant" on "public"."professionals";

drop policy "posts_insert_members" on "public"."shift_posts";

drop policy "posts_select_shift_members" on "public"."shift_posts";

drop policy "posts_update_author_or_admin" on "public"."shift_posts";

drop policy "presence_admin_manage" on "public"."shift_presence";

drop policy "presence_select_shift_members" on "public"."shift_presence";

drop policy "presence_upsert_self" on "public"."shift_presence";

drop policy "shifts_insert_roles" on "public"."shifts";

drop policy "shifts_update_roles" on "public"."shifts";

drop policy "supply_insert_members" on "public"."supply_requests";

drop policy "supply_select_same_tenant" on "public"."supply_requests";

drop policy "supply_update_admin" on "public"."supply_requests";

drop policy "tenant_admin_manage" on "public"."tenants";

drop policy "tenant_member_read" on "public"."tenants";

drop policy "patients_select_same_tenant" on "public"."patients";

drop policy "shifts_select_same_tenant" on "public"."shifts";

revoke delete on table "public"."app_users" from "anon";

revoke insert on table "public"."app_users" from "anon";

revoke references on table "public"."app_users" from "anon";

revoke select on table "public"."app_users" from "anon";

revoke trigger on table "public"."app_users" from "anon";

revoke truncate on table "public"."app_users" from "anon";

revoke update on table "public"."app_users" from "anon";

revoke delete on table "public"."app_users" from "authenticated";

revoke insert on table "public"."app_users" from "authenticated";

revoke references on table "public"."app_users" from "authenticated";

revoke select on table "public"."app_users" from "authenticated";

revoke trigger on table "public"."app_users" from "authenticated";

revoke truncate on table "public"."app_users" from "authenticated";

revoke update on table "public"."app_users" from "authenticated";

revoke delete on table "public"."app_users" from "service_role";

revoke insert on table "public"."app_users" from "service_role";

revoke references on table "public"."app_users" from "service_role";

revoke select on table "public"."app_users" from "service_role";

revoke trigger on table "public"."app_users" from "service_role";

revoke truncate on table "public"."app_users" from "service_role";

revoke update on table "public"."app_users" from "service_role";

revoke delete on table "public"."professionals" from "anon";

revoke insert on table "public"."professionals" from "anon";

revoke references on table "public"."professionals" from "anon";

revoke select on table "public"."professionals" from "anon";

revoke trigger on table "public"."professionals" from "anon";

revoke truncate on table "public"."professionals" from "anon";

revoke update on table "public"."professionals" from "anon";

revoke delete on table "public"."professionals" from "authenticated";

revoke insert on table "public"."professionals" from "authenticated";

revoke references on table "public"."professionals" from "authenticated";

revoke select on table "public"."professionals" from "authenticated";

revoke trigger on table "public"."professionals" from "authenticated";

revoke truncate on table "public"."professionals" from "authenticated";

revoke update on table "public"."professionals" from "authenticated";

revoke delete on table "public"."professionals" from "service_role";

revoke insert on table "public"."professionals" from "service_role";

revoke references on table "public"."professionals" from "service_role";

revoke select on table "public"."professionals" from "service_role";

revoke trigger on table "public"."professionals" from "service_role";

revoke truncate on table "public"."professionals" from "service_role";

revoke update on table "public"."professionals" from "service_role";

revoke delete on table "public"."shift_posts" from "anon";

revoke insert on table "public"."shift_posts" from "anon";

revoke references on table "public"."shift_posts" from "anon";

revoke select on table "public"."shift_posts" from "anon";

revoke trigger on table "public"."shift_posts" from "anon";

revoke truncate on table "public"."shift_posts" from "anon";

revoke update on table "public"."shift_posts" from "anon";

revoke delete on table "public"."shift_posts" from "authenticated";

revoke insert on table "public"."shift_posts" from "authenticated";

revoke references on table "public"."shift_posts" from "authenticated";

revoke select on table "public"."shift_posts" from "authenticated";

revoke trigger on table "public"."shift_posts" from "authenticated";

revoke truncate on table "public"."shift_posts" from "authenticated";

revoke update on table "public"."shift_posts" from "authenticated";

revoke delete on table "public"."shift_posts" from "service_role";

revoke insert on table "public"."shift_posts" from "service_role";

revoke references on table "public"."shift_posts" from "service_role";

revoke select on table "public"."shift_posts" from "service_role";

revoke trigger on table "public"."shift_posts" from "service_role";

revoke truncate on table "public"."shift_posts" from "service_role";

revoke update on table "public"."shift_posts" from "service_role";

revoke delete on table "public"."shift_presence" from "anon";

revoke insert on table "public"."shift_presence" from "anon";

revoke references on table "public"."shift_presence" from "anon";

revoke select on table "public"."shift_presence" from "anon";

revoke trigger on table "public"."shift_presence" from "anon";

revoke truncate on table "public"."shift_presence" from "anon";

revoke update on table "public"."shift_presence" from "anon";

revoke delete on table "public"."shift_presence" from "authenticated";

revoke insert on table "public"."shift_presence" from "authenticated";

revoke references on table "public"."shift_presence" from "authenticated";

revoke select on table "public"."shift_presence" from "authenticated";

revoke trigger on table "public"."shift_presence" from "authenticated";

revoke truncate on table "public"."shift_presence" from "authenticated";

revoke update on table "public"."shift_presence" from "authenticated";

revoke delete on table "public"."shift_presence" from "service_role";

revoke insert on table "public"."shift_presence" from "service_role";

revoke references on table "public"."shift_presence" from "service_role";

revoke select on table "public"."shift_presence" from "service_role";

revoke trigger on table "public"."shift_presence" from "service_role";

revoke truncate on table "public"."shift_presence" from "service_role";

revoke update on table "public"."shift_presence" from "service_role";

alter table "public"."app_users" drop constraint "app_users_email_key";

alter table "public"."app_users" drop constraint "app_users_id_fkey";

alter table "public"."app_users" drop constraint "app_users_tenant_id_fkey";

alter table "public"."audit_logs" drop constraint "audit_logs_actor_id_fkey";

alter table "public"."audit_logs" drop constraint "audit_logs_tenant_id_fkey";

alter table "public"."inventory_items" drop constraint "inventory_items_tenant_id_fkey";

alter table "public"."patients" drop constraint "patients_tenant_id_fkey";

alter table "public"."professionals" drop constraint "professionals_tenant_id_fkey";

alter table "public"."shift_posts" drop constraint "shift_posts_author_id_fkey";

alter table "public"."shift_posts" drop constraint "shift_posts_shift_id_fkey";

alter table "public"."shift_posts" drop constraint "shift_posts_tenant_id_fkey";

alter table "public"."shift_presence" drop constraint "shift_presence_professional_id_fkey";

alter table "public"."shift_presence" drop constraint "shift_presence_shift_id_fkey";

alter table "public"."shift_presence" drop constraint "shift_presence_tenant_id_fkey";

alter table "public"."shift_presence" drop constraint "shift_presence_user_id_fkey";

alter table "public"."shifts" drop constraint "shifts_created_by_id_fkey";

alter table "public"."shifts" drop constraint "shifts_patient_id_fkey";

alter table "public"."shifts" drop constraint "shifts_professional_id_fkey";

alter table "public"."shifts" drop constraint "shifts_tenant_id_fkey";

alter table "public"."supply_requests" drop constraint "supply_requests_patient_id_fkey";

alter table "public"."supply_requests" drop constraint "supply_requests_requested_by_fkey";

alter table "public"."supply_requests" drop constraint "supply_requests_tenant_id_fkey";

alter table "public"."tenants" drop constraint "tenants_slug_key";

alter table "public"."supply_requests" drop constraint "supply_requests_item_id_fkey";

drop function if exists "app_private"."current_app_role"();

drop function if exists "app_private"."current_tenant_id"();

drop function if exists "app_private"."current_user_id"();

drop trigger if exists "on_auth_user_created" on "auth"."users";

drop function if exists "app_private"."log_audit"();

drop function if exists "app_private"."touch_updated_at"();

drop function if exists "public"."handle_new_auth_user"();

alter table "public"."app_users" drop constraint "app_users_pkey";

alter table "public"."professionals" drop constraint "professionals_pkey";

alter table "public"."shift_posts" drop constraint "shift_posts_pkey";

alter table "public"."shift_presence" drop constraint "shift_presence_pkey";

drop index if exists "public"."app_users_email_key";

drop index if exists "public"."app_users_pkey";

drop index if exists "public"."idx_audit_entity";

drop index if exists "public"."idx_inventory_tenant_sku";

drop index if exists "public"."idx_posts_shift_created";

drop index if exists "public"."idx_shifts_tenant_start";

drop index if exists "public"."idx_supply_requests_patient";

drop index if exists "public"."professionals_pkey";

drop index if exists "public"."shift_posts_pkey";

drop index if exists "public"."shift_presence_pkey";

drop index if exists "public"."tenants_slug_key";

drop index if exists "public"."idx_presence_shift_user";

drop index if exists "public"."idx_shifts_status";

drop table "public"."app_users";

drop table "public"."professionals";

drop table "public"."shift_posts";

drop table "public"."shift_presence";


  create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
      );



  create table "public"."patient_addresses" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid not null,
    "patient_id" uuid not null,
    "cep" text,
    "address_line" text,
    "number" text,
    "complement" text,
    "neighborhood" text,
    "city" text,
    "state" text,
    "reference_point" text,
    "geo_lat" numeric(9,6),
    "geo_lng" numeric(9,6),
    "zone_type" text,
    "gatehouse_name" text,
    "visit_hours" jsonb,
    "local_security" text[],
    "facade_photo_url" text,
    "residence_type" text,
    "floor" integer,
    "internal_access" text,
    "accessibility" jsonb,
    "stay_location" text,
    "electric_infra" text,
    "water_source" text,
    "has_wifi" boolean,
    "backup_power" text,
    "adapted_bathroom" boolean,
    "ambulance_access" text,
    "parking" text,
    "entry_procedure" text,
    "avg_eta_min" integer,
    "works_or_obstacles" text,
    "night_access_risk" text,
    "pets" jsonb,
    "residents" jsonb,
    "caregivers" jsonb,
    "hygiene_rating" text,
    "environmental_risk" text[],
    "has_smokers" boolean,
    "ventilation" text,
    "noise_level" text,
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone
      );


alter table "public"."patient_addresses" enable row level security;


  create table "public"."patient_admin_info" (
    "patient_id" uuid not null,
    "tenant_id" uuid not null,
    "status" text,
    "admission_type" text,
    "complexity" text,
    "service_package" text,
    "start_date" date,
    "end_date" date,
    "supervisor_id" uuid,
    "escalista_id" uuid,
    "nurse_responsible_id" uuid,
    "frequency" text,
    "operation_area" text,
    "admission_source" text,
    "contract_id" text,
    "last_audit_date" date,
    "last_audit_by" uuid,
    "notes_internal" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone,
    "last_update_by" text,
    "meta" jsonb
      );


alter table "public"."patient_admin_info" enable row level security;


  create table "public"."patient_clinical_summaries" (
    "patient_id" uuid not null,
    "tenant_id" uuid not null,
    "summary" jsonb not null,
    "meta" jsonb,
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."patient_clinical_summaries" enable row level security;


  create table "public"."patient_financial_info" (
    "id" uuid not null default gen_random_uuid(),
    "patient_id" uuid not null,
    "tenant_id" uuid not null,
    "bond_type" text,
    "insurer" text,
    "plan_name" text,
    "card_number" text,
    "validity" date,
    "monthly_fee" numeric,
    "due_day" integer,
    "payment_method" text,
    "billing_status" text,
    "last_payment_date" date,
    "last_payment_amount" numeric,
    "financial_contact" text,
    "observations" text,
    "invoice_history" jsonb default '[]'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."patient_financial_info" enable row level security;


  create table "public"."patient_support_network" (
    "id" uuid not null default gen_random_uuid(),
    "patient_id" uuid not null,
    "tenant_id" uuid not null,
    "responsible_legal" jsonb,
    "network" jsonb default '[]'::jsonb,
    "emergency_contact" jsonb,
    "notes_support" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."patient_support_network" enable row level security;


  create table "public"."posts" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid,
    "author_id" uuid,
    "shift_id" uuid,
    "content" text,
    "pinned" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."posts" enable row level security;


  create table "public"."presence" (
    "id" uuid not null default gen_random_uuid(),
    "tenant_id" uuid,
    "user_id" uuid,
    "shift_id" uuid,
    "state" text not null,
    "last_seen" timestamp with time zone default now()
      );


alter table "public"."presence" enable row level security;


  create table "public"."user_profiles" (
    "id" uuid not null default gen_random_uuid(),
    "auth_user_id" uuid,
    "email" text,
    "name" text,
    "phone" text,
    "role" text,
    "tenant_id" uuid,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."user_profiles" enable row level security;

alter table "public"."audit_logs" drop column "context";

alter table "public"."audit_logs" alter column "action" drop not null;

alter table "public"."audit_logs" alter column "created_at" drop not null;

alter table "public"."audit_logs" alter column "entity" drop not null;

alter table "public"."audit_logs" alter column "entity_id" set data type uuid using "entity_id"::uuid;

alter table "public"."inventory_items" drop column "description";

alter table "public"."inventory_items" drop column "location";

alter table "public"."inventory_items" drop column "meta";

alter table "public"."inventory_items" drop column "quantity";

alter table "public"."inventory_items" drop column "sku";

alter table "public"."inventory_items" drop column "threshold";

alter table "public"."inventory_items" drop column "updated_at";

alter table "public"."inventory_items" add column "min_stock" integer;

alter table "public"."inventory_items" alter column "created_at" drop not null;

alter table "public"."patients" drop column "address";

alter table "public"."patients" drop column "clinical_summary";

alter table "public"."patients" drop column "contact_email";

alter table "public"."patients" drop column "contact_phone";

alter table "public"."patients" drop column "document_id";

alter table "public"."patients" drop column "gender";

alter table "public"."patients" drop column "status";

alter table "public"."patients" add column "access_log_summary" jsonb;

alter table "public"."patients" add column "civil_status" text;

alter table "public"."patients" add column "cns" text;

alter table "public"."patients" add column "communication_opt_out" jsonb;

alter table "public"."patients" add column "cpf" text;

alter table "public"."patients" add column "cpf_status" text default 'unknown'::text;

alter table "public"."patients" add column "created_by" uuid;

alter table "public"."patients" add column "display_name" text;

alter table "public"."patients" add column "document_validation" jsonb;

alter table "public"."patients" add column "duplicate_candidates" uuid[];

alter table "public"."patients" add column "emails" jsonb;

alter table "public"."patients" add column "emergency_contacts" jsonb;

alter table "public"."patients" add column "external_ids" jsonb;

alter table "public"."patients" add column "gender_identity" text;

alter table "public"."patients" add column "identity_verification" jsonb;

alter table "public"."patients" add column "last_viewed_at" timestamp with time zone;

alter table "public"."patients" add column "legal_guardian" jsonb;

alter table "public"."patients" add column "national_id" text;

alter table "public"."patients" add column "nationality" text;

alter table "public"."patients" add column "phones" jsonb;

alter table "public"."patients" add column "photo_consent" jsonb;

alter table "public"."patients" add column "photo_url" text;

alter table "public"."patients" add column "place_of_birth" text;

alter table "public"."patients" add column "preferred_contact_method" text;

alter table "public"."patients" add column "preferred_language" text;

alter table "public"."patients" add column "pronouns" text;

alter table "public"."patients" add column "record_status" text default 'active'::text;

alter table "public"."patients" add column "rg" text;

alter table "public"."patients" add column "rg_digital_url" text;

alter table "public"."patients" add column "rg_issuer" text;

alter table "public"."patients" add column "risk_flags" text[];

alter table "public"."patients" add column "sensitive_data_consent" jsonb;

alter table "public"."patients" add column "sex_at_birth" text default 'Unknown'::text;

alter table "public"."patients" add column "updated_by" uuid;

alter table "public"."patients" alter column "tenant_id" set not null;

alter table "public"."patients" alter column "updated_at" drop default;

alter table "public"."patients" alter column "updated_at" drop not null;

alter table "public"."shifts" drop column "created_by_id";

alter table "public"."shifts" drop column "location";

alter table "public"."shifts" drop column "meta";

alter table "public"."shifts" drop column "patient_id";

alter table "public"."shifts" drop column "professional_id";

alter table "public"."shifts" add column "owner_id" uuid;

alter table "public"."shifts" alter column "created_at" drop not null;

alter table "public"."shifts" alter column "end_at" drop not null;

alter table "public"."shifts" alter column "status" set data type text using "status"::text;

alter table "public"."shifts" alter column "status" set default 'scheduled'::text;

alter table "public"."shifts" alter column "updated_at" drop not null;

alter table "public"."supply_requests" drop column "due_at";

alter table "public"."supply_requests" drop column "notes";

alter table "public"."supply_requests" drop column "patient_id";

alter table "public"."supply_requests" drop column "quantity";

alter table "public"."supply_requests" drop column "requested_by";

alter table "public"."supply_requests" drop column "updated_at";

alter table "public"."supply_requests" add column "qty" integer not null;

alter table "public"."supply_requests" add column "requester_id" uuid;

alter table "public"."supply_requests" add column "shift_id" uuid;

alter table "public"."supply_requests" alter column "created_at" drop not null;

alter table "public"."supply_requests" alter column "status" drop not null;

alter table "public"."supply_requests" alter column "status" set data type text using "status"::text;

alter table "public"."supply_requests" alter column "status" set default 'pending'::text;

alter table "public"."tenants" drop column "slug";

alter table "public"."tenants" drop column "updated_at";

alter table "public"."tenants" alter column "created_at" drop not null;

alter table "public"."tenants" alter column "name" drop not null;

alter table "public"."tenants" disable row level security;

drop type "public"."patient_status";

drop type "public"."presence_state";

drop type "public"."shift_status";

drop type "public"."supply_request_status";

drop type "public"."user_role";

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

CREATE INDEX idx_pa_tenant_patient ON public.patient_addresses USING btree (tenant_id, patient_id);

CREATE INDEX idx_patient_admin_info_patient ON public.patient_admin_info USING btree (patient_id);

CREATE INDEX idx_patient_admin_info_tenant ON public.patient_admin_info USING btree (tenant_id);

CREATE INDEX idx_patients_cpf ON public.patients USING btree (cpf);

CREATE INDEX idx_patients_tenant ON public.patients USING btree (tenant_id);

CREATE INDEX idx_pcs_patient ON public.patient_clinical_summaries USING btree (patient_id);

CREATE INDEX idx_pcs_tenant ON public.patient_clinical_summaries USING btree (tenant_id);

CREATE INDEX idx_pfi_patient ON public.patient_financial_info USING btree (patient_id);

CREATE INDEX idx_pfi_tenant ON public.patient_financial_info USING btree (tenant_id);

CREATE INDEX idx_posts_shift ON public.posts USING btree (shift_id);

CREATE INDEX idx_psn_patient ON public.patient_support_network USING btree (patient_id);

CREATE INDEX idx_psn_tenant ON public.patient_support_network USING btree (tenant_id);

CREATE INDEX idx_shifts_start ON public.shifts USING btree (start_at);

CREATE INDEX idx_supply_requests_shift ON public.supply_requests USING btree (shift_id);

CREATE UNIQUE INDEX patient_addresses_pkey ON public.patient_addresses USING btree (id);

CREATE UNIQUE INDEX patient_admin_info_pkey ON public.patient_admin_info USING btree (patient_id);

CREATE UNIQUE INDEX patient_clinical_summaries_pkey ON public.patient_clinical_summaries USING btree (patient_id);

CREATE UNIQUE INDEX patient_financial_info_pkey ON public.patient_financial_info USING btree (id);

CREATE UNIQUE INDEX patient_support_network_pkey ON public.patient_support_network USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX presence_pkey ON public.presence USING btree (id);

CREATE UNIQUE INDEX uq_user_profiles_auth ON public.user_profiles USING btree (auth_user_id);

CREATE UNIQUE INDEX user_profiles_auth_user_id_key ON public.user_profiles USING btree (auth_user_id);

CREATE UNIQUE INDEX user_profiles_email_key ON public.user_profiles USING btree (email);

CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (id);

CREATE INDEX idx_presence_shift_user ON public.presence USING btree (shift_id, user_id);

CREATE INDEX idx_shifts_status ON public.shifts USING btree (status);

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."patient_addresses" add constraint "patient_addresses_pkey" PRIMARY KEY using index "patient_addresses_pkey";

alter table "public"."patient_admin_info" add constraint "patient_admin_info_pkey" PRIMARY KEY using index "patient_admin_info_pkey";

alter table "public"."patient_clinical_summaries" add constraint "patient_clinical_summaries_pkey" PRIMARY KEY using index "patient_clinical_summaries_pkey";

alter table "public"."patient_financial_info" add constraint "patient_financial_info_pkey" PRIMARY KEY using index "patient_financial_info_pkey";

alter table "public"."patient_support_network" add constraint "patient_support_network_pkey" PRIMARY KEY using index "patient_support_network_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."presence" add constraint "presence_pkey" PRIMARY KEY using index "presence_pkey";

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."patient_addresses" add constraint "patient_addresses_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE not valid;

alter table "public"."patient_addresses" validate constraint "patient_addresses_patient_id_fkey";

alter table "public"."patient_admin_info" add constraint "patient_admin_info_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE not valid;

alter table "public"."patient_admin_info" validate constraint "patient_admin_info_patient_id_fkey";

alter table "public"."patient_clinical_summaries" add constraint "patient_clinical_summaries_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE not valid;

alter table "public"."patient_clinical_summaries" validate constraint "patient_clinical_summaries_patient_id_fkey";

alter table "public"."patient_financial_info" add constraint "patient_financial_info_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE not valid;

alter table "public"."patient_financial_info" validate constraint "patient_financial_info_patient_id_fkey";

alter table "public"."patient_financial_info" add constraint "patient_financial_info_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."patient_financial_info" validate constraint "patient_financial_info_tenant_id_fkey";

alter table "public"."patient_support_network" add constraint "patient_support_network_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE not valid;

alter table "public"."patient_support_network" validate constraint "patient_support_network_patient_id_fkey";

alter table "public"."patient_support_network" add constraint "patient_support_network_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE not valid;

alter table "public"."patient_support_network" validate constraint "patient_support_network_tenant_id_fkey";

alter table "public"."patients" add constraint "patients_cpf_status_check" CHECK ((cpf_status = ANY (ARRAY['valid'::text, 'invalid'::text, 'unknown'::text]))) not valid;

alter table "public"."patients" validate constraint "patients_cpf_status_check";

alter table "public"."patients" add constraint "patients_record_status_check" CHECK ((record_status = ANY (ARRAY['active'::text, 'inactive'::text, 'deceased'::text]))) not valid;

alter table "public"."patients" validate constraint "patients_record_status_check";

alter table "public"."patients" add constraint "patients_sex_at_birth_check" CHECK ((sex_at_birth = ANY (ARRAY['M'::text, 'F'::text, 'Other'::text, 'Unknown'::text]))) not valid;

alter table "public"."patients" validate constraint "patients_sex_at_birth_check";

alter table "public"."posts" add constraint "posts_author_id_fkey" FOREIGN KEY (author_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."posts" validate constraint "posts_author_id_fkey";

alter table "public"."posts" add constraint "posts_shift_id_fkey" FOREIGN KEY (shift_id) REFERENCES public.shifts(id) not valid;

alter table "public"."posts" validate constraint "posts_shift_id_fkey";

alter table "public"."presence" add constraint "presence_shift_id_fkey" FOREIGN KEY (shift_id) REFERENCES public.shifts(id) not valid;

alter table "public"."presence" validate constraint "presence_shift_id_fkey";

alter table "public"."presence" add constraint "presence_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."presence" validate constraint "presence_user_id_fkey";

alter table "public"."shifts" add constraint "shifts_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."shifts" validate constraint "shifts_owner_id_fkey";

alter table "public"."supply_requests" add constraint "supply_requests_requester_id_fkey" FOREIGN KEY (requester_id) REFERENCES public.user_profiles(id) not valid;

alter table "public"."supply_requests" validate constraint "supply_requests_requester_id_fkey";

alter table "public"."supply_requests" add constraint "supply_requests_shift_id_fkey" FOREIGN KEY (shift_id) REFERENCES public.shifts(id) not valid;

alter table "public"."supply_requests" validate constraint "supply_requests_shift_id_fkey";

alter table "public"."user_profiles" add constraint "user_profiles_auth_user_id_key" UNIQUE using index "user_profiles_auth_user_id_key";

alter table "public"."user_profiles" add constraint "user_profiles_email_key" UNIQUE using index "user_profiles_email_key";

alter table "public"."supply_requests" add constraint "supply_requests_item_id_fkey" FOREIGN KEY (item_id) REFERENCES public.inventory_items(id) not valid;

alter table "public"."supply_requests" validate constraint "supply_requests_item_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.current_tenant()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  select nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id','')::uuid
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

grant delete on table "public"."_prisma_migrations" to "anon";

grant insert on table "public"."_prisma_migrations" to "anon";

grant references on table "public"."_prisma_migrations" to "anon";

grant select on table "public"."_prisma_migrations" to "anon";

grant trigger on table "public"."_prisma_migrations" to "anon";

grant truncate on table "public"."_prisma_migrations" to "anon";

grant update on table "public"."_prisma_migrations" to "anon";

grant delete on table "public"."_prisma_migrations" to "authenticated";

grant insert on table "public"."_prisma_migrations" to "authenticated";

grant references on table "public"."_prisma_migrations" to "authenticated";

grant select on table "public"."_prisma_migrations" to "authenticated";

grant trigger on table "public"."_prisma_migrations" to "authenticated";

grant truncate on table "public"."_prisma_migrations" to "authenticated";

grant update on table "public"."_prisma_migrations" to "authenticated";

grant delete on table "public"."_prisma_migrations" to "service_role";

grant insert on table "public"."_prisma_migrations" to "service_role";

grant references on table "public"."_prisma_migrations" to "service_role";

grant select on table "public"."_prisma_migrations" to "service_role";

grant trigger on table "public"."_prisma_migrations" to "service_role";

grant truncate on table "public"."_prisma_migrations" to "service_role";

grant update on table "public"."_prisma_migrations" to "service_role";

grant delete on table "public"."patient_addresses" to "anon";

grant insert on table "public"."patient_addresses" to "anon";

grant references on table "public"."patient_addresses" to "anon";

grant select on table "public"."patient_addresses" to "anon";

grant trigger on table "public"."patient_addresses" to "anon";

grant truncate on table "public"."patient_addresses" to "anon";

grant update on table "public"."patient_addresses" to "anon";

grant delete on table "public"."patient_addresses" to "authenticated";

grant insert on table "public"."patient_addresses" to "authenticated";

grant references on table "public"."patient_addresses" to "authenticated";

grant select on table "public"."patient_addresses" to "authenticated";

grant trigger on table "public"."patient_addresses" to "authenticated";

grant truncate on table "public"."patient_addresses" to "authenticated";

grant update on table "public"."patient_addresses" to "authenticated";

grant delete on table "public"."patient_addresses" to "service_role";

grant insert on table "public"."patient_addresses" to "service_role";

grant references on table "public"."patient_addresses" to "service_role";

grant select on table "public"."patient_addresses" to "service_role";

grant trigger on table "public"."patient_addresses" to "service_role";

grant truncate on table "public"."patient_addresses" to "service_role";

grant update on table "public"."patient_addresses" to "service_role";

grant delete on table "public"."patient_admin_info" to "anon";

grant insert on table "public"."patient_admin_info" to "anon";

grant references on table "public"."patient_admin_info" to "anon";

grant select on table "public"."patient_admin_info" to "anon";

grant trigger on table "public"."patient_admin_info" to "anon";

grant truncate on table "public"."patient_admin_info" to "anon";

grant update on table "public"."patient_admin_info" to "anon";

grant delete on table "public"."patient_admin_info" to "authenticated";

grant insert on table "public"."patient_admin_info" to "authenticated";

grant references on table "public"."patient_admin_info" to "authenticated";

grant select on table "public"."patient_admin_info" to "authenticated";

grant trigger on table "public"."patient_admin_info" to "authenticated";

grant truncate on table "public"."patient_admin_info" to "authenticated";

grant update on table "public"."patient_admin_info" to "authenticated";

grant delete on table "public"."patient_admin_info" to "service_role";

grant insert on table "public"."patient_admin_info" to "service_role";

grant references on table "public"."patient_admin_info" to "service_role";

grant select on table "public"."patient_admin_info" to "service_role";

grant trigger on table "public"."patient_admin_info" to "service_role";

grant truncate on table "public"."patient_admin_info" to "service_role";

grant update on table "public"."patient_admin_info" to "service_role";

grant delete on table "public"."patient_clinical_summaries" to "anon";

grant insert on table "public"."patient_clinical_summaries" to "anon";

grant references on table "public"."patient_clinical_summaries" to "anon";

grant select on table "public"."patient_clinical_summaries" to "anon";

grant trigger on table "public"."patient_clinical_summaries" to "anon";

grant truncate on table "public"."patient_clinical_summaries" to "anon";

grant update on table "public"."patient_clinical_summaries" to "anon";

grant delete on table "public"."patient_clinical_summaries" to "authenticated";

grant insert on table "public"."patient_clinical_summaries" to "authenticated";

grant references on table "public"."patient_clinical_summaries" to "authenticated";

grant select on table "public"."patient_clinical_summaries" to "authenticated";

grant trigger on table "public"."patient_clinical_summaries" to "authenticated";

grant truncate on table "public"."patient_clinical_summaries" to "authenticated";

grant update on table "public"."patient_clinical_summaries" to "authenticated";

grant delete on table "public"."patient_clinical_summaries" to "service_role";

grant insert on table "public"."patient_clinical_summaries" to "service_role";

grant references on table "public"."patient_clinical_summaries" to "service_role";

grant select on table "public"."patient_clinical_summaries" to "service_role";

grant trigger on table "public"."patient_clinical_summaries" to "service_role";

grant truncate on table "public"."patient_clinical_summaries" to "service_role";

grant update on table "public"."patient_clinical_summaries" to "service_role";

grant delete on table "public"."patient_financial_info" to "anon";

grant insert on table "public"."patient_financial_info" to "anon";

grant references on table "public"."patient_financial_info" to "anon";

grant select on table "public"."patient_financial_info" to "anon";

grant trigger on table "public"."patient_financial_info" to "anon";

grant truncate on table "public"."patient_financial_info" to "anon";

grant update on table "public"."patient_financial_info" to "anon";

grant delete on table "public"."patient_financial_info" to "authenticated";

grant insert on table "public"."patient_financial_info" to "authenticated";

grant references on table "public"."patient_financial_info" to "authenticated";

grant select on table "public"."patient_financial_info" to "authenticated";

grant trigger on table "public"."patient_financial_info" to "authenticated";

grant truncate on table "public"."patient_financial_info" to "authenticated";

grant update on table "public"."patient_financial_info" to "authenticated";

grant delete on table "public"."patient_financial_info" to "service_role";

grant insert on table "public"."patient_financial_info" to "service_role";

grant references on table "public"."patient_financial_info" to "service_role";

grant select on table "public"."patient_financial_info" to "service_role";

grant trigger on table "public"."patient_financial_info" to "service_role";

grant truncate on table "public"."patient_financial_info" to "service_role";

grant update on table "public"."patient_financial_info" to "service_role";

grant delete on table "public"."patient_support_network" to "anon";

grant insert on table "public"."patient_support_network" to "anon";

grant references on table "public"."patient_support_network" to "anon";

grant select on table "public"."patient_support_network" to "anon";

grant trigger on table "public"."patient_support_network" to "anon";

grant truncate on table "public"."patient_support_network" to "anon";

grant update on table "public"."patient_support_network" to "anon";

grant delete on table "public"."patient_support_network" to "authenticated";

grant insert on table "public"."patient_support_network" to "authenticated";

grant references on table "public"."patient_support_network" to "authenticated";

grant select on table "public"."patient_support_network" to "authenticated";

grant trigger on table "public"."patient_support_network" to "authenticated";

grant truncate on table "public"."patient_support_network" to "authenticated";

grant update on table "public"."patient_support_network" to "authenticated";

grant delete on table "public"."patient_support_network" to "service_role";

grant insert on table "public"."patient_support_network" to "service_role";

grant references on table "public"."patient_support_network" to "service_role";

grant select on table "public"."patient_support_network" to "service_role";

grant trigger on table "public"."patient_support_network" to "service_role";

grant truncate on table "public"."patient_support_network" to "service_role";

grant update on table "public"."patient_support_network" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."presence" to "anon";

grant insert on table "public"."presence" to "anon";

grant references on table "public"."presence" to "anon";

grant select on table "public"."presence" to "anon";

grant trigger on table "public"."presence" to "anon";

grant truncate on table "public"."presence" to "anon";

grant update on table "public"."presence" to "anon";

grant delete on table "public"."presence" to "authenticated";

grant insert on table "public"."presence" to "authenticated";

grant references on table "public"."presence" to "authenticated";

grant select on table "public"."presence" to "authenticated";

grant trigger on table "public"."presence" to "authenticated";

grant truncate on table "public"."presence" to "authenticated";

grant update on table "public"."presence" to "authenticated";

grant delete on table "public"."presence" to "service_role";

grant insert on table "public"."presence" to "service_role";

grant references on table "public"."presence" to "service_role";

grant select on table "public"."presence" to "service_role";

grant trigger on table "public"."presence" to "service_role";

grant truncate on table "public"."presence" to "service_role";

grant update on table "public"."presence" to "service_role";

grant delete on table "public"."user_profiles" to "anon";

grant insert on table "public"."user_profiles" to "anon";

grant references on table "public"."user_profiles" to "anon";

grant select on table "public"."user_profiles" to "anon";

grant trigger on table "public"."user_profiles" to "anon";

grant truncate on table "public"."user_profiles" to "anon";

grant update on table "public"."user_profiles" to "anon";

grant delete on table "public"."user_profiles" to "authenticated";

grant insert on table "public"."user_profiles" to "authenticated";

grant references on table "public"."user_profiles" to "authenticated";

grant select on table "public"."user_profiles" to "authenticated";

grant trigger on table "public"."user_profiles" to "authenticated";

grant truncate on table "public"."user_profiles" to "authenticated";

grant update on table "public"."user_profiles" to "authenticated";

grant delete on table "public"."user_profiles" to "service_role";

grant insert on table "public"."user_profiles" to "service_role";

grant references on table "public"."user_profiles" to "service_role";

grant select on table "public"."user_profiles" to "service_role";

grant trigger on table "public"."user_profiles" to "service_role";

grant truncate on table "public"."user_profiles" to "service_role";

grant update on table "public"."user_profiles" to "service_role";


  create policy "audit_read_admins"
  on "public"."audit_logs"
  as permissive
  for select
  to public
using (((tenant_id = public.current_tenant()) AND (EXISTS ( SELECT 1
   FROM public.user_profiles up
  WHERE ((up.auth_user_id = auth.uid()) AND (up.tenant_id = public.current_tenant()) AND (up.role = ANY (ARRAY['admin'::text, 'coordinator'::text])))))));



  create policy "inv_select_same_tenant"
  on "public"."inventory_items"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "pa_select_same_tenant"
  on "public"."patient_addresses"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "pa_update_same_tenant"
  on "public"."patient_addresses"
  as permissive
  for update
  to public
using ((tenant_id = public.current_tenant()))
with check ((tenant_id = public.current_tenant()));



  create policy "pa_upsert_same_tenant"
  on "public"."patient_addresses"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "pai_insert_same_tenant"
  on "public"."patient_admin_info"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "pai_select_same_tenant"
  on "public"."patient_admin_info"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "pai_update_same_tenant"
  on "public"."patient_admin_info"
  as permissive
  for update
  to public
using ((tenant_id = public.current_tenant()))
with check ((tenant_id = public.current_tenant()));



  create policy "pai_upsert_same_tenant"
  on "public"."patient_admin_info"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "pcs_insert_same_tenant"
  on "public"."patient_clinical_summaries"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "pcs_select_same_tenant"
  on "public"."patient_clinical_summaries"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "pcs_update_same_tenant"
  on "public"."patient_clinical_summaries"
  as permissive
  for update
  to public
using ((tenant_id = public.current_tenant()))
with check ((tenant_id = public.current_tenant()));



  create policy "pcs_upsert_same_tenant"
  on "public"."patient_clinical_summaries"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "financial_insert_same_tenant"
  on "public"."patient_financial_info"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "financial_select_same_tenant"
  on "public"."patient_financial_info"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "financial_update_same_tenant"
  on "public"."patient_financial_info"
  as permissive
  for update
  to public
using ((tenant_id = public.current_tenant()))
with check ((tenant_id = public.current_tenant()));



  create policy "support_insert_same_tenant"
  on "public"."patient_support_network"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "support_select_same_tenant"
  on "public"."patient_support_network"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "support_update_same_tenant"
  on "public"."patient_support_network"
  as permissive
  for update
  to public
using ((tenant_id = public.current_tenant()))
with check ((tenant_id = public.current_tenant()));



  create policy "patients_insert_same_tenant"
  on "public"."patients"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "patients_update_same_tenant"
  on "public"."patients"
  as permissive
  for update
  to public
using ((tenant_id = public.current_tenant()))
with check ((tenant_id = public.current_tenant()));



  create policy "posts_insert_same_tenant"
  on "public"."posts"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "posts_select_same_tenant"
  on "public"."posts"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "presence_select_same_tenant"
  on "public"."presence"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "presence_self_update"
  on "public"."presence"
  as permissive
  for update
  to public
using (((tenant_id = public.current_tenant()) AND (user_id = auth.uid())));



  create policy "presence_self_upsert"
  on "public"."presence"
  as permissive
  for insert
  to public
with check (((tenant_id = public.current_tenant()) AND (user_id = auth.uid())));



  create policy "shifts_insert_same_tenant"
  on "public"."shifts"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "sr_insert_same_tenant"
  on "public"."supply_requests"
  as permissive
  for insert
  to public
with check ((tenant_id = public.current_tenant()));



  create policy "sr_select_same_tenant"
  on "public"."supply_requests"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "up_select_same_tenant"
  on "public"."user_profiles"
  as permissive
  for select
  to public
using (((tenant_id IS NULL) OR (tenant_id = public.current_tenant())));



  create policy "patients_select_same_tenant"
  on "public"."patients"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));



  create policy "shifts_select_same_tenant"
  on "public"."shifts"
  as permissive
  for select
  to public
using ((tenant_id = public.current_tenant()));


CREATE TRIGGER trg_pfi_updated_at BEFORE UPDATE ON public.patient_financial_info FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_psn_updated_at BEFORE UPDATE ON public.patient_support_network FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

drop schema if exists "app_private";


