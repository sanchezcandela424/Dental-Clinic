import { describe, test, expect } from '@jest/globals';
import {
  calculateSubtotal,
  calculateTaxAmount,
  calculateTotalAmount,
  calculateTaxBreakdown,
  generateInvoiceNumber,
  isValidInvoiceNumber,
  extractYearFromInvoiceNumber,
  extractSequenceFromInvoiceNumber,
} from '../../src/lib/invoice-utils';

describe('Invoice Utilities (Unit Tests)', () => {
  
  describe('calculateSubtotal', () => {
    test('should calculate subtotal correctly for single item', () => {
      const items = [{ priceSnapshot: 100, quantity: 1 }];
      const result = calculateSubtotal(items);
      expect(result).toBe(100);
    });

    test('should calculate subtotal correctly for multiple items', () => {
      const items = [
        { priceSnapshot: 50, quantity: 2 },
        { priceSnapshot: 30, quantity: 1 },
        { priceSnapshot: 20, quantity: 3 },
      ];
      const result = calculateSubtotal(items);
      expect(result).toBe(190);
    });

    test('should return 0 for empty items array', () => {
      const items: any[] = [];
      const result = calculateSubtotal(items);
      expect(result).toBe(0);
    });

    test('should handle decimal prices correctly', () => {
      const items = [
        { priceSnapshot: 99.99, quantity: 2 },
        { priceSnapshot: 50.50, quantity: 1 },
      ];
      const result = calculateSubtotal(items);
      expect(result).toBeCloseTo(250.48); // 199.98 + 50.50
    });

    test('should handle zero quantity', () => {
      const items = [{ priceSnapshot: 100, quantity: 0 }];
      const result = calculateSubtotal(items);
      expect(result).toBe(0);
    });

    test('should handle zero price', () => {
      const items = [{ priceSnapshot: 0, quantity: 5 }];
      const result = calculateSubtotal(items);
      expect(result).toBe(0);
    });
  });

  describe('calculateTaxAmount', () => {
    test('should calculate 17% tax correctly', () => {
      const result = calculateTaxAmount(100, 0.17);
      expect(result).toBe(17);
    });

    test('should calculate tax with different rate', () => {
      const result = calculateTaxAmount(100, 0.20);
      expect(result).toBe(20);
    });

    test('should return 0 for zero subtotal', () => {
      const result = calculateTaxAmount(0, 0.17);
      expect(result).toBe(0);
    });

    test('should return 0 for zero tax rate', () => {
      const result = calculateTaxAmount(100, 0);
      expect(result).toBe(0);
    });

    test('should handle decimal subtotal correctly', () => {
      const result = calculateTaxAmount(99.99, 0.17);
      expect(result).toBeCloseTo(16.9983);
    });

    test('should handle negative tax rate (edge case)', () => {
      const result = calculateTaxAmount(100, -0.17);
      expect(result).toBe(-17);
    });
  });

  describe('calculateTotalAmount', () => {
    test('should calculate total correctly', () => {
      const result = calculateTotalAmount(100, 17);
      expect(result).toBe(117);
    });

    test('should return 0 for zero subtotal and tax', () => {
      const result = calculateTotalAmount(0, 0);
      expect(result).toBe(0);
    });

    test('should handle decimal values correctly', () => {
      const result = calculateTotalAmount(99.99, 16.9983);
      expect(result).toBeCloseTo(116.9883);
    });
  });

  describe('calculateTaxBreakdown', () => {
    test('should calculate complete tax breakdown with default rate', () => {
      const items = [{ priceSnapshot: 100, quantity: 1 }];
      const result = calculateTaxBreakdown(items);
      expect(result.subtotal).toBe(100);
      expect(result.taxAmount).toBe(17);
      expect(result.totalAmount).toBe(117);
    });

    test('should calculate tax breakdown with custom tax rate', () => {
      const items = [{ priceSnapshot: 100, quantity: 1 }];
      const result = calculateTaxBreakdown(items, 0.20);
      expect(result.subtotal).toBe(100);
      expect(result.taxAmount).toBe(20);
      expect(result.totalAmount).toBe(120);
    });

    test('should handle multiple items correctly', () => {
      const items = [
        { priceSnapshot: 50, quantity: 2 },
        { priceSnapshot: 30, quantity: 1 },
      ];
      const result = calculateTaxBreakdown(items);
      expect(result.subtotal).toBe(130);
      expect(result.taxAmount).toBe(22.1);
      expect(result.totalAmount).toBe(152.1);
    });

    test('should return zeros for empty items array', () => {
      const items: any[] = [];
      const result = calculateTaxBreakdown(items);
      expect(result.subtotal).toBe(0);
      expect(result.taxAmount).toBe(0);
      expect(result.totalAmount).toBe(0);
    });

    test('should handle zero tax rate', () => {
      const items = [{ priceSnapshot: 100, quantity: 1 }];
      const result = calculateTaxBreakdown(items, 0);
      expect(result.subtotal).toBe(100);
      expect(result.taxAmount).toBe(0);
      expect(result.totalAmount).toBe(100);
    });
  });

  describe('generateInvoiceNumber', () => {
    test('should generate invoice number for first invoice of year', () => {
      const result = generateInvoiceNumber();
      const currentYear = new Date().getFullYear();
      expect(result).toBe(`INV-${currentYear}-001`);
    });

    test('should generate invoice number with custom year', () => {
      const result = generateInvoiceNumber(undefined, 2025);
      expect(result).toBe('INV-2025-001');
    });

    test('should increment sequence number based on last invoice', () => {
      const result = generateInvoiceNumber('INV-2026-005');
      expect(result).toBe('INV-2026-006');
    });

    test('should handle sequence number rollover to next digit', () => {
      const result = generateInvoiceNumber('INV-2026-009');
      expect(result).toBe('INV-2026-010');
    });

    test('should handle sequence number rollover to three digits', () => {
      const result = generateInvoiceNumber('INV-2026-099');
      expect(result).toBe('INV-2026-100');
    });

    test('should handle sequence number rollover to four digits', () => {
      const result = generateInvoiceNumber('INV-2026-999');
      expect(result).toBe('INV-2026-1000');
    });

    test('should handle invalid last invoice number gracefully', () => {
      const result = generateInvoiceNumber('INVALID');
      expect(result).toBe('INV-2026-001'); // Falls back to default
    });

    test('should handle missing last invoice number', () => {
      const result = generateInvoiceNumber(undefined);
      const currentYear = new Date().getFullYear();
      expect(result).toBe(`INV-${currentYear}-001`);
    });
  });

  describe('isValidInvoiceNumber', () => {
    test('should return true for valid invoice number', () => {
      const result = isValidInvoiceNumber('INV-2026-001');
      expect(result).toBe(true);
    });

    test('should return true for invoice number with three-digit sequence', () => {
      const result = isValidInvoiceNumber('INV-2026-123');
      expect(result).toBe(true);
    });

    test('should return false for invalid format - missing prefix', () => {
      const result = isValidInvoiceNumber('2026-001');
      expect(result).toBe(false);
    });

    test('should return false for invalid format - missing year', () => {
      const result = isValidInvoiceNumber('INV--001');
      expect(result).toBe(false);
    });

    test('should return false for invalid format - missing sequence', () => {
      const result = isValidInvoiceNumber('INV-2026-');
      expect(result).toBe(false);
    });

    test('should return false for invalid format - wrong separator', () => {
      const result = isValidInvoiceNumber('INV_2026_001');
      expect(result).toBe(false);
    });

    test('should return false for invalid format - two-digit year', () => {
      const result = isValidInvoiceNumber('INV-26-001');
      expect(result).toBe(false);
    });

    test('should return false for invalid format - two-digit sequence', () => {
      const result = isValidInvoiceNumber('INV-2026-01');
      expect(result).toBe(false);
    });

    test('should return false for invalid format - four-digit sequence', () => {
      const result = isValidInvoiceNumber('INV-2026-0001');
      expect(result).toBe(false);
    });

    test('should return false for empty string', () => {
      const result = isValidInvoiceNumber('');
      expect(result).toBe(false);
    });

    test('should return false for non-numeric sequence', () => {
      const result = isValidInvoiceNumber('INV-2026-ABC');
      expect(result).toBe(false);
    });
  });

  describe('extractYearFromInvoiceNumber', () => {
    test('should extract year correctly from valid invoice number', () => {
      const result = extractYearFromInvoiceNumber('INV-2026-001');
      expect(result).toBe(2026);
    });

    test('should return null for invalid invoice number format', () => {
      const result = extractYearFromInvoiceNumber('INVALID');
      expect(result).toBeNull();
    });

    test('should return null for empty string', () => {
      const result = extractYearFromInvoiceNumber('');
      expect(result).toBeNull();
    });

    test('should return null for invoice number with non-numeric year', () => {
      const result = extractYearFromInvoiceNumber('INV-ABCD-001');
      expect(result).toBeNull();
    });

    test('should handle different years correctly', () => {
      expect(extractYearFromInvoiceNumber('INV-2024-001')).toBe(2024);
      expect(extractYearFromInvoiceNumber('INV-2025-001')).toBe(2025);
      expect(extractYearFromInvoiceNumber('INV-2030-001')).toBe(2030);
    });
  });

  describe('extractSequenceFromInvoiceNumber', () => {
    test('should extract sequence correctly from valid invoice number', () => {
      const result = extractSequenceFromInvoiceNumber('INV-2026-001');
      expect(result).toBe(1);
    });

    test('should extract sequence with leading zeros correctly', () => {
      const result = extractSequenceFromInvoiceNumber('INV-2026-005');
      expect(result).toBe(5);
    });

    test('should extract three-digit sequence correctly', () => {
      const result = extractSequenceFromInvoiceNumber('INV-2026-123');
      expect(result).toBe(123);
    });

    test('should return null for invalid invoice number format', () => {
      const result = extractSequenceFromInvoiceNumber('INVALID');
      expect(result).toBeNull();
    });

    test('should return null for empty string', () => {
      const result = extractSequenceFromInvoiceNumber('');
      expect(result).toBeNull();
    });

    test('should return null for invoice number with non-numeric sequence', () => {
      const result = extractSequenceFromInvoiceNumber('INV-2026-ABC');
      expect(result).toBeNull();
    });

    test('should handle different sequence numbers correctly', () => {
      expect(extractSequenceFromInvoiceNumber('INV-2026-010')).toBe(10);
      expect(extractSequenceFromInvoiceNumber('INV-2026-100')).toBe(100);
      expect(extractSequenceFromInvoiceNumber('INV-2026-999')).toBe(999);
    });
  });
});
