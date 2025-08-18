/**
 * Generates a unique invoice ID using timestamp and random string
 * Format: INV-{timestamp}-{random}
 */
export const generateInvoiceId = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `INV-${timestamp}-${random}`;
};

/**
 * Validates if an invoice ID has the correct format
 */
export const validateInvoiceId = (id: string): boolean => {
    const pattern = /^INV-\d{13}-[A-Z0-9]{6}$/;
    return pattern.test(id);
};
