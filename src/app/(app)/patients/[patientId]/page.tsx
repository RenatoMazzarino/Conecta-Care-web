import { notFound } from 'next/navigation';

import { patients as mockPatients, professionals as mockProfessionals } from '@/lib/data';
import { PatientTabs } from '@/components/patients/v2/patient-tabs';
import type { ClientProfessional } from '@/components/patients/v2/types';
import type {
  Patient,
  PatientAuditLog,
  PatientConsent,
  PatientDocument,
  PatientFinancialProfile,
  PaymentTransaction,
} from '@/lib/types';
import { createSupabaseServerClient } from '@/server/supabaseServerClient';
import { savePatientSnapshot } from './actions';

type PatientPageProps = {
  params: { patientId: string };
};

export default async function PatientPage({ params }: PatientPageProps) {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from('patients')
    .select(
      `
      *,
      patient_addresses(*),
      patient_admin_info(*),
      patient_clinical_summaries(*),
      financial_profile:patient_financial_profiles(*),
      transactions:payment_transactions(*),
      emergency_contacts:patient_emergency_contacts(*, notifications:patient_contact_notifications(*)),
      legal_guardians:patient_legal_guardians(*),
      diagnoses:patient_diagnoses(*),
      allergies:patient_allergies(*),
      devices:patient_devices(*),
      patient_support_network(*),
      patient_intelligence(*),
      patient_operational_links(*),
      patient_documents(*),
      patient_consents(*),
      patient_audit_logs(*)
    `
    )
    .eq('id', params.patientId)
    .single();

  const patient = data ? mapPatientFromRow(data) : mockPatients.find((item) => item.id === params.patientId);
  const professionals: ClientProfessional[] = mockProfessionals.map(({ compatibilityTags, ...rest }) => ({
    ...rest,
    compatibilityTags: compatibilityTags?.map(({ text, variant }) => ({ text, variant })),
  }));

  if (!patient) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-2xl flex-col gap-8 px-4 pb-10 pt-8 sm:px-6 lg:px-10">
      <PatientTabs patient={patient} professionals={professionals} onSave={savePatientSnapshot} withHeader />
    </main>
  );
}

const EMPTY_CLINICAL_SUMMARY = {
  diagnosisPrimary: { name: 'Não informado', cid: '' },
  allergies: [],
  criticalMedications: [],
  devicesActive: [],
  oxygenTherapy: { active: false },
  riskScores: {},
  lastReview: { date: '', by: '' },
  alerts: [],
};

