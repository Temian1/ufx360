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

const WalletView: React.FC<WalletViewProps> = ({ user, transactions, onDeposit, onWithdraw }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [method, setMethod] = useState<Method>('Stripe');
  const [amount, setAmount] = useState('50');
  const [network, setNetwork] = useState('USDT-TRC20');
  
  // Transaction Filters
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
  }, [transactions, filterType, searchTerm]);

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

  const renderPaymentMethodSelector = () => (
    <div className="grid grid-cols-3 gap-3 mb-6">
        {(['Stripe', 'PayPal', 'Crypto'] as Method[]).map((m) => (
            <button
                key={m}
                onClick={() => setMethod(m)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                    method === m 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
                <span className="material-symbols-outlined mb-2">
                    {m === 'Crypto' ? 'currency_bitcoin' : m === 'Stripe' ? 'credit_card' : 'account_balance_wallet'}
                </span>
                <span className="font-bold text-sm">{m}</span>
            </button>
        ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bet-yellow/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-[80px]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
                <h1 className="text-3xl font-black italic tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">My Wallet</h1>
                <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Secure & Encrypted
                </p>
            </div>
            <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 min-w-[160px] border border-white/10 hover:bg-white/10 transition duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-bet-yellow text-sm">account_balance_wallet</span>
                        <p className="text-xs text-gray-300 font-bold uppercase tracking-wider">Total Balance</p>
                    </div>
                    <p className="text-3xl font-black text-white tracking-tight">${user?.balance.toFixed(2)}</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 min-w-[160px] border border-white/10 hover:bg-white/10 transition duration-300">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                        <p className="text-xs text-gray-300 font-bold uppercase tracking-wider">Available</p>
                    </div>
                    <p className="text-3xl font-black text-green-400 tracking-tight">${available.toFixed(2)}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar p-1">
        {(['overview', 'deposit', 'withdraw', 'transactions'] as Tab[]).map(tab => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
                    activeTab === tab 
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105' 
                    : 'bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10'
                }`}
            >
                {tab === 'overview' ? t('wallet.tab_overview') :
                 tab === 'deposit' ? t('wallet.tab_deposit') :
                 tab === 'withdraw' ? t('wallet.tab_withdraw') :
                 t('wallet.tab_transactions')}
            </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 p-6 min-h-[400px]">
        
        {activeTab === 'overview' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800/30 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">bolt</span>
                            </div>
                            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100">Quick Actions</h3>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setActiveTab('deposit')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-600/20 active:scale-95 flex flex-col items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-xl">add_card</span>
                                Deposit
                            </button>
                            <button onClick={() => setActiveTab('withdraw')} className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 font-bold py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition active:scale-95 flex flex-col items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-xl">payments</span>
                                Withdraw
                            </button>
                        </div>
                    </div>
                    <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl p-6 border border-orange-100 dark:border-orange-900/20 hover:border-orange-200 dark:hover:border-orange-800/30 transition-colors">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                <span className="material-symbols-outlined">verified_user</span>
                            </div>
                            <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100">Account Status</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm items-center p-3 bg-white dark:bg-black/20 rounded-xl border border-orange-100 dark:border-white/5">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Verification Level</span>
                                <span className="font-bold text-green-600 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                    Verified
                                </span>
                            </div>
                            <div className="flex justify-between text-sm items-center p-3 bg-white dark:bg-black/20 rounded-xl border border-orange-100 dark:border-white/5">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">Daily Limit</span>
                                <span className="font-bold text-gray-900 dark:text-white">$10,000.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4 px-1">Recent Activity</h3>
                    <div className="divide-y divide-gray-100 dark:divide-white/5 border border-gray-100 dark:border-white/5 rounded-2xl overflow-hidden">
                        {transactions.slice(0, 5).map(tx => (
                            <div key={tx.id} className="p-4 flex items-center justify-between bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                                        tx.amount >= 0 ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                                    }`}>
                                        <span className="material-symbols-outlined">
                                            {tx.type === 'Deposit' ? 'add_card' : tx.type === 'Withdraw' ? 'payments' : 'sports_soccer'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">{tx.type}</p>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">{new Date(tx.date).toLocaleDateString()} • {tx.note}</p>
                                    </div>
                                </div>
                                <span className={`font-black text-sm ${tx.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                    {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {(activeTab === 'deposit' || activeTab === 'withdraw') && (
            <div className="max-w-xl mx-auto">
                <h2 className="text-xl font-bold mb-6 text-center">
                    {activeTab === 'deposit' ? t('wallet.add_funds_title') : t('wallet.withdraw_funds_title')}
                </h2>
                
                {renderPaymentMethodSelector()}

                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('wallet.amount_label')}</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="0.00"
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                        {quickAmounts.map(amt => (
                            <button 
                                key={amt}
                                onClick={() => setAmount(amt.toString())}
                                className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-xs font-medium transition"
                            >
                                ${amt}
                            </button>
                        ))}
                    </div>
                </div>

                {method === 'Crypto' && (
                     <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('wallet.network_label')}</label>
                        <select 
                            value={network} 
                            onChange={(e) => setNetwork(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option>USDT-TRC20</option>
                            <option>USDT-ERC20</option>
                            <option>BTC (Bitcoin)</option>
                            <option>ETH (Ethereum)</option>
                        </select>
                        <p className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            {t('wallet.network_warning')}
                        </p>
                    </div>
                )}

                <button 
                    onClick={() => handleTransactionSubmit(activeTab as 'deposit' | 'withdraw')}
                    className="w-full bg-bet-yellow hover:bg-yellow-400 text-gray-900 font-black uppercase py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition transform active:scale-[0.98]"
                >
                    {activeTab === 'deposit' ? `${t('wallet.deposit_via')} ${method}` : `${t('wallet.withdraw_to')} ${method}`}
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-4">
                    {t('wallet.secure_msg')} {method}.
                </p>
            </div>
        )}

        {activeTab === 'transactions' && (
            <div>
                <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
                    <div className="flex gap-2">
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none"
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
                            className="px-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none"
                        >
                            <option value="All">{t('wallet.filter_date_all')}</option>
                            <option value="Today">{t('wallet.filter_date_today')}</option>
                            <option value="Last 7 Days">{t('wallet.filter_date_week')}</option>
                            <option value="Last 30 Days">{t('wallet.filter_date_month')}</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                         <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">search</span>
                            <input 
                                type="text" 
                                placeholder={t('wallet.search_placeholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <button 
                            onClick={handleExport}
                            className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-bold flex items-center gap-2 transition"
                        >
                            <span className="material-symbols-outlined text-sm">download</span>
                            {t('wallet.export')}
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="py-3 px-4 font-bold">Date</th>
                                <th className="py-3 px-4 font-bold">Type</th>
                                <th className="py-3 px-4 font-bold">Description</th>
                                <th className="py-3 px-4 font-bold text-right">Amount</th>
                                <th className="py-3 px-4 font-bold text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                            {new Date(tx.date).toLocaleString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                tx.type === 'Deposit' ? 'bg-green-100 text-green-700' :
                                                tx.type === 'Withdraw' ? 'bg-orange-100 text-orange-700' :
                                                tx.type === 'Settlement' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-900 dark:text-white max-w-[200px] truncate">
                                            {tx.note}
                                        </td>
                                        <td className={`py-4 px-4 text-right font-bold ${tx.amount >= 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                                            {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500">
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
