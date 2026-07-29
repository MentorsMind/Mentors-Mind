/**
 * Paystack JavaScript SDK Type Definitions
 * Reference: https://paystack.com/docs/payments/payment-pages
 */

export interface PaystackChargeResponse {
  status: boolean;
  message: string;
  data?: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  };
}

export interface PaystackPopConfig {
  key: string;
  email: string;
  amount: number; // Amount in kobo (e.g., 5000 for ₦50.00)
  ref?: string;
  currency?: string;
  channels?: string[];
  firstname?: string;
  lastname?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
  onClose?: () => void;
  onSuccess?: (response: PaystackSuccessResponse) => void;
}

export interface PaystackSuccessResponse {
  reference: string;
  status: string;
}

declare global {
  interface Window {
    PaystackPop: {
      setup(config: PaystackPopConfig): {
        openIframe(): void;
      };
      resumeTransaction(ref: string): void;
    };
  }
}
