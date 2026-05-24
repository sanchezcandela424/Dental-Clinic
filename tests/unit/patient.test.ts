import { describe, test, expect } from '@jest/globals';
import { patientSchema } from '../../src/lib/validators/patient';

describe('Patient Schema Validation', () => {
  
  test('should validate a correct patient object with all fields matching UI requirements', () => {
    const validData = {
      fullName: 'Tarik Hadžić',
      email: 'tarik.hadzic@gmail.com',
      phone: '+38761999888',
      jmb: '2405996170012',
      occupation: 'Software Engineer',
      employmentStatus: 'Zaposlen/a',
      address: 'Ferhadija 12, Sarajevo',
      dateOfBirth: '05.04.1996', 
      allergiesFlag: false,
      anesthesiaHistoryFlag: false,
      medicationsFlag: false,
      pastIllnesses: 'Prethodna operacija slijepog crijeva 2018. godine.',
      currentIllness: 'Nema aktivnih hroničnih oboljenja.',
      internalNotes: 'Pacijent preferira popodnevne termine zbog posla.',
    };
    
    const result = patientSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test('should fail when fullName is too short', () => {
    const invalidData = { 
      fullName: 'T', // Too short
      jmb: '2405996170012',
      dateOfBirth: '1996-05-24',
      allergiesFlag: false,
      anesthesiaHistoryFlag: false,
      medicationsFlag: false,
    }; 
    const result = patientSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('should fail when JMB is not exactly 13 digits', () => {
    const invalidData = { 
      fullName: 'Tarik Hadžić', 
      jmb: '2405996', // Too short - JMB must be exactly 13 numeric characters
      dateOfBirth: '1996-05-24',
      allergiesFlag: false,
      anesthesiaHistoryFlag: false,
      medicationsFlag: false 
    };
    const result = patientSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('should fail when email format is invalid', () => {
    const invalidData = {
      fullName: 'Tarik Hadžić',
      email: 'tarik.hadzic.at.gmail.com', // Invalid format missing @
      jmb: '2405996170012',
      dateOfBirth: '1996-05-24',
      allergiesFlag: false,
      anesthesiaHistoryFlag: false,
      medicationsFlag: false
    };
    const result = patientSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('should fail when allergiesFlag is true but allergiesDetails are empty', () => {
    const invalidData = {
      fullName: 'Tarik Hadžić',
      jmb: '2405996170012',
      dateOfBirth: '1996-05-24',
      allergiesFlag: true,
      allergiesDetails: '', // Required because flag is true
      anesthesiaHistoryFlag: false,
      medicationsFlag: false,
    };
    const result = patientSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    
    // Verifies the array includes the exact path pointing to the conditional field
    const hasAllergyIssue = result.error?.issues.some(issue => issue.path.includes('allergiesDetails'));
    expect(hasAllergyIssue).toBe(true);
  });

  
});