function mapPatientFromRow(row: any): Patient {
  const addressRow = Array.isArray(row.patient_addresses) ? row.patient_addresses[0] : row.patient_addresses;
  const adminRow = Array.isArray(row.patient_admin_info) ? row.patient_admin_info[0] : row.patient_admin_info;
  const clinicalRow = Array.isArray(row.patient_clinical_summaries)
    ? row.patient_clinical_summaries[0]
    : row.patient_clinical_summaries;
  const financialProfileRow = Array.isArray(row.financial_profile) ? row.financial_profile[0] : row.financial_profile;
  const transactions = Array.isArray(row.transactions) ? row.transactions : row.transactions ? [row.transactions] : [];
  const emergencyContacts = Array.isArray(row.emergency_contacts) ? row.emergency_contacts : [];
  const legalGuardians = Array.isArray(row.legal_guardians) ? row.legal_guardians : row.legal_guardians ? [row.legal_guardians] : [];
  const diagnoses = Array.isArray(row.diagnoses) ? row.diagnoses : row.diagnoses ? [row.diagnoses] : [];
  const allergies = Array.isArray(row.allergies) ? row.allergies : row.allergies ? [row.allergies] : [];
  const devices = Array.isArray(row.devices) ? row.devices : row.devices ? [row.devices] : [];
  const fullName = row.full_name ?? row.display_name ?? '';
  const { first, last, initials } = splitName(fullName);
  const documents = mapDocuments(row.patient_documents, row.id);
  const consents = mapConsents(row.patient_consents, row.id);
  const auditLogs = mapAuditLogs(row.patient_audit_logs ?? []);
  const emergencyContactsMapped = mapEmergencyContacts(emergencyContacts, row.id);
  const legalGuardiansMapped = mapLegalGuardians(legalGuardians);

  return {
    id: row.id,
    tenantId: row.tenant_id,
    fullName,
    name: fullName,
    displayName: row.display_name ?? fullName,
    firstName: first,
    lastName: last,
    initials: initials || row.initials || 'ND',
    dateOfBirth: row.date_of_birth ?? '',
    cpf: row.cpf ?? '',
    cpfStatus: row.cpf_status ?? 'unknown',
    rg: row.rg ?? undefined,
    rgIssuer: row.rg_issuer ?? undefined,
    rgDigitalUrl: row.rg_digital_url ?? undefined,
    cns: row.cns ?? undefined,
    nationalId: row.national_id ?? undefined,
    documentValidation: row.document_validation ?? undefined,
    identityVerification: row.identity_verification ?? undefined,
    externalIds: row.external_ids ?? undefined,
    sexAtBirth: row.sex_at_birth ?? undefined,
    genderIdentity: row.gender_identity ?? undefined,
    civilStatus: row.civil_status ?? undefined,
    nationality: row.nationality ?? undefined,
    placeOfBirth: row.place_of_birth ?? undefined,
    preferredLanguage: row.preferred_language ?? undefined,
    riskFlags: row.risk_flags ?? [],
    sensitiveDataConsent: row.sensitive_data_consent ?? undefined,
    duplicateCandidates: row.duplicate_candidates ?? [],
    phones: Array.isArray(row.phones) ? row.phones : [],
    emails: Array.isArray(row.emails) ? row.emails : [],
    preferredContactMethod: row.preferred_contact_method ?? undefined,
    communicationOptOut: row.communication_opt_out ?? undefined,
    emergencyContacts: emergencyContactsMapped,
    legalGuardians: legalGuardiansMapped,
    legalGuardian: legalGuardiansMapped?.[0],
    recordStatus: row.record_status ?? undefined,
    address: mapAddress(addressRow),
    domicile: mapDomicile(addressRow),
    clinicalSummary: (clinicalRow as any)?.summary ?? EMPTY_CLINICAL_SUMMARY,
    clinicalSummaryMeta: (clinicalRow as any)?.meta ?? {
      lastUpdatedAt: (clinicalRow as any)?.updated_at ?? '',
      lastUpdatedBy: '',
      source: 'manual',
    },
    adminData: mapAdminInfo(adminRow),
    financialProfile: financialProfileRow ? mapFinancialProfile(financialProfileRow, row.id) : undefined,
    paymentTransactions: mapTransactions(transactions, row.id),
    diagnoses: mapDiagnoses(diagnoses, row.id),
    allergies: mapAllergies(allergies, row.id),
    devices: mapDevices(devices, row.id),
    documents: {},
    documentsCollection: documents,
    consents,
    changeLog: auditLogs,
    accessLog: auditLogs,
    smartFields: row.patient_intelligence
      ? {
          readmissionRiskScore: row.patient_intelligence.readmission_risk_score
            ? {
                value: Number(row.patient_intelligence.readmission_risk_score),
                label: row.patient_intelligence.readmission_risk_label ?? '',
                lastUpdatedAt: row.patient_intelligence.readmission_risk_updated_at ?? undefined,
              }
            : undefined,
          careAdherenceScore: row.patient_intelligence.care_adherence_score
            ? {
                value: Number(row.patient_intelligence.care_adherence_score),
                label: row.patient_intelligence.care_adherence_label ?? '',
                lastUpdatedAt: row.patient_intelligence.care_adherence_updated_at ?? undefined,
              }
            : undefined,
          familySatisfactionScore: row.patient_intelligence.family_satisfaction_score
            ? {
                value: Number(row.patient_intelligence.family_satisfaction_score),
                label: row.patient_intelligence.family_satisfaction_label ?? '',
                lastUpdatedAt: row.patient_intelligence.family_satisfaction_updated_at ?? undefined,
              }
            : undefined,
          incidentsLast30Days: row.patient_intelligence.incidents_last_30_days
            ? {
                count: row.patient_intelligence.incidents_last_30_days,
                lastIncidentAt: row.patient_intelligence.last_incident_at ?? undefined,
              }
            : undefined,
        }
      : undefined,
    operationalLinks: row.patient_operational_links ?? undefined,
    lastViewedAt: row.last_viewed_at ?? undefined,
    accessLogSummary: row.access_log_summary ?? undefined,
    audit: {
      createdAt: row.created_at ?? undefined,
      updatedAt: row.updated_at ?? undefined,
      createdBy: row.created_by ?? undefined,
      updatedBy: row.updated_by ?? undefined,
    },
    consent_status: consents.length ? 'ok' : 'pending',
    pending_documents: Math.max(0, 3 - (documents?.length ?? 0)),
    last_visit_date: row.last_visit_date ?? undefined,
    next_visit_date: row.next_visit_date ?? undefined,
  };
}

