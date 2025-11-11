import QRCode from 'qrcode';

export interface QRPaymentData {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  orderId: string;
  description?: string;
}

/**
 * Generate VietQR payment URL
 * VietQR is a Vietnamese standard for QR code payments
 */
export function generateVietQRUrl(data: QRPaymentData): string {
  const {
    bankCode,
    accountNumber,
    accountName,
    amount,
    orderId,
    description = '',
  } = data;

  const note = description || `Order ${orderId}`;
  const encodedNote = encodeURIComponent(note);
  const encodedName = encodeURIComponent(accountName);

  // VietQR format: https://img.vietqr.io/image/{BANK_CODE}-{ACCOUNT_NUMBER}-compact2.png?amount={AMOUNT}&addInfo={NOTE}&accountName={ACCOUNT_NAME}
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodedNote}&accountName=${encodedName}`;
}

/**
 * Generate QR code as data URL (for local generation if needed)
 */
export async function generateQRCodeDataUrl(
  text: string,
  options?: QRCode.QRCodeToDataURLOptions
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 2,
      ...options,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

/**
 * Generate a payment string (for advanced usage with custom QR generation)
 * Format: Bank-Account-compact2?params
 */
export function generatePaymentString(data: QRPaymentData): string {
  const { bankCode, accountNumber, amount, orderId } = data;
  return `${bankCode}|${accountNumber}|${amount}|Order ${orderId}`;
}

/**
 * Create a complete payment object for checkout
 */
export function createPaymentQRData(
  amount: number,
  orderId: string,
  bankCode: string = 'VCB',
  accountNumber: string = '0123456789',
  accountName: string = 'DigiShop'
): QRPaymentData {
  return {
    bankCode,
    accountNumber,
    accountName,
    amount: Math.round(amount), // Ensure amount is integer
    orderId,
    description: `Order ${orderId}`,
  };
}
