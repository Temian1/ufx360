import React, { useState, useMemo } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { User, WalletTransaction } from '../types';

interface WalletViewProps {
  user: User | null;
  transactions: WalletTransaction[];
  onDeposit: (amount: number, method: 'Stripe' | 'PayPal' | 'Crypto') => void;
  onWithdraw: (amount: number, method: 'Stripe' | 'PayPal' | 'Crypto') => void;
  onGoAccount?: () => void;
  onGoPromos?: () => void;
}

type Tab = 'overview' | 'deposit' | 'withdraw' | 'transactions';
type Method = 'Stripe' | 'PayPal' | 'Crypto';

// SVG Icons
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const DepositIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
);

const WithdrawIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);

const ReceiptIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="16" y2="14"/>
  </svg>
);

const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const PayPalIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 11l1-9h7c3 0 5 2 4.5 5s-3.5 4-6.5 4h-3l-1 5H5"/><path d="M10 14l1-9h7c3 0 5 2 4.5 5s-3.5 4-6.5 4h-3"/>
  </svg>
);

const BitcoinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-6.08-1.042m6.08 1.042.347-1.97M7.116 7.397l-1.257-.216m11.16 12.457 1.258.216M8.373 2.343l-.635 3.608m7.147 12.14-.636 3.607M6.753 13.053l-.636 3.607"/>
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const tabConfig: { key: Tab; icon: React.FC; label: string }[] = [
  { key: 'overview', icon: DashboardIcon, label: 'Overview' },
  { key: 'deposit', icon: DepositIcon, label: 'Deposit' },
  { key: 'withdraw', icon: WithdrawIcon, label: 'Withdraw' },
  { key: 'transactions', icon: ReceiptIcon, label: 'History' },
];

