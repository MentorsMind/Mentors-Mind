import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Clock, 
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import { useAuth } from './contexts/AuthContext';
import { useWallet } from './contexts/WalletContext';
import { useNavigate } from 'react-router-dom';
import { paystackApi, Bank } from './lib/paystackBanks';

export function MentorWallet() {
  const { user } = useAuth();
  const { wallet, loading, requestPayout, getTransactionHistory, getPayoutHistory, refreshWallet } = useWallet();
  const navigate = useNavigate();
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('10000');
  const [filter, setFilter] = useState<'all' | 'successful' | 'pending' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState<string | null>(null);
  const [resolvingAccount, setResolvingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const bankDropdownRef = useRef<HTMLDivElement>(null);

  // Redirect if not a mentor
  useEffect(() => {
    if (user?.role !== 'mentor') {
      navigate('/mentor-dashboard');
    }
  }, [user, navigate]);

  // Load banks on payout modal open
  useEffect(() => {
    if (showPayoutModal) {
      loadBanks();
    }
  }, [showPayoutModal]);

  // Close bank dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(event.target as Node)) {
        setShowBankDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced account resolve
  const debouncedResolveAccount = useCallback(() => {
    if (accountNumber.length === 10 && selectedBank?.code) {
      resolveAccount();
    } else {
      setAccountName(null);
      setAccountError(null);
    }
  }, [accountNumber, selectedBank]);

  useEffect(() => {
    const timerId = setTimeout(debouncedResolveAccount, 500);
    return () => clearTimeout(timerId);
  }, [accountNumber, selectedBank, debouncedResolveAccount]);

  const loadBanks = async () => {
    setBanksLoading(true);
    try {
      const fetchedBanks = await paystackApi.getNigerianBanks();
      setBanks(fetchedBanks);
    } catch (error) {
      console.error('Failed to load banks:', error);
    } finally {
      setBanksLoading(false);
    }
  };

  const resolveAccount = async () => {
    if (!selectedBank || !accountNumber) return;
    setResolvingAccount(true);
    setAccountError(null);
    try {
      const result = await paystackApi.resolveAccount(selectedBank.code, accountNumber);
      if (result.status) {
        setAccountName(result.data.account_name);
        setAccountError(null);
      } else {
        setAccountError(result.message || 'Failed to resolve account');
        setAccountName(null);
      }
    } catch (error: any) {
      setAccountError(error.message || 'Failed to resolve account');
      setAccountName(null);
    } finally {
      setResolvingAccount(false);
    }
  };

  const filteredBanks = banks.filter((bank) => 
    bank.name.toLowerCase().includes(bankSearchQuery.toLowerCase())
  );

  const payoutAmountNum = parseFloat(payoutAmount) || 0;
  const payoutFee = 50;
  const netAmount = Math.max(0, payoutAmountNum - payoutFee);

  const handleConfirmPayout = async () => {
    const amount = parseFloat(payoutAmount);
    
    try {
      await requestPayout(amount, {
        bankName: selectedBank?.name,
        accountNumber,
        accountName
      });
      setShowConfirmationModal(false);
      setShowPayoutModal(false);
      setPayoutAmount('10000');
      setSelectedBank(null);
      setAccountNumber('');
      setAccountName(null);
      setBankSearchQuery('');
      alert('Payout requested successfully! Funds will be transferred within 2-3 business days.');
    } catch (error: any) {
      alert(error.message || 'Failed to request payout. Please try again.');
    }
  };

  const filteredTransactions = getTransactionHistory().filter(tx => {
    const matchesFilter = filter === 'all' || tx.status === filter;
    const matchesSearch = tx.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'pending':
      case 'processing':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
      case 'failed':
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
      case 'processing':
        return <Clock className="w-3 h-3" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 pb-24 md:pb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your earnings and payouts</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={refreshWallet}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-[#1a2e22] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-[#25382e] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Refresh</span>
            </button>
            <button
              onClick={() => setShowPayoutModal(true)}
              disabled={loading || wallet.balance < 10000}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Download className="w-5 h-5" />
              Request Payout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Available Balance */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-8 h-8" />
                <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Available</span>
              </div>
              <p className="text-sm opacity-90 mb-1">Available Balance</p>
              <p className="text-3xl md:text-4xl font-bold">{formatCurrency(wallet.balance)}</p>
            </div>
          </div>

          {/* Total Earned */}
          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Earned</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(wallet.totalEarned)}</p>
          </div>

          {/* Total Withdrawn */}
          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <ArrowDownRight className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Withdrawn</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(wallet.totalWithdrawn)}</p>
          </div>

          {/* Pending Payouts */}
          <div className="bg-white dark:bg-[#1a2e22] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending Payouts</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatCurrency(wallet.pendingPayouts)}</p>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white dark:bg-[#1a2e22] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
              
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="successful">Successful</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Learner</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Platform Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Earnings</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(tx.date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${tx.learnerImage}')` }}></div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{tx.learnerName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                          {tx.reference}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(tx.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium">
                        -{formatCurrency(tx.platformFee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        +{formatCurrency(tx.mentorEarnings)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(tx.status)}`}>
                          {getStatusIcon(tx.status)}
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                          <DollarSign className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No transactions found</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {searchQuery ? 'Try adjusting your search or filters' : 'Your transactions will appear here'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white dark:bg-[#1a2e22] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payout History</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {getPayoutHistory().length > 0 ? (
                getPayoutHistory().map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${getStatusColor(payout.status)}`}>
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(payout.netAmount)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Requested on {formatDate(payout.requestedAt)}
                        </p>
                        {payout.bankName && (
                          <p className="text-xs text-gray-400 mt-1">
                            {payout.bankName} • {payout.accountNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payout.status)}`}>
                        {getStatusIcon(payout.status)}
                        {payout.status}
                      </span>
                      {payout.completedAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Completed {formatDate(payout.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No payout history</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your payout requests will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payout Request Modal */}
        {showPayoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a2e22] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="relative p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <XCircle className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-3 text-white">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Request Payout</h2>
                    <p className="text-sm text-white/80">Withdraw your earnings</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Available Balance */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-500/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(wallet.balance)}</p>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Payout Amount
                  </label>
                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₦</span>
                    <input
                      type="number"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder="0.00"
                      min="10000"
                      max={wallet.balance}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                  {/* Slider */}
                  <input
                    type="range"
                    min="10000"
                    max={wallet.balance}
                    step="1000"
                    value={payoutAmountNum}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>₦10k</span>
                    <span>{formatCurrency(wallet.balance)}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Minimum payout: ₦10,000 • Fee: ₦50 • Net: {formatCurrency(netAmount)}
                  </p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[25000, 50000, 100000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setPayoutAmount(amount.toString())}
                      disabled={amount > wallet.balance}
                      className="py-2 px-3 bg-gray-100 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ₦{(amount / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                {/* Bank Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Select Bank
                    </label>
                    <div className="relative" ref={bankDropdownRef}>
                      <button
                        onClick={() => setShowBankDropdown(!showBankDropdown)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl text-left focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      >
                        {selectedBank ? (
                          <span className="font-semibold text-gray-900 dark:text-white">{selectedBank.name}</span>
                        ) : (
                          <span className="text-gray-500">Choose a bank</span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${showBankDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showBankDropdown && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a2e22] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
                            <input
                              type="text"
                              placeholder="Search banks..."
                              value={bankSearchQuery}
                              onChange={(e) => setBankSearchQuery(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="py-1">
                            {banksLoading ? (
                              <div className="p-4 text-center text-gray-500">
                                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                                Loading banks...
                              </div>
                            ) : filteredBanks.length > 0 ? (
                              filteredBanks.map((bank) => (
                                <button
                                  key={bank.code}
                                  onClick={() => {
                                    setSelectedBank(bank);
                                    setShowBankDropdown(false);
                                    setBankSearchQuery('');
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                >
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">{bank.name}</span>
                                </button>
                              ))
                            ) : (
                              <div className="p-4 text-center text-gray-500 text-sm">No banks found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Number Input */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Account Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit account number"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                      {resolvingAccount && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                        </div>
                      )}
                    </div>
                    {accountName && (
                      <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-500/30 rounded-xl flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-xs text-green-700 dark:text-green-400 font-semibold">Account Name</p>
                          <p className="text-sm font-bold text-green-800 dark:text-green-300">{accountName}</p>
                        </div>
                      </div>
                    )}
                    {accountError && (
                      <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-xl flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <p className="text-sm text-red-700 dark:text-red-400">{accountError}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Processing Time:</strong> Payouts are processed within 2-3 business days and will be sent to your registered bank account.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowConfirmationModal(true)}
                    disabled={
                      loading || 
                      !payoutAmount || 
                      parseFloat(payoutAmount) < 10000 || 
                      !selectedBank || 
                      !accountName || 
                      parseFloat(payoutAmount) > wallet.balance
                    }
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1a2e22] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-500 to-emerald-600">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <XCircle className="w-5 h-5 text-white" />
                </button>
                <div className="flex items-center gap-3 text-white">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Confirm Payout</h2>
                    <p className="text-sm text-white/80">Review details before submitting</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(payoutAmountNum)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Fee</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">-{formatCurrency(payoutFee)}</span>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">Net Amount</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(netAmount)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Bank</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{selectedBank?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Account Number</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{accountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Account Name</span>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{accountName}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowConfirmationModal(false)}
                    className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmPayout}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? 'Processing...' : 'Confirm Payout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
