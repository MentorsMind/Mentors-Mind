import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useForum } from './contexts/ForumContext';
import { useWallet } from './contexts/WalletContext';
import { AdminGuard, useAdmin } from './components/guards/AdminGuard';
import type { User } from './contexts/AuthContext';
import type { Post } from './contexts/ForumContext';
import type { Payout, Transaction } from './contexts/WalletContext';

interface AdminAction {
  timestamp: string;
  action: string;
}

function AdminPanelContent() {
  const { user } = useAuth();
  const { posts, deletePost } = useForum();
  const { payouts, transactions, refreshWallet } = useWallet();
  const { logout } = useAdmin();
  const [activeTab, setActiveTab] = useState<'users' | 'forum' | 'payouts' | 'verifications' | 'stats'>('stats');
  const [users, setUsers] = useState<User[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [allPayouts, setAllPayouts] = useState<Payout[]>([]);
  const [actionLog, setActionLog] = useState<AdminAction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load all users
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);

    // Load all transactions from all users
    const allTransactionsList: Transaction[] = [];
    const allPayoutsList: Payout[] = [];
    
    storedUsers.forEach((u: User) => {
      const txKey = `transactions_${u.id}`;
      const payoutKey = `payouts_${u.id}`;
      const storedTx = localStorage.getItem(txKey);
      const storedPayouts = localStorage.getItem(payoutKey);
      
      if (storedTx) {
        allTransactionsList.push(...JSON.parse(storedTx));
      }
      if (storedPayouts) {
        allPayoutsList.push(...JSON.parse(storedPayouts));
      }
    });

    setAllTransactions(allTransactionsList);
    setAllPayouts(allPayoutsList);

    // Load action log
    const storedLog = localStorage.getItem('adminActionLog');
    if (storedLog) {
      setActionLog(JSON.parse(storedLog));
    }
  };

  const logAction = (action: string) => {
    const newLog: AdminAction = {
      timestamp: new Date().toISOString(),
      action
    };
    const updatedLog = [newLog, ...actionLog];
    setActionLog(updatedLog);
    localStorage.setItem('adminActionLog', JSON.stringify(updatedLog));
  };

  const toggleBan = (userId: string, userName: string, currentBanned: boolean) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, banned: !currentBanned } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Also update current user if it's the same
    if (user?.id === userId) {
      user.banned = !currentBanned;
    }

    logAction(`${!currentBanned ? 'Banned' : 'Unbanned'} user: ${userName} (${userId})`);
  };

  const toggleVerification = (userId: string, userName: string, currentVerified: boolean) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, verified: !currentVerified } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Also update current user if it's the same
    if (user?.id === userId) {
      user.verified = !currentVerified;
    }

    logAction(`${!currentVerified ? 'Verified' : 'Unverified'} mentor: ${userName} (${userId})`);
  };

  const handleDeletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(postId);
      logAction(`Deleted post: ${postId}`);
    }
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      // This would need to be implemented in ForumContext
      logAction(`Deleted comment: ${commentId} from post: ${postId}`);
    }
  };

  const approvePayout = (payoutId: string) => {
    const payout = allPayouts.find(p => p.id === payoutId);
    if (!payout) return;

    // Update payout status
    const updatedPayouts = allPayouts.map(p => 
      p.id === payoutId ? { 
        ...p, 
        status: 'completed' as const,
        processedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      } : p
    );
    setAllPayouts(updatedPayouts);
    localStorage.setItem(`payouts_${payout.mentorId}`, JSON.stringify(
      updatedPayouts.filter(p => p.mentorId === payout.mentorId)
    ));

    // Update mentor's wallet balance
    const walletKey = `wallet_${payout.mentorId}`;
    const storedWallet = localStorage.getItem(walletKey);
    if (storedWallet) {
      const wallet = JSON.parse(storedWallet);
      const updatedWallet = {
        ...wallet,
        totalWithdrawn: wallet.totalWithdrawn + payout.amount,
        pendingPayouts: wallet.pendingPayouts - payout.amount
      };
      localStorage.setItem(walletKey, JSON.stringify(updatedWallet));
    }

    logAction(`Approved payout: ${payoutId} for mentor ${payout.mentorId}, amount: ${payout.amount}`);
    refreshWallet();
  };

  const rejectPayout = (payoutId: string) => {
    const payout = allPayouts.find(p => p.id === payoutId);
    if (!payout) return;

    // Update payout status
    const updatedPayouts = allPayouts.map(p => 
      p.id === payoutId ? { 
        ...p, 
        status: 'cancelled' as const,
        processedAt: new Date().toISOString()
      } : p
    );
    setAllPayouts(updatedPayouts);
    localStorage.setItem(`payouts_${payout.mentorId}`, JSON.stringify(
      updatedPayouts.filter(p => p.mentorId === payout.mentorId)
    ));

    // Refund to mentor's wallet
    const walletKey = `wallet_${payout.mentorId}`;
    const storedWallet = localStorage.getItem(walletKey);
    if (storedWallet) {
      const wallet = JSON.parse(storedWallet);
      const updatedWallet = {
        ...wallet,
        balance: wallet.balance + payout.amount,
        pendingPayouts: wallet.pendingPayouts - payout.amount
      };
      localStorage.setItem(walletKey, JSON.stringify(updatedWallet));
    }

    logAction(`Rejected payout: ${payoutId} for mentor ${payout.mentorId}, amount: ${payout.amount}`);
    refreshWallet();
  };

  // Calculate stats
  const totalUsers = users.length;
  const totalRevenue = allTransactions
    .filter(t => t.status === 'successful')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  const pendingPayouts = allPayouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const activeSessions = new Set(allTransactions.map(t => t.bookingId).filter(Boolean)).size;

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'stats', label: 'Platform Stats' },
              { id: 'users', label: 'Users' },
              { id: 'forum', label: 'Forum' },
              { id: 'payouts', label: 'Payouts' },
              { id: 'verifications', label: 'Verifications' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">👥</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-lg font-medium text-gray-900">{totalUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">💰</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">₦{totalRevenue.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">⏳</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Pending Payouts</dt>
                      <dd className="text-lg font-medium text-gray-900">₦{pendingPayouts.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-3xl">📊</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Sessions</dt>
                      <dd className="text-lg font-medium text-gray-900">{activeSessions}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map(u => (
                  <li key={u.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {u.image && (
                          <img className="h-10 w-10 rounded-full" src={u.image} alt="" />
                        )}
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">{u.name}</p>
                            {u.banned && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Banned
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{u.email}</p>
                          <p className="text-sm text-gray-500">Role: {u.role}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleBan(u.id, u.name, u.banned || false)}
                        className={`px-3 py-1 rounded text-sm ${
                          u.banned 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {u.banned ? 'Unban' : 'Ban'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Forum Tab */}
        {activeTab === 'forum' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {posts.map(post => (
                <li key={post.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{post.title}</h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.content}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>By {post.author}</span>
                        <span className="mx-2">•</span>
                        <span>{post.category}</span>
                        <span className="mx-2">•</span>
                        <span>{post.answers} answers</span>
                      </div>
                      {post.comments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="bg-gray-50 p-2 rounded">
                              <p className="text-sm text-gray-700">{comment.content}</p>
                              <div className="mt-1 flex justify-between items-center">
                                <span className="text-xs text-gray-500">By {comment.authorName}</span>
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="text-xs text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                    >
                      Delete Post
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Payouts Tab */}
        {activeTab === 'payouts' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {allPayouts.map(payout => (
                <li key={payout.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          ₦{payout.amount.toLocaleString()}
                        </p>
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payout.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payout.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payout.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Mentor ID: {payout.mentorId}
                      </p>
                      {payout.bankName && (
                        <p className="text-sm text-gray-500">
                          Bank: {payout.bankName} ({payout.accountNumber})
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Requested: {new Date(payout.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {payout.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => approvePayout(payout.id)}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectPayout(payout.id)}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Verifications Tab */}
        {activeTab === 'verifications' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {users.filter(u => u.role === 'mentor').map(mentor => (
                <li key={mentor.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {mentor.image && (
                        <img className="h-10 w-10 rounded-full" src={mentor.image} alt="" />
                      )}
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{mentor.name}</p>
                        <p className="text-sm text-gray-500">{mentor.email}</p>
                        {mentor.category && (
                          <p className="text-sm text-gray-500">Category: {mentor.category}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {mentor.verified && (
                        <span className="mr-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Verified
                        </span>
                      )}
                      <button
                        onClick={() => toggleVerification(mentor.id, mentor.name, mentor.verified || false)}
                        className={`px-3 py-1 rounded text-sm ${
                          mentor.verified
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {mentor.verified ? 'Remove Verification' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Log */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Admin Action Log</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {actionLog.map((log, index) => (
                <li key={index} className="px-4 py-3 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900">{log.action}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminPanel() {
  return (
    <AdminGuard>
      <AdminPanelContent />
    </AdminGuard>
  );
}