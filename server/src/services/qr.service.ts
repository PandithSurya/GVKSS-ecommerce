import QRCode from 'qrcode';
import { logger } from '../config/logger.js';

export interface UpiPaymentDetails {
  upiId: string;
  merchantName: string;
  amount: number;
  orderNumber: string;
  note?: string;
}

export class QrService {
  /**
   * Generates a standard NPCI-compliant UPI deep link
   */
  static generateUpiLink({ upiId, merchantName, amount, orderNumber, note }: UpiPaymentDetails): string {
    const transactionNote = note || `Order ${orderNumber}`;
    const formattedAmount = amount.toFixed(2);
    
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(merchantName)}&am=${formattedAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  }

  /**
   * Generates a QR Code data URL (PNG) for instant rendering in the checkout modal
   */
  static async generateUpiQrDataUrl(details: UpiPaymentDetails): Promise<string> {
    try {
      const upiUrl = this.generateUpiLink(details);
      const dataUrl = await QRCode.toDataURL(upiUrl, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 320,
        color: {
          dark: '#064e3b', // Deep emerald brand tone
          light: '#ffffff',
        },
      });
      return dataUrl;
    } catch (error) {
      logger.error('Failed to generate UPI QR Code:', error);
      throw error;
    }
  }
}