function mapDocuments(docs: any[] | null, fallbackPatientId: string): PatientDocument[] {
  if (!docs) return [];
  return docs.map((doc) => ({
    id: doc.id,
    patientId: doc.patient_id ?? fallbackPatientId,
    type: doc.type,
    category: doc.category,
    title: doc.title,
    description: doc.description ?? undefined,
    fileUrl: doc.file_url,
    fileName: doc.file_name ?? undefined,
    mimeType: doc.mime_type ?? undefined,
    fileHash: doc.file_hash ?? undefined,
    uploadedBy: doc.uploaded_by ?? undefined,
    uploadedAt: doc.uploaded_at ?? doc.created_at ?? new Date().toISOString(),
    expiresAt: doc.expires_at ?? undefined,
    source: doc.source,
    verified: Boolean(doc.verified),
    verifiedBy: doc.verified_by ?? undefined,
    verifiedAt: doc.verified_at ?? undefined,
    tags: doc.tags ?? undefined,
    metadata: doc.metadata ?? undefined,
    createdAt: doc.created_at ?? undefined,
  }));
}

function mapConsents(consents: any[] | null, fallbackPatientId: string): PatientConsent[] {
  if (!consents) return [];
  return consents.map((consent) => ({
    id: consent.id,
    patientId: consent.patient_id ?? fallbackPatientId,
    type: consent.type,
    scope: consent.scope ?? [],
    status: consent.status ?? 'Ativo',
    grantedAt: consent.granted_at ?? new Date().toISOString(),
    revokedAt: consent.revoked_at ?? undefined,
    channel: consent.channel ?? 'Upload',
    documentId: consent.document_id ?? undefined,
    grantedBy: consent.granted_by ?? 'Paciente',
    grantedByName: consent.granted_by_name ?? 'Paciente',
    grantedByDocument: consent.granted_by_document ?? undefined,
    relatedLegalResponsibleId: consent.related_legal_responsible_id ?? undefined,
    notes: consent.notes ?? undefined,
    metadata: consent.metadata ?? undefined,
  }));
}

function mapAuditLogs(logs: any[]): PatientAuditLog[] {
  return logs.map((log) => ({
    id: String(log.id),
    patientId: log.patient_id ?? '',
    type: log.type ?? 'view',
    action: log.action ?? '',
    userId: log.user_id ?? undefined,
    userRole: log.user_role ?? undefined,
    eventTime: log.event_time ?? log.created_at ?? undefined,
    timestamp: log.event_time ?? log.created_at ?? undefined,
    origin: log.origin ?? 'web',
    ip: log.ip ?? undefined,
    changedFields: log.changed_fields ?? undefined,
    oldValue: log.old_value ?? undefined,
    newValue: log.new_value ?? undefined,
    meta: log.meta ?? undefined,
  }));
}

function mapFinancialProfile(financial: any, fallbackPatientId: string): PatientFinancialProfile {
  return {
    patientId: financial.patient_id ?? fallbackPatientId,
    bondType: financial.bond_type ?? undefined,
    insurerName: financial.insurer_name ?? undefined,
    planName: financial.plan_name ?? undefined,
    insuranceCardNumber: financial.insurance_card_number ?? undefined,
    insuranceCardValidity: financial.insurance_card_validity ?? undefined,
    monthlyFee: financial.monthly_fee != null ? Number(financial.monthly_fee) : undefined,
    billingDueDay: financial.billing_due_day ?? undefined,
    paymentMethod: financial.payment_method ?? undefined,
    financialResponsibleName: financial.financial_responsible_name ?? undefined,
    financialResponsibleContact: financial.financial_responsible_contact ?? undefined,
    billingStatus: financial.billing_status ?? undefined,
    notes: financial.notes ?? undefined,
    createdAt: financial.created_at ?? undefined,
    updatedAt: financial.updated_at ?? undefined,
  };
}

