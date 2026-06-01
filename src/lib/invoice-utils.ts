export interface InvoiceItem {
  priceSnapshot: number;
  quantity: number;
}

/**
 * Calculates subtotal from invoice items
 * @param items - Array of invoice items with priceSnapshot and quantity
 * @returns Subtotal (sum of priceSnapshot * quantity for all items)
 */
export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.priceSnapshot * item.quantity, 0);
}

/**
 * Calculates tax amount based on subtotal and tax rate
 * @param subtotal - The subtotal amount before tax
 * @param taxRate - The tax rate (e.g., 0.17 for 17%)
 * @returns Tax amount
 */
export function calculateTaxAmount(subtotal: number, taxRate: number): number {
  return subtotal * taxRate;
}

/**
 * Calculates total amount including tax
 * @param subtotal - The subtotal amount before tax
 * @param taxAmount - The tax amount
 * @returns Total amount (subtotal + taxAmount)
 */
export function calculateTotalAmount(subtotal: number, taxAmount: number): number {
  return subtotal + taxAmount;
}

/**
 * Calculates complete tax breakdown
 * @param items - Array of invoice items
 * @param taxRate - The tax rate (default 0.17 for 17% PDV)
 * @returns Object with subtotal, taxAmount, and totalAmount
 */
export function calculateTaxBreakdown(
  items: InvoiceItem[],
  taxRate: number = 0.17
): { subtotal: number; taxAmount: number; totalAmount: number } {
  const subtotal = calculateSubtotal(items);
  const taxAmount = calculateTaxAmount(subtotal, taxRate);
  const totalAmount = calculateTotalAmount(subtotal, taxAmount);
  return { subtotal, taxAmount, totalAmount };
}

/**
 * Generates invoice number in format INV-YYYY-XXX
 * @param lastInvoiceNumber - The last invoice number in the system (optional)
 * @param currentYear - The current year (optional, defaults to current year)
 * @returns Invoice number string
 */
export function generateInvoiceNumber(
  lastInvoiceNumber?: string,
  currentYear?: number
): string {
  const year = currentYear || new Date().getFullYear();
  
  let sequenceNumber = 1;
  
  if (lastInvoiceNumber) {
    const lastSequence = parseInt(lastInvoiceNumber.split("-")[2] || "0");
    if (!isNaN(lastSequence)) {
      sequenceNumber = lastSequence + 1;
    }
  }
  
  // Format: INV-2026-001
  return `INV-${year}-${sequenceNumber.toString().padStart(3, "0")}`;
}

/**
 * Validates invoice number format
 * @param invoiceNumber - The invoice number to validate
 * @returns True if valid, false otherwise
 */
export function isValidInvoiceNumber(invoiceNumber: string): boolean {
  const pattern = /^INV-\d{4}-\d{3}$/;
  return pattern.test(invoiceNumber);
}

/**
 * Extracts year from invoice number
 * @param invoiceNumber - The invoice number
 * @returns The year as a number, or null if invalid
 */
export function extractYearFromInvoiceNumber(invoiceNumber: string): number | null {
  if (!isValidInvoiceNumber(invoiceNumber)) {
    return null;
  }
  const parts = invoiceNumber.split("-");
  const year = parseInt(parts[1] || "");
  return isNaN(year) ? null : year;
}

/**
 * Extracts sequence number from invoice number
 * @param invoiceNumber - The invoice number
 * @returns The sequence number as a number, or null if invalid
 */
export function extractSequenceFromInvoiceNumber(invoiceNumber: string): number | null {
  if (!isValidInvoiceNumber(invoiceNumber)) {
    return null;
  }
  const parts = invoiceNumber.split("-");
  const sequence = parseInt(parts[2] || "");
  return isNaN(sequence) ? null : sequence;
}
