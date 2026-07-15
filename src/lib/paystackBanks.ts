export interface Bank {
  id: number;
  name: string;
  code: string;
  slug?: string;
  longcode?: string;
  gateway?: string;
  pay_with_bank?: boolean;
  active?: boolean;
  is_deleted?: boolean;
  country?: string;
  currency?: string;
  type?: string;
}

export interface ResolveAccountResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export const paystackApi = {
  async getNigerianBanks(): Promise<Bank[]> {
    const secretKey = import.meta.env.VITE_PAYSTACK_SECRET_KEY;
    
    if (!secretKey) {
      console.warn('VITE_PAYSTACK_SECRET_KEY not set. Using demo banks.');
      // Return demo banks if API key isn't available
      return [
        { id: 1, name: 'Guaranty Trust Bank (GTBank)', code: '058' },
        { id: 2, name: 'Access Bank', code: '044' },
        { id: 3, name: 'First Bank of Nigeria', code: '011' },
        { id: 4, name: 'Zenith Bank', code: '057' },
        { id: 5, name: 'United Bank for Africa (UBA)', code: '033' },
      ];
    }

    try {
      const response = await fetch(`${PAYSTACK_BASE_URL}/bank?country=nigeria`, {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch banks: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching banks:', error);
      // Fallback to demo banks
      return [
        { id: 1, name: 'Guaranty Trust Bank (GTBank)', code: '058' },
        { id: 2, name: 'Access Bank', code: '044' },
        { id: 3, name: 'First Bank of Nigeria', code: '011' },
        { id: 4, name: 'Zenith Bank', code: '057' },
        { id: 5, name: 'United Bank for Africa (UBA)', code: '033' },
      ];
    }
  },

  async resolveAccount(bankCode: string, accountNumber: string): Promise<ResolveAccountResponse> {
    const secretKey = import.meta.env.VITE_PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      console.warn('VITE_PAYSTACK_SECRET_KEY not set. Cannot resolve account.');
      throw new Error('Paystack API key not configured');
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to resolve account');
    }

    return response.json();
  }
};
