import React, { useState, useMemo } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { User, WalletTransaction } from '../types';

interface WalletViewProps {
  user: User | null;
  transactions: WalletTransaction[];
  onDeposit: (amount: number, method: 'Stripe' | 'PayPal' | 'Crypto') => void;
  onWithdraw: (amount: number, method: 'Stripe' | 'PayPal' | 'Crypto') => void;
}

type Tab = 'overview' | 'deposit' | 'withdraw' | 'transactions';
type Method = 'Stripe' | 'PayPal' | 'Crypto';

const tabIcons: Record<Tab, string> = {
  overview: 'dashboard',
  deposit: 'add_card',
  withdraw: 'payments',
  transactions: 'receipt_long',
};

const WalletView: React.FC<WalletViewProps> = ({ user, transactions, onDeposit, onWithdraw }) => {
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

  return (
    <div className="p-3 sm:p-4 space-y-4 animate-in fade-in duration-300">
      {/* Compact Balance Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/15 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">My Wallet</p>
              <p className="text-2xl sm:text-3xl font-black tracking-tight">${user?.balance.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Secure
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Available</p>
              <p className="text-lg font-black text-green-400">${available.toFixed(2)}</p>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">In Bets</p>
              <p className="text-lg font-black text-bet-yellow">${user?.exposure.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/5">
        {(['overview', 'deposit', 'withdraw', 'transactions'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab
              ? 'bg-white dark:bg-surface-dark text-primary dark:text-bet-yellow shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tabIcons[tab]}</span>
            <span className="hidden sm:inline capitalize">
              {tab === 'overview' ? t('wallet.tab_overview') :
               tab === 'deposit' ? t('wallet.tab_deposit') :
               tab === 'withdraw' ? t('wallet.tab_withdraw') :
               t('wallet.tab_transactions')}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">

        {activeTab === 'overview' && (
          <div className="p-4 sm:p-6 space-y-5">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('deposit')}
                className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined">add_card</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Deposit</p>
                  <p className="text-[10px] text-gray-500">Add funds</p>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-100 dark:border-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/10 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-gray-900 dark:text-white">Withdraw</p>
                  <p className="text-[10px] text-gray-500">Cash out</p>
                </div>
              </button>
            </div>

            {/* Account Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Verification</p>
                <p className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Verified
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Daily Limit</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">$10,000</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">Recent Activity</h3>
                <button onClick={() => setActiveTab('transactions')} className="text-xs text-primary dark:text-bet-yellow font-bold hover:underline">View All</button>
              </div>
              <div className="space-y-1">
                {transactions.slice(0, 4).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${
                        tx.amount >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
                      }`}>
                        <span className="material-symbols-outlined text-lg">
                          {tx.type === 'Deposit' ? 'add_card' : tx.type === 'Withdraw' ? 'payments' : tx.type === 'Settlement' ? 'gavel' : 'sports_soccer'}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-xs text-gray-900 dark:text-white">{tx.type}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`font-black text-sm tabular-nums ${tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                      {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-8">No transactions yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'deposit' || activeTab === 'withdraw') && (
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-bold mb-5 text-gray-900 dark:text-white text-center">
              {activeTab === 'deposit' ? t('wallet.add_funds_title') : t('wallet.withdraw_funds_title')}
            </h2>

            {/* Payment Method */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {(['Stripe', 'PayPal', 'Crypto'] as Method[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    method === m
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 text-primary dark:text-bet-yellow'
                    : 'border-gray-100 dark:border-white/5 text-gray-500 hover:border-gray-200 dark:hover:border-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined mb-1.5 text-xl">
                    {m === 'Crypto' ? 'currency_bitcoin' : m === 'Stripe' ? 'credit_card' : 'account_balance_wallet'}
                  </span>
                  <span className="font-bold text-xs">{m}</span>
                </button>
              ))}
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{t('wallet.amount_label')}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                {quickAmounts.map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className={`py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
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
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{t('wallet.network_label')}</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                >
                  <option>USDT-TRC20</option>
                  <option>USDT-ERC20</option>
                  <option>BTC (Bitcoin)</option>
                  <option>ETH (Ethereum)</option>
                </select>
                <p className="text-[10px] text-orange-500 mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">warning</span>
                  {t('wallet.network_warning')}
                </p>
              </div>
            )}

            <button
              onClick={() => handleTransactionSubmit(activeTab as 'deposit' | 'withdraw')}
              className="w-full bg-gradient-to-r from-bet-yellow to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 font-black uppercase py-4 rounded-xl shadow-md transition-all active:scale-[0.98] text-sm tracking-wide"
            >
              {activeTab === 'deposit' ? `${t('wallet.deposit_via')} ${method}` : `${t('wallet.withdraw_to')} ${method}`}
            </button>

            <p className="text-center text-[10px] text-gray-400 mt-3 flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-xs">lock</span>
              {t('wallet.secure_msg')} {method}
            </p>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="p-4 sm:p-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex gap-2 flex-1 flex-wrap">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium focus:outline-none text-gray-700 dark:text-gray-300"
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
                  className="px-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-medium focus:outline-none text-gray-700 dark:text-gray-300"
                >
                  <option value="All">{t('wallet.filter_date_all')}</option>
                  <option value="Today">{t('wallet.filter_date_today')}</option>
                  <option value="Last 7 Days">{t('wallet.filter_date_week')}</option>
                  <option value="Last 30 Days">{t('wallet.filter_date_month')}</option>
                </select>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">search</span>
                  <input
                    type="text"
                    placeholder={t('wallet.search_placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto pl-9 pr-3 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 text-gray-700 dark:text-gray-300"
                  />
                </div>
                <button
                  onClick={handleExport}
                  className="px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  <span className="hidden sm:inline">{t('wallet.export')}</span>
                </button>
              </div>
            </div>

            {/* Mobile-friendly transaction list */}
            <div className="sm:hidden space-y-2">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        tx.amount >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400'
                      }`}>
                        <span className="material-symbols-outlined text-lg">
                          {tx.type === 'Deposit' ? 'add_card' : tx.type === 'Withdraw' ? 'payments' : tx.type === 'Settlement' ? 'gavel' : 'sports_soccer'}
                        </span>
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
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(tx.date).toLocaleDateString()} &middot; {tx.note}</p>
                      </div>
                    </div>
                    <span className={`font-black text-sm tabular-nums ${tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                      {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-gray-400 py-8">No transactions found</p>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-3 font-bold">Date</th>
                    <th className="py-3 px-3 font-bold">Type</th>
                    <th className="py-3 px-3 font-bold">Description</th>
                    <th className="py-3 px-3 font-bold text-right">Amount</th>
                    <th className="py-3 px-3 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-sm">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(tx.date).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'Deposit' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                            tx.type === 'Withdraw' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400' :
                            tx.type === 'Settlement' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' :
                            'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-gray-400'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-gray-700 dark:text-gray-300 max-w-[200px] truncate">
                          {tx.note}
                        </td>
                        <td className={`py-3 px-3 text-right text-xs font-bold tabular-nums ${tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                          {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm text-gray-400">
                        No transactions found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletView;