function mapTransactions(transactions: any[], fallbackPatientId: string): PaymentTransaction[] {
  return transactions.map((tx) => ({
    id: tx.id,
    patientId: tx.patient_id ?? fallbackPatientId,
    provider: tx.provider ?? 'N/D',
    providerTxId: tx.provider_tx_id ?? undefined,
    amount: tx.amount != null ? Number(tx.amount) : 0,
    currency: tx.currency ?? 'BRL',
    status: tx.status ?? 'pending',
    method: tx.method ?? undefined,
    dueDate: tx.due_date ?? undefined,
    paidAt: tx.paid_at ?? undefined,
    metadata: tx.metadata ?? undefined,
    createdAt: tx.created_at ?? new Date().toISOString(),
  }));
}

function mapEmergencyContacts(contacts: any[], fallbackPatientId: string): Patient['emergencyContacts'] {
  return contacts.map((contact) => ({
    id: contact.id,
    patientId: contact.patient_id ?? fallbackPatientId,
    name: contact.name,
    relationship: contact.relationship ?? undefined,
    phone: contact.phone ?? undefined,
    email: contact.email ?? undefined,
    isLegalRepresentative: contact.is_legal_representative ?? false,
    canView: contact.can_view ?? undefined,
    canAuthorize: contact.can_authorize ?? undefined,
    canClinical: contact.can_clinical ?? undefined,
    canFinancial: contact.can_financial ?? undefined,
    permissions: {
      view: contact.can_view ?? undefined,
      authorize: contact.can_authorize ?? undefined,
      clinical: contact.can_clinical ?? undefined,
      financial: contact.can_financial ?? undefined,
    },
    notifications: Array.isArray(contact.notifications)
      ? contact.notifications.map((n: any) => ({
          id: n.id,
          contactId: n.contact_id ?? contact.id,
          channel: n.channel,
          enabled: n.enabled ?? true,
          createdAt: n.created_at ?? undefined,
          updatedAt: n.updated_at ?? undefined,
        }))
      : [],
    createdAt: contact.created_at ?? undefined,
    updatedAt: contact.updated_at ?? undefined,
  }));
}

function mapLegalGuardians(guardians: any[]): Patient['legalGuardians'] {
  return guardians.map((guardian) => ({
    id: guardian.id,
    patientId: guardian.patient_id ?? '',
    name: guardian.name,
    documentType: guardian.document_type ?? undefined,
    documentNumber: guardian.document_number ?? undefined,
    contact: guardian.contact ?? undefined,
    notes: guardian.notes ?? undefined,
    validUntil: guardian.valid_until ?? undefined,
    document: guardian.document_number ?? undefined,
    validityDate: guardian.valid_until ?? undefined,
    createdAt: guardian.created_at ?? undefined,
    updatedAt: guardian.updated_at ?? undefined,
  }));
}

function mapDiagnoses(diagnoses: any[], fallbackPatientId: string): Patient['diagnoses'] {
  return diagnoses.map((diag) => ({
    id: diag.id,
    patientId: diag.patient_id ?? fallbackPatientId,
    code: diag.code ?? undefined,
    system: diag.system ?? undefined,
    description: diag.description ?? '',
    isPrimary: diag.is_primary ?? undefined,
    diagnosedAt: diag.diagnosed_at ?? undefined,
    resolvedAt: diag.resolved_at ?? undefined,
    status: diag.status ?? undefined,
    createdAt: diag.created_at ?? undefined,
    updatedAt: diag.updated_at ?? undefined,
  }));
}

function mapAllergies(allergies: any[], fallbackPatientId: string): Patient['allergies'] {
  return allergies.map((allergy) => ({
    id: allergy.id,
    patientId: allergy.patient_id ?? fallbackPatientId,
    substance: allergy.substance ?? '',
    reaction: allergy.reaction ?? undefined,
    severity: allergy.severity ?? undefined,
    recordedAt: allergy.recorded_at ?? undefined,
    status: allergy.status ?? undefined,
    createdAt: allergy.created_at ?? undefined,
    updatedAt: allergy.updated_at ?? undefined,
  }));
}

