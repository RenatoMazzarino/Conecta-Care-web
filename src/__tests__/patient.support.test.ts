import { describe, it, expect, vi } from 'vitest';
import { PatientSupportProfileZ, SupportMemberZ, SupportResponsibleZ, SupportEmergencyZ } from '../schemas/patient.support';

describe('PatientSupportProfileZ', () => {
  it('parses a minimal valid payload', () => {
    const payload = {
      patient_id: '00000000-0000-0000-0000-000000000000',
      tenant_id: '00000000-0000-0000-0000-000000000001',
    };

    const parsed = PatientSupportProfileZ.parse(payload);
    expect(parsed).toBeDefined();
    expect(parsed.patient_id).toBe(payload.patient_id);
    expect(parsed.tenant_id).toBe(payload.tenant_id);
  });

  it('parses a complete profile with legal responsible and emergency contact', () => {
    const payload = {
      patient_id: '00000000-0000-0000-0000-000000000000',
      tenant_id: '00000000-0000-0000-0000-000000000001',
      legal_responsible: {
        name: 'John Doe',
        relation: 'Father',
        phone: '123456789',
        email: 'john@example.com',
        is_legal_guardian: true,
        permissions: {
          view: true,
          authorize: true,
          medical_decisions: true,
        },
      },
      emergency_contact: {
        name: 'Jane Doe',
        relation: 'Mother',
        phone: '987654321',
        email: 'jane@example.com',
        is_primary: true,
      },
      support_notes: 'Test notes',
    };

    const parsed = PatientSupportProfileZ.parse(payload);
    expect(parsed).toBeDefined();
    expect(parsed.legal_responsible?.name).toBe('John Doe');
    expect(parsed.emergency_contact?.name).toBe('Jane Doe');
    expect(parsed.support_notes).toBe('Test notes');
  });

  it('rejects invalid patient_id', () => {
    const payload = {
      patient_id: 'invalid-uuid',
      tenant_id: '00000000-0000-0000-0000-000000000001',
    };

    expect(() => PatientSupportProfileZ.parse(payload)).toThrow();
  });
});

describe('SupportMemberZ', () => {
  it('parses a minimal valid member', () => {
    const payload = {
      profile_id: '00000000-0000-0000-0000-000000000000',
      tenant_id: '00000000-0000-0000-0000-000000000001',
      name: 'Support Member',
    };

    const parsed = SupportMemberZ.parse(payload);
    expect(parsed).toBeDefined();
    expect(parsed.name).toBe('Support Member');
    expect(parsed.permissions).toEqual([]);
    expect(parsed.is_active).toBe(true);
  });

  it('parses a complete member with permissions and notifications', () => {
    const payload = {
      profile_id: '00000000-0000-0000-0000-000000000000',
      tenant_id: '00000000-0000-0000-0000-000000000001',
      name: 'Jane Smith',
      relation: 'Sister',
      phone: '123456789',
      email: 'jane.smith@example.com',
      permissions: ['view', 'receive_updates'],
      notifications_prefs: {
        email: true,
        sms: false,
        whatsapp: true,
        push: false,
      },
      notes: 'Prefers WhatsApp',
      is_active: true,
    };

    const parsed = SupportMemberZ.parse(payload);
    expect(parsed).toBeDefined();
    expect(parsed.name).toBe('Jane Smith');
    expect(parsed.relation).toBe('Sister');
    expect(parsed.permissions).toContain('view');
    expect(parsed.notifications_prefs?.whatsapp).toBe(true);
  });

  it('rejects invalid permission values', () => {
    const payload = {
      profile_id: '00000000-0000-0000-0000-000000000000',
      tenant_id: '00000000-0000-0000-0000-000000000001',
      name: 'Test Member',
      permissions: ['invalid_permission'],
    };

    expect(() => SupportMemberZ.parse(payload)).toThrow();
  });

  it('rejects name shorter than 2 characters', () => {
    const payload = {
      profile_id: '00000000-0000-0000-0000-000000000000',
      tenant_id: '00000000-0000-0000-0000-000000000001',
      name: 'A',
    };

    expect(() => SupportMemberZ.parse(payload)).toThrow();
  });
});

describe('SupportResponsibleZ', () => {
  it('parses a valid responsible person', () => {
    const payload = {
      name: 'Legal Guardian',
      relation: 'Parent',
      phone: '123456789',
      email: 'guardian@example.com',
      is_legal_guardian: true,
      permissions: {
        view: true,
        authorize: true,
        medical_decisions: true,
      },
    };

    const parsed = SupportResponsibleZ.parse(payload);
    expect(parsed).toBeDefined();
    expect(parsed?.name).toBe('Legal Guardian');
    expect(parsed?.is_legal_guardian).toBe(true);
  });

  it('accepts undefined (optional field)', () => {
    const parsed = SupportResponsibleZ.parse(undefined);
    expect(parsed).toBeUndefined();
  });
});

describe('SupportEmergencyZ', () => {
  it('parses a valid emergency contact', () => {
    const payload = {
      name: 'Emergency Person',
      relation: 'Spouse',
      phone: '987654321',
      email: 'emergency@example.com',
      is_primary: true,
    };

    const parsed = SupportEmergencyZ.parse(payload);
    expect(parsed).toBeDefined();
    expect(parsed?.name).toBe('Emergency Person');
    expect(parsed?.phone).toBe('987654321');
  });

  it('requires phone with at least 8 characters', () => {
    const payload = {
      name: 'Emergency Person',
      phone: '123', // Too short
    };

    expect(() => SupportEmergencyZ.parse(payload)).toThrow();
  });

  it('accepts undefined (optional field)', () => {
    const parsed = SupportEmergencyZ.parse(undefined);
    expect(parsed).toBeUndefined();
  });
});