const WalletView: React.FC<WalletViewProps> = ({ user, transactions, onDeposit, onWithdraw, onGoAccount, onGoPromos }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [method, setMethod] = useState<Method>('Stripe');
  const [amount, setAmount] = useState('50');
  const [network, setNetwork] = useState('USDT-TRC20');

  const [filterType, setFilterType] = useState<string>('All');
  const [filterDate, setFilterDate] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const available = user ? Math.max(user.balance - user.exposure, 0) : 0;
  const quickAmounts = [20, 50, 100, 250, 500, 1000];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (filterType !== 'All' && tx.type !== filterType) return false;
      if (searchTerm && !tx.note.toLowerCase().includes(searchTerm.toLowerCase()) && !tx.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      if (filterDate !== 'All') {
        const txDate = new Date(tx.date);
        const today = new Date();

        if (filterDate === 'Today') {
          if (txDate.toDateString() !== today.toDateString()) return false;
        } else if (filterDate === 'Last 7 Days') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          if (txDate < sevenDaysAgo) return false;
        } else if (filterDate === 'Last 30 Days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          if (txDate < thirtyDaysAgo) return false;
        }
      }

      return true;
    });
  }, [transactions, filterType, filterDate, searchTerm]);

  const handleExport = () => {
    const headers = ['ID', 'Type', 'Amount', 'Date', 'Note'];
    const csvContent = [
        headers.join(','),
        ...filteredTransactions.map(tx => [tx.id, tx.type, tx.amount, tx.date, tx.note].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleTransactionSubmit = (type: 'deposit' | 'withdraw') => {
    const parsed = parseFloat(amount || '0');
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    if (type === 'deposit') {
      onDeposit(parsed, method);
    } else {
      onWithdraw(parsed, method);
    }
    setAmount('');
    alert(type === 'deposit' ? t('wallet.deposit_success') : t('wallet.withdraw_success'));
  };

  const methodIcons: Record<Method, React.FC> = {
    Stripe: CreditCardIcon,
    PayPal: PayPalIcon,
    Crypto: BitcoinIcon,
  };

  const txIcon = (type: string) => {
    if (type === 'Deposit') return <DepositIcon />;
    if (type === 'Withdraw') return <WithdrawIcon />;
    return <ReceiptIcon />;
  };

  return (
    <div className="space-y-0">
      {/* Header - matches profile style */}
      <div className="bg-white dark:bg-dark-header p-3 sticky top-14 z-40 border-b border-gray-200 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
            </svg>
            <span className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight">My Wallet</span>
          </div>
          <div className="flex items-center gap-2">
            {onGoPromos && (
              <button
                onClick={onGoPromos}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bet-yellow/10 text-bet-yellow text-xs font-bold hover:bg-bet-yellow/20 transition-colors"
              >
                <GiftIcon />
                <span>Offers</span>
              </button>
            )}
            {onGoAccount && (
              <button
                onClick={onGoAccount}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary dark:text-bet-yellow text-xs font-bold hover:bg-primary/20 transition-colors"
              >
                <UserIcon />
                <span>Profile</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* Balance Strip - matches profile page balance strip */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-white/5">
            <div className="p-3 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Balance</p>
              <p className="text-base font-black text-gray-900 dark:text-white tabular-nums">${user?.balance.toFixed(2)}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">In Bets</p>
              <p className="text-base font-black text-bet-yellow tabular-nums">${user?.exposure.toFixed(2)}</p>
            </div>
            <div className="p-3 text-center">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Available</p>
              <p className="text-base font-black text-green-600 dark:text-green-400 tabular-nums">${available.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation - compact, no shadows */}
        <div className="flex gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/5">
          {tabConfig.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === key
                ? 'bg-white dark:bg-surface-dark text-primary dark:text-bet-yellow'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Icon />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">

          {activeTab === 'overview' && (
            <div className="p-3 sm:p-4 space-y-3">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/10 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                    <DepositIcon />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-gray-900 dark:text-white">Deposit</p>
                    <p className="text-[10px] text-gray-400">Add funds</p>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/10 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <WithdrawIcon />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs text-gray-900 dark:text-white">Withdraw</p>
                    <p className="text-[10px] text-gray-400">Cash out</p>
                  </div>
                </button>
              </div>

              {/* Account Info */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Verification</p>
                  <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircleIcon />
                    Verified
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Daily Limit</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">$10,000</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">Recent Activity</h3>
                  <button onClick={() => setActiveTab('transactions')} className="text-[11px] text-primary dark:text-bet-yellow font-bold hover:underline">View All</button>
                </div>
                <div className="space-y-1">
                  {transactions.slice(0, 4).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          tx.amount >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
                        }`}>
                          {txIcon(tx.type)}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-gray-900 dark:text-white">{tx.type}</p>
                          <p className="text-[10px] text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-black text-xs tabular-nums ${tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <p className="text-center text-xs text-gray-400 py-6">No transactions yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'deposit' || activeTab === 'withdraw') && (
            <div className="p-3 sm:p-4">
              <h2 className="text-sm font-black mb-4 text-gray-900 dark:text-white text-center uppercase tracking-tight">
                {activeTab === 'deposit' ? t('wallet.add_funds_title') : t('wallet.withdraw_funds_title')}
              </h2>

              {/* Payment Method */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(['Stripe', 'PayPal', 'Crypto'] as Method[]).map((m) => {
                  const MIcon = methodIcons[m];
                  return (
                    <button
                      key={m}
                      onClick={() => setMethod(m)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        method === m
                        ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary dark:text-bet-yellow'
                        : 'border-gray-100 dark:border-white/5 text-gray-500 hover:border-gray-200 dark:hover:border-white/10'
                      }`}
                    >
                      <MIcon />
                      <span className="font-bold text-xs mt-1.5">{m}</span>
                    </button>
                  );
                })}
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">{t('wallet.amount_label')}</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                    placeholder="0.00"
                  />
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mt-2">
                  {quickAmounts.map(amt => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                        amount === amt.toString()
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {method === 'Crypto' && (
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">{t('wallet.network_label')}</label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                  >
                    <option>USDT-TRC20</option>
                    <option>USDT-ERC20</option>
                    <option>BTC (Bitcoin)</option>
                    <option>ETH (Ethereum)</option>
                  </select>
                  <p className="text-[10px] text-orange-500 mt-1.5 flex items-center gap-1">
                    <WarningIcon />
                    {t('wallet.network_warning')}
                  </p>
                </div>
              )}

              <button
                onClick={() => handleTransactionSubmit(activeTab as 'deposit' | 'withdraw')}
                className="w-full bg-bet-yellow hover:bg-yellow-400 text-gray-900 font-black uppercase py-3 rounded-xl transition-all active:scale-[0.98] text-sm tracking-wide"
              >
                {activeTab === 'deposit' ? `${t('wallet.deposit_via')} ${method}` : `${t('wallet.withdraw_to')} ${method}`}
              </button>

              <p className="text-center text-[10px] text-gray-400 mt-2 flex items-center justify-center gap-1">
                <LockIcon />
                {t('wallet.secure_msg')} {method}
              </p>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="p-3 sm:p-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <div className="flex gap-2 flex-1 flex-wrap">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium focus:outline-none text-gray-700 dark:text-gray-300"
                  >
                    <option value="All">{t('wallet.filter_type_all')}</option>
                    <option value="Deposit">{t('wallet.filter_type_deposit')}</option>
                    <option value="Withdraw">{t('wallet.filter_type_withdraw')}</option>
                    <option value="Bet Placed">{t('wallet.filter_type_bet')}</option>
                    <option value="Settlement">{t('wallet.filter_type_settlement')}</option>
                  </select>
                  <select
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium focus:outline-none text-gray-700 dark:text-gray-300"
                  >
                    <option value="All">{t('wallet.filter_date_all')}</option>
                    <option value="Today">{t('wallet.filter_date_today')}</option>
                    <option value="Last 7 Days">{t('wallet.filter_date_week')}</option>
                    <option value="Last 30 Days">{t('wallet.filter_date_month')}</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-none">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                    <input
                      type="text"
                      placeholder={t('wallet.search_placeholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-auto pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 text-gray-700 dark:text-gray-300"
                    />
                  </div>
                  <button
                    onClick={handleExport}
                    className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
                  >
                    <DownloadIcon />
                    <span className="hidden sm:inline">{t('wallet.export')}</span>
                  </button>
                </div>
              </div>

              {/* Transaction List */}
              <div className="space-y-1">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          tx.amount >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
                        }`}>
                          {txIcon(tx.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                              tx.type === 'Deposit' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                              tx.type === 'Withdraw' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' :
                              tx.type === 'Settlement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                              'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400'
                            }`}>{tx.type}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{new Date(tx.date).toLocaleDateString()} &middot; {tx.note}</p>
                        </div>
                      </div>
                      <span className={`font-black text-xs tabular-nums ${tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-xs text-gray-400 py-6">No transactions found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletView;
