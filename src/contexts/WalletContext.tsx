import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface Transaction {
  id: string;
  reference: string;
  learnerId: string;
  learnerName: string;
  learnerImage: string;
  mentorId: string;
  bookingId?: string;
  totalAmount: number;
  platformFee: number;
  mentorEarnings: number;
  status: 'pending' | 'successful' | 'failed' | 'refunded';
  date: string;
  metadata?: Record<string, unknown>;
}

export interface Payout {
  id: string;
  mentorId: string;
  amount: number;
  fee: number;
  netAmount: number;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  adminNotes?: string;
}

export interface WalletData {
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingPayouts: number;
  currency: string;
}

interface WalletContextType {
  wallet: WalletData;
  transactions: Transaction[];
  payouts: Payout[];
  loading: boolean;
  requestPayout: (amount: number, bankDetails?: BankDetails) => Promise<void>;
  createTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  getTransactionHistory: () => Transaction[];
  getPayoutHistory: () => Payout[];
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData>({
    balance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
    pendingPayouts: 0,
    currency: 'NGN'
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(false);

  // Load wallet data from localStorage
  useEffect(() => {
    if (user?.role === 'mentor') {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = () => {
    try {
      const walletKey = `wallet_${user?.id}`;
      const transactionsKey = `transactions_${user?.id}`;
      const payoutsKey = `payouts_${user?.id}`;

      const storedWallet = localStorage.getItem(walletKey);
      const storedTransactions = localStorage.getItem(transactionsKey);
      const storedPayouts = localStorage.getItem(payoutsKey);

      if (storedWallet) {
        setWallet(JSON.parse(storedWallet));
      } else {
        // Initialize with demo data for testing
        const demoWallet: WalletData = {
          balance: 125000,
          totalEarned: 450000,
          totalWithdrawn: 325000,
          pendingPayouts: 0,
          currency: 'NGN'
        };
        setWallet(demoWallet);
        localStorage.setItem(walletKey, JSON.stringify(demoWallet));
      }

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        // Initialize with demo transactions
        const demoTransactions: Transaction[] = [
          {
            id: '1',
            reference: 'MMIND-1735210800000',
            learnerId: 'learner_1',
            learnerName: 'John Doe',
            learnerImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            mentorId: user?.id || '',
            totalAmount: 50000,
            platformFee: 10000,
            mentorEarnings: 40000,
            status: 'successful',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            reference: 'MMIND-1735124400000',
            learnerId: 'learner_2',
            learnerName: 'Jane Smith',
            learnerImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
            mentorId: user?.id || '',
            totalAmount: 60000,
            platformFee: 12000,
            mentorEarnings: 48000,
            status: 'successful',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            reference: 'MMIND-1734951600000',
            learnerId: 'learner_3',
            learnerName: 'Mike Johnson',
            learnerImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
            mentorId: user?.id || '',
            totalAmount: 45000,
            platformFee: 9000,
            mentorEarnings: 36000,
            status: 'successful',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setTransactions(demoTransactions);
        localStorage.setItem(transactionsKey, JSON.stringify(demoTransactions));
      }

      if (storedPayouts) {
        setPayouts(JSON.parse(storedPayouts));
      } else {
        // Initialize with demo payouts
        const demoPayouts: Payout[] = [
          {
            id: '1',
            mentorId: user?.id || '',
            amount: 200000,
            fee: 50,
            netAmount: 199950,
            bankName: 'GTBank',
            accountNumber: '0123456789',
            accountName: user?.name || 'Mentor',
            status: 'completed',
            requestedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            processedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            mentorId: user?.id || '',
            amount: 125000,
            fee: 50,
            netAmount: 124950,
            bankName: 'GTBank',
            accountNumber: '0123456789',
            accountName: user?.name || 'Mentor',
            status: 'completed',
            requestedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            processedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        setPayouts(demoPayouts);
        localStorage.setItem(payoutsKey, JSON.stringify(demoPayouts));
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const requestPayout = async (amount: number, bankDetails?: BankDetails) => {
    if (!user) throw new Error('User not authenticated');
    if (amount < 10000) throw new Error('Minimum payout amount is ₦10,000');
    if (amount > wallet.balance) throw new Error('Insufficient balance');

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newPayout: Payout = {
        id: crypto.randomUUID(),
        mentorId: user.id,
        amount,
        fee: 50,
        netAmount: amount - 50,
        bankName: bankDetails?.bankName || 'GTBank',
        accountNumber: bankDetails?.accountNumber || '0123456789',
        accountName: bankDetails?.accountName || user.name,
        status: 'pending',
        requestedAt: new Date().toISOString()
      };

      const updatedPayouts = [newPayout, ...payouts];
      const updatedWallet = {
        ...wallet,
        balance: wallet.balance - amount,
        pendingPayouts: wallet.pendingPayouts + amount
      };

      setPayouts(updatedPayouts);
      setWallet(updatedWallet);

      // Persist to localStorage
      localStorage.setItem(`payouts_${user.id}`, JSON.stringify(updatedPayouts));
      localStorage.setItem(`wallet_${user.id}`, JSON.stringify(updatedWallet));
    } catch (error) {
      console.error('Payout request failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID()
      };

      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);

      // Update wallet if this is for the current user (mentor receiving payment)
      if (user?.id === transaction.mentorId) {
        const updatedWallet = {
          ...wallet,
          balance: wallet.balance + transaction.mentorEarnings,
          totalEarned: wallet.totalEarned + transaction.mentorEarnings
        };
        setWallet(updatedWallet);
        localStorage.setItem(`wallet_${user.id}`, JSON.stringify(updatedWallet));
      }

      // Persist transaction
      localStorage.setItem(`transactions_${transaction.mentorId}`, JSON.stringify(updatedTransactions));
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  };

  const getTransactionHistory = () => {
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getPayoutHistory = () => {
    return payouts.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  };

  const refreshWallet = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      loadWalletData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        payouts,
        loading,
        requestPayout,
        createTransaction,
        getTransactionHistory,
        getPayoutHistory,
        refreshWallet
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};
