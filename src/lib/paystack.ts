/**
 * Paystack Payment Integration Module
 * Handles Paystack SDK initialization and payment processing
 */

import type { PaystackPopConfig } from "../types/paystack";

let paystackScriptLoaded = false;

/**
 * Load Paystack SDK script dynamically
 * Only loads once to avoid duplicate script tags
 */
export async function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.PaystackPop) {
      paystackScriptLoaded = true;
      resolve();
      return;
    }

    // Check if script is already in the DOM (loading)
    if (paystackScriptLoaded) {
      // Wait for script to load
      const checkInterval = setInterval(() => {
        if (window.PaystackPop) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("Paystack SDK failed to load"));
      }, 10000);
      return;
    }

    paystackScriptLoaded = true;

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;

    script.onload = () => {
      if (window.PaystackPop) {
        resolve();
      } else {
        reject(new Error("Paystack SDK not available after script load"));
      }
    };

    script.onerror = () => {
      paystackScriptLoaded = false;
      reject(new Error("Failed to load Paystack SDK"));
    };

    document.head.appendChild(script);
  });
}

/**
 * Initialize and open Paystack payment modal
 * @param config - Paystack configuration object
 * @returns Promise that resolves with transaction reference on success
 */
export function initiatePayment(config: PaystackPopConfig): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (!window.PaystackPop) {
        reject(new Error("Paystack SDK not loaded"));
        return;
      }

      // Store reference in config for onSuccess callback
      const reference = config.ref || `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      config.ref = reference;

      // Set callbacks
      const originalOnSuccess = config.onSuccess;
      const originalOnClose = config.onClose;

      config.onSuccess = (response: any) => {
        // Call original onSuccess if provided
        if (originalOnSuccess) {
          originalOnSuccess(response);
        }
        resolve(response.reference);
      };

      config.onClose = () => {
        // Call original onClose if provided
        if (originalOnClose) {
          originalOnClose();
        }
        // User closed payment modal without completing payment
        reject(new Error("Payment cancelled by user"));
      };

      // Setup and open Paystack modal
      const handler = window.PaystackPop.setup(config);
      handler.openIframe();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Get Paystack public key from environment
 * Falls back to test key if not configured
 */
export function getPaystackPublicKey(): string {
  return (
    import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
    "pk_test_51234567890abcdefghijklmnopqrstuvwxyz"
  );
}

/**
 * Format amount in kobo (Paystack expects amounts in the smallest currency unit)
 * @param amountInNaira - Amount in Nigerian Naira
 * @returns Amount in kobo (multiply by 100)
 */
export function formatAmountInKobo(amountInNaira: number): number {
  return Math.round(amountInNaira * 100);
}

/**
 * Format amount from kobo back to Naira
 * @param kobo - Amount in kobo
 * @returns Amount in Nigerian Naira
 */
export function formatAmountInNaira(kobo: number): number {
  return kobo / 100;
}