function mapDevices(devices: any[], fallbackPatientId: string): Patient['devices'] {
  return devices.map((device) => ({
    id: device.id,
    patientId: device.patient_id ?? fallbackPatientId,
    deviceType: device.device_type ?? '',
    description: device.description ?? undefined,
    status: device.status ?? undefined,
    placedAt: device.placed_at ?? undefined,
    removedAt: device.removed_at ?? undefined,
    notes: device.notes ?? undefined,
    createdAt: device.created_at ?? undefined,
    updatedAt: device.updated_at ?? undefined,
  }));
}

function mapAddress(address?: any) {
  return {
    street: address?.address_line ?? '',
    number: address?.number ?? '',
    complement: address?.complement ?? '',
    neighborhood: address?.neighborhood ?? '',
    city: address?.city ?? '',
    state: address?.state ?? '',
    zipCode: address?.cep ?? '',
    pontoReferencia: address?.reference_point ?? undefined,
    geolocation:
      address?.geo_lat && address?.geo_lng
        ? { lat: Number(address.geo_lat), lng: Number(address.geo_lng) }
        : undefined,
    zoneType: address?.zone_type ?? undefined,
    gateIdentification: address?.gatehouse_name ?? undefined,
    allowedVisitHours: address?.visit_hours ?? undefined,
    facadeImageUrl: address?.facade_photo_url ?? undefined,
    etaMinutes: address?.avg_eta_min ?? undefined,
    travelNotes: address?.works_or_obstacles ?? undefined,
  };
}

function mapDomicile(address?: any) {
  if (!address) return undefined;
  return {
    tipoResidencia: address.residence_type ?? undefined,
    floor: address.floor ?? undefined,
    internalAccess: address.internal_access ?? undefined,
    accessibilityFeatures: address.accessibility ?? undefined,
    patientRoom: address.stay_location ?? undefined,
    electricalInfrastructure: address.electric_infra ?? undefined,
    waterSource: address.water_source ?? undefined,
    hasWifi: address.has_wifi ?? undefined,
    backupPowerSource: address.backup_power ?? undefined,
    hasAdaptedBathroom: address.adapted_bathroom ?? undefined,
    ambulanceAccess: address.ambulance_access ?? undefined,
    teamParking: address.parking ?? undefined,
    entryProcedure: address.entry_procedure ?? undefined,
    nightAccessRisk: address.night_access_risk ?? undefined,
    currentObstacles: address.works_or_obstacles ?? undefined,
    pets: address.pets ?? undefined,
    otherResidents: address.residents ?? undefined,
    caregivers: address.caregivers ?? undefined,
    hygieneConditions: address.hygiene_rating ?? undefined,
    environmentalRisks: address.environmental_risk ?? undefined,
    hasSmokers: address.has_smokers ?? undefined,
    ventilation: address.ventilation ?? undefined,
    noiseLevel: address.noise_level ?? undefined,
    generalObservations: address.notes ?? undefined,
    careTeamEtaMinutes: address.avg_eta_min ?? undefined,
    gateIdentification: address.gatehouse_name ?? undefined,
    etaSource: address.visit_hours ?? undefined,
  };
}

function mapAdminInfo(admin?: any): Patient['adminData'] {
  return {
    status: admin?.status ?? 'Ativo',
    admissionType: admin?.admission_type ?? undefined,
    complexity: admin?.complexity ?? 'Média',
    servicePackage: admin?.service_package ?? 'Intermediário',
    startDate: admin?.start_date ?? '',
    endDate: admin?.end_date ?? undefined,
    supervisorId: admin?.supervisor_id ?? undefined,
    escalistaId: admin?.escalista_id ?? undefined,
    nurseResponsibleId: admin?.nurse_responsible_id ?? undefined,
    frequency: admin?.frequency ?? undefined,
    operationArea: admin?.operation_area ?? undefined,
    admissionSource: admin?.admission_source ?? undefined,
    contractId: admin?.contract_id ?? undefined,
    lastAuditDate: admin?.last_audit_date ?? undefined,
    lastAuditBy: admin?.last_audit_by ?? undefined,
    notesInternal: admin?.notes_internal ?? undefined,
  };
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] ?? '';
  const last = parts.slice(1).join(' ');
  const initials = parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  return { first, last, initials };
}
