import { describe, it, expect } from 'vitest';
import { PatientFinancialZ } from '../schemas/patient.financial';

describe('PatientFinancialZ', () => {
  it('parses a minimal valid payload', () => {
    const payload = {
      patient_id: '00000000-0000-0000-0000-000000000000',
      tenant_id: '00000000-0000-0000-0000-000000000000',
      monthly_fee: 1200,
    };

    const parsed = PatientFinancialZ.parse(payload);
    expect(parsed).toBeDefined();
    expect(parsed.patient_id).toBe(payload.patient_id);
  });
});
