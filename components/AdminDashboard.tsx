import React, { useMemo, useState } from 'react';
import { ApiKeyConfig, PaymentGateway, PlacedBet, User, UserRole, WalletTransaction, WithdrawalRequest } from '../types';

interface AdminDashboardProps {
  currentUser: User;
  allUsers: User[];
  allBets: PlacedBet[];
  walletTransactions: WalletTransaction[];
  withdrawalRequests: WithdrawalRequest[];
  paymentGateways: PaymentGateway[];
  apiKeys: ApiKeyConfig[];
  onCreateUser: (user: Omit<User, 'id'>) => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onFundUser: (userId: string, amount: number) => void;
  onApproveWithdrawal: (requestId: string, adminNote?: string) => void;
  onRejectWithdrawal: (requestId: string, adminNote?: string) => void;
  onUpdateGateway: (gatewayId: string, updates: Partial<PaymentGateway>) => void;
  onUpdateApiKey: (id: string, updates: Partial<ApiKeyConfig>) => void;
  onSettleBet: (betId: string, result: 'Won' | 'Lost') => void;
  onVoidBet: (betId: string) => void;
  onLogout: () => void;
}

type AdminTab = 'overview' | 'hierarchy' | 'risk' | 'live-bets' | 'bets' | 'payments' | 'reports' | 'settings';

const ROLES: UserRole[] = ['Super Admin', 'Admin', 'Senior Super', 'Super Master', 'Master', 'Agent', 'Player'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  allUsers,
  allBets,
  walletTransactions,
  withdrawalRequests,
  paymentGateways,
  apiKeys,
  onCreateUser,
  onUpdateUser,
  onFundUser,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onUpdateGateway,
  onUpdateApiKey,
  onSettleBet,
  onVoidBet,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});
  const [fundInput, setFundInput] = useState<Record<string, string>>({});

  const [createForm, setCreateForm] = useState({
    username: '',
    password: '',
    role: 'Senior Super' as UserRole,
    parentId: currentUser.id,
    creditLimit: 0,
    commission: 0,
    maxBetLimit: 1000,
    exposureLimit: 1000,
  });

  const totals = useMemo(() => {
    const openBets = allBets.filter((b) => b.status === 'Open').length;
    const turnover = allBets.reduce((sum, b) => sum + parseFloat(b.stake), 0);
    const balances = allUsers.reduce((sum, u) => sum + u.balance, 0);
    const pendingWithdrawals = withdrawalRequests.filter((r) => r.status === 'Pending').length;
    return { openBets, turnover, balances, pendingWithdrawals };
  }, [allBets, allUsers, withdrawalRequests]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allUsers.filter((u) => u.username.toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term));
  }, [allUsers, searchTerm]);
  const agentUsers = useMemo(
    () => filteredUsers.filter((u) => ['Agent', 'Master', 'Super Master', 'Senior Super', 'Admin', 'Super Admin'].includes(u.role)),
    [filteredUsers],
  );
  const playerUsers = useMemo(() => filteredUsers.filter((u) => u.role === 'Player'), [filteredUsers]);

  const openBets = allBets.filter((b) => b.status === 'Open');
  const reportRanges = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ];
  const [reportRange, setReportRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const reportData = useMemo(() => {
    const now = Date.now();
    const days = reportRange === 'daily' ? 1 : reportRange === 'weekly' ? 7 : 30;
    const from = now - days * 24 * 60 * 60 * 1000;
    const tx = walletTransactions.filter((t) => new Date(t.date).getTime() >= from);
    const deposits = tx.filter((t) => t.type === 'Deposit' && t.status !== 'Rejected').reduce((s, t) => s + Math.max(0, t.amount), 0);
    const withdrawals = tx.filter((t) => t.type === 'Withdraw' && t.status === 'Completed').reduce((s, t) => s + Math.abs(t.amount), 0);
    const settlements = tx.filter((t) => t.type === 'Settlement').reduce((s, t) => s + t.amount, 0);
    const bets = tx.filter((t) => t.type === 'Bet Placed').reduce((s, t) => s + Math.abs(t.amount), 0);
    const pnl = bets - settlements;
    return { deposits, withdrawals, settlements, bets, pnl, count: tx.length };
  }, [walletTransactions, reportRange]);

  const exportReportCsv = () => {
    const rows = [
      ['Range', reportRange],
      ['Transactions', String(reportData.count)],
      ['Deposits', reportData.deposits.toFixed(2)],
      ['Withdrawals', reportData.withdrawals.toFixed(2)],
      ['Settlements', reportData.settlements.toFixed(2)],
      ['Bets', reportData.bets.toFixed(2)],
      ['PNL', reportData.pnl.toFixed(2)],
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-report-${reportRange}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const submitCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.username || !createForm.password) return;
    onCreateUser({
      username: createForm.username,
      password: createForm.password,
      role: createForm.role,
      parentId: createForm.parentId || currentUser.id,
      balance: createForm.creditLimit,
      exposure: 0,
      creditLimit: createForm.creditLimit,
      exposureLimit: createForm.exposureLimit,
      commission: createForm.commission,
      maxBetLimit: createForm.maxBetLimit,
      isBlocked: false,
      twoFactorEnabled: false,
    });
    setCreateForm({ username: '', password: '', role: 'Senior Super', parentId: currentUser.id, creditLimit: 0, commission: 0, maxBetLimit: 1000, exposureLimit: 1000 });
  };

  const switchTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const tabs: { id: AdminTab; icon: string; label: string }[] = [
    { id: 'overview', icon: 'dashboard', label: 'Overview' },
    { id: 'hierarchy', icon: 'account_tree', label: 'Hierarchy' },
    { id: 'risk', icon: 'policy', label: 'Risk' },
    { id: 'live-bets', icon: 'sensors', label: 'Live Bets' },
    { id: 'bets', icon: 'gavel', label: 'Settlements' },
    { id: 'payments', icon: 'payments', label: 'Payments' },
    { id: 'reports', icon: 'assessment', label: 'Reports' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];

  const inputClass = 'p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex flex-col">
      {/* ===== HEADER ===== */}
      <header className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1 hover:bg-white/10 rounded">
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
            <div className="font-black text-xl tracking-tighter italic">
              upx<span className="text-bet-yellow">365</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <span className="material-symbols-outlined text-red-400 text-lg">admin_panel_settings</span>
              <span className="text-sm font-bold">Admin Panel</span>
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-bold">{currentUser.role}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <div className="text-bet-yellow font-black text-sm leading-tight">${currentUser.balance.toFixed(2)}</div>
              <div className="text-[10px] text-gray-400">{currentUser.username}</div>
            </div>
            <button onClick={onLogout} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/80 transition active:scale-95">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>
        <div className="sm:hidden px-4 pb-2 flex items-center gap-2 text-xs text-gray-400">
          <span className="material-symbols-outlined text-red-400 text-sm">admin_panel_settings</span>
          Admin Panel
          <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">{currentUser.role}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* ===== SIDEBAR ===== */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
        )}
        <nav className={`
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700
          flex flex-col transition-transform duration-200 ease-out pt-14 lg:pt-0
        `}>
          <div className="lg:hidden p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="font-black text-lg tracking-tighter italic text-gray-900 dark:text-white">
              upx<span className="text-bet-yellow">365</span>
            </div>
          </div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`p-4 flex items-center gap-3 transition text-sm ${
                activeTab === tab.id
                  ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-r-4 border-red-600 dark:border-red-400 font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'live-bets' && openBets.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{openBets.length}</span>
              )}
              {tab.id === 'payments' && totals.pendingWithdrawals > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{totals.pendingWithdrawals}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <StatCard icon="group" label="Total Users" value={String(allUsers.length)} color="blue" />
            <StatCard icon="gavel" label="Open Bets" value={String(totals.openBets)} color="red" />
            <StatCard icon="trending_up" label="Turnover" value={`$${totals.turnover.toFixed(2)}`} color="green" />
            <StatCard icon="account_balance" label="Total Balance" value={`$${totals.balances.toFixed(2)}`} color="yellow" />
          </div>

          {/* Mobile tab pills */}
          <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 mb-4 pb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ===== OVERVIEW ===== */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon="support_agent" label="Agents" value={String(allUsers.filter(u => u.role !== 'Player').length)} color="blue" />
                <StatCard icon="person" label="Players" value={String(allUsers.filter(u => u.role === 'Player').length)} color="green" />
                <StatCard icon="block" label="Blocked" value={String(allUsers.filter(u => u.isBlocked).length)} color="red" />
                <StatCard icon="pending" label="Pending W/D" value={String(totals.pendingWithdrawals)} color="yellow" />
              </div>
            </div>
          )}

          {/* ===== HIERARCHY ===== */}
          {activeTab === 'hierarchy' && (
            <div className="space-y-4">
              {/* Create User Form */}
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400">person_add</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Create User</h3>
                    <p className="text-xs text-gray-500">Create any role level in the hierarchy</p>
                  </div>
                </div>
                <form onSubmit={submitCreateUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <input value={createForm.username} onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })} placeholder="Username" className={inputClass} />
                  <input type="password" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} placeholder="Password" className={inputClass} />
                  <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as UserRole })} className={inputClass}>
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <select value={createForm.parentId} onChange={(e) => setCreateForm({ ...createForm, parentId: e.target.value })} className={inputClass}>
                    {allUsers.map((u) => <option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
                  </select>
                  <input type="number" value={createForm.creditLimit} onChange={(e) => setCreateForm({ ...createForm, creditLimit: parseFloat(e.target.value || '0') })} placeholder="Credit Limit" className={inputClass} />
                  <input type="number" value={createForm.commission} onChange={(e) => setCreateForm({ ...createForm, commission: parseFloat(e.target.value || '0') })} placeholder="Commission %" className={inputClass} />
                  <input type="number" value={createForm.maxBetLimit} onChange={(e) => setCreateForm({ ...createForm, maxBetLimit: parseFloat(e.target.value || '0') })} placeholder="Max Bet" className={inputClass} />
                  <input type="number" value={createForm.exposureLimit} onChange={(e) => setCreateForm({ ...createForm, exposureLimit: parseFloat(e.target.value || '0') })} placeholder="Exposure Limit" className={inputClass} />
                  <div className="sm:col-span-2 lg:col-span-4">
                    <button className="bg-primary text-white py-2.5 px-6 rounded-lg font-bold text-sm hover:bg-primary/90 transition active:scale-95">Create User</button>
                  </div>
                </form>
              </div>

              {/* Search */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-lg">search</span>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Agents Table - Desktop */}
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Agents & Upper Levels ({agentUsers.length})</h3>
                </div>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-black/20 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-right">Balance</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Fund / Debit</th>
                        <th className="p-3 text-center">Block</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {agentUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="p-3">
                            <div className="font-bold text-gray-900 dark:text-white">{u.username}</div>
                            <div className="text-[10px] text-gray-500">Parent: {allUsers.find(p => p.id === u.parentId)?.username || 'None'}</div>
                          </td>
                          <td className="p-3"><span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-medium">{u.role}</span></td>
                          <td className="p-3 text-right font-mono font-bold text-green-600 dark:text-green-400">${u.balance.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                              {u.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-1">
                              <input type="number" placeholder="Amt" value={fundInput[u.id] || ''} onChange={(e) => setFundInput({ ...fundInput, [u.id]: e.target.value })} className="w-20 text-xs p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-center" />
                              <button onClick={() => { const amt = parseFloat(fundInput[u.id] || '0'); if (amt > 0) onFundUser(u.id, amt); }} className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded" title="Fund">
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                              </button>
                              <button onClick={() => { const amt = parseFloat(fundInput[u.id] || '0'); if (amt > 0) onFundUser(u.id, -amt); }} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Debit">
                                <span className="material-symbols-outlined text-lg">remove_circle</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button onClick={() => onUpdateUser(u.id, { isBlocked: !u.isBlocked })} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                              <span className="material-symbols-outlined">{u.isBlocked ? 'check_circle' : 'block'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {agentUsers.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-500">No agents found.</td></tr>}
                    </tbody>
                  </table>
                </div>
                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                  {agentUsers.map((u) => (
                    <div key={u.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                            <span className="text-red-600 dark:text-red-400 font-black text-xs">{u.username.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="font-bold text-sm text-gray-900 dark:text-white">{u.username}</div>
                            <span className="text-[10px] text-gray-500">{u.role} | ${u.balance.toFixed(2)}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="Amount" value={fundInput[u.id] || ''} onChange={(e) => setFundInput({ ...fundInput, [u.id]: e.target.value })} className="flex-1 text-xs p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20" />
                        <button onClick={() => { const amt = parseFloat(fundInput[u.id] || '0'); if (amt > 0) onFundUser(u.id, amt); }} className="px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-lg active:scale-95">Fund</button>
                        <button onClick={() => { const amt = parseFloat(fundInput[u.id] || '0'); if (amt > 0) onFundUser(u.id, -amt); }} className="px-3 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg active:scale-95">Debit</button>
                        <button onClick={() => onUpdateUser(u.id, { isBlocked: !u.isBlocked })} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg active:scale-95">
                          <span className="material-symbols-outlined text-sm">{u.isBlocked ? 'check_circle' : 'block'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Players */}
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">Players ({playerUsers.length})</h3>
                </div>
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-black/20 text-xs uppercase text-gray-500">
                      <tr>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Agent</th>
                        <th className="p-3 text-right">Balance</th>
                        <th className="p-3 text-right">Exposure</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-center">Fund / Debit</th>
                        <th className="p-3 text-center">Block</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {playerUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="p-3 font-bold text-gray-900 dark:text-white">{u.username}</td>
                          <td className="p-3 text-xs text-gray-500">{allUsers.find(p => p.id === u.parentId)?.username || 'None'}</td>
                          <td className="p-3 text-right font-mono font-bold text-green-600 dark:text-green-400">${u.balance.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono text-red-500">${u.exposure.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {u.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center justify-center gap-1">
                              <input type="number" placeholder="Amt" value={fundInput[u.id] || ''} onChange={(e) => setFundInput({ ...fundInput, [u.id]: e.target.value })} className="w-20 text-xs p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-center" />
                              <button onClick={() => { const amt = parseFloat(fundInput[u.id] || '0'); if (amt > 0) onFundUser(u.id, amt); }} className="p-1 text-green-600 hover:bg-green-50 rounded"><span className="material-symbols-outlined text-lg">add_circle</span></button>
                              <button onClick={() => { const amt = parseFloat(fundInput[u.id] || '0'); if (amt > 0) onFundUser(u.id, -amt); }} className="p-1 text-red-500 hover:bg-red-50 rounded"><span className="material-symbols-outlined text-lg">remove_circle</span></button>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button onClick={() => onUpdateUser(u.id, { isBlocked: !u.isBlocked })} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                              <span className="material-symbols-outlined">{u.isBlocked ? 'check_circle' : 'block'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {playerUsers.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-500">No players found.</td></tr>}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
                  {playerUsers.map((u) => (
                    <div key={u.id} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-sm text-gray-900 dark:text-white">{u.username}</div>
                          <span className="text-[10px] text-gray-500">Agent: {allUsers.find(p => p.id === u.parentId)?.username || 'None'}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {u.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                        <div className="bg-gray-50 dark:bg-black/20 p-2 rounded-lg">
                          <div className="text-gray-500 text-[10px]">Balance</div>
                          <div className="font-bold text-green-600">${u.balance.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-black/20 p-2 rounded-lg">
                          <div className="text-gray-500 text-[10px]">Exposure</div>
                          <div className="font-bold text-red-500">${u.exposure.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" placeholder="Amount" value={fundInput[u.id] || ''} onChange={(e) => setFundInput({ ...fundInput, [u.id]: e.target.value })} className="flex-1 text-xs p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20" />
                        <button onClick={() => { const amt = parseFloat(fundInput[u.id] || '0'); if (amt > 0) onFundUser(u.id, amt); }} className="px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-lg active:scale-95">Fund</button>
                        <button onClick={() => { const amt = parseFloat(fundInput[u.id] || '0'); if (amt > 0) onFundUser(u.id, -amt); }} className="px-3 py-2 bg-orange-500 text-white text-xs font-bold rounded-lg active:scale-95">Debit</button>
                        <button onClick={() => onUpdateUser(u.id, { isBlocked: !u.isBlocked })} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg active:scale-95">
                          <span className="material-symbols-outlined text-sm">{u.isBlocked ? 'check_circle' : 'block'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== RISK ===== */}
          {activeTab === 'risk' && (
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-xs text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">shield</span>
                Adjust commission, max bet, credit and exposure limits for all users.
              </div>
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-black/20 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Commission %</th>
                      <th className="p-3 text-left">Max Bet</th>
                      <th className="p-3 text-left">Credit</th>
                      <th className="p-3 text-left">Exposure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => (
                      <tr key={u.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="p-3 font-bold">{u.username}</td>
                        <td className="p-3"><span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{u.role}</span></td>
                        <td className="p-3"><input type="number" value={u.commission} onChange={(e) => onUpdateUser(u.id, { commission: parseFloat(e.target.value || '0') })} className="w-20 p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" /></td>
                        <td className="p-3"><input type="number" value={u.maxBetLimit} onChange={(e) => onUpdateUser(u.id, { maxBetLimit: parseFloat(e.target.value || '0') })} className="w-24 p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" /></td>
                        <td className="p-3"><input type="number" value={u.creditLimit} onChange={(e) => onUpdateUser(u.id, { creditLimit: parseFloat(e.target.value || '0') })} className="w-24 p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" /></td>
                        <td className="p-3"><input type="number" value={u.exposureLimit || u.creditLimit} onChange={(e) => onUpdateUser(u.id, { exposureLimit: parseFloat(e.target.value || '0') })} className="w-24 p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== LIVE BETS ===== */}
          {activeTab === 'live-bets' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  Live Bets Monitor
                </h3>
                <span className="text-xs text-gray-500">{openBets.length} open bets</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard icon="gavel" label="Open Bets" value={String(openBets.length)} color="blue" />
                <StatCard icon="payments" label="Total Stake" value={`$${openBets.reduce((s, b) => s + parseFloat(b.stake), 0).toFixed(2)}`} color="green" />
                <StatCard icon="warning" label="Total Liability" value={`$${openBets.reduce((s, b) => s + parseFloat(b.potentialReturn), 0).toFixed(2)}`} color="red" />
                <StatCard icon="group" label="Unique Players" value={String(new Set(openBets.map(b => b.userId)).size)} color="yellow" />
              </div>

              {/* Desktop table */}
              <div className="hidden md:block bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-black/20 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="p-3 text-left">Time</th>
                      <th className="p-3 text-left">User</th>
                      <th className="p-3 text-left">Event</th>
                      <th className="p-3 text-left">Selection</th>
                      <th className="p-3 text-right">Odds</th>
                      <th className="p-3 text-right">Stake</th>
                      <th className="p-3 text-right">Return</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openBets.map(bet => (
                      <tr key={bet.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="p-3 text-xs text-gray-500">{new Date(bet.date).toLocaleString()}</td>
                        <td className="p-3 font-bold">{bet.username}</td>
                        <td className="p-3 text-xs">{bet.selections[0]?.matchTitle}</td>
                        <td className="p-3 text-xs font-medium">{bet.selections[0]?.selectionName}</td>
                        <td className="p-3 text-right font-mono">{bet.totalOdds}</td>
                        <td className="p-3 text-right font-mono font-bold">${bet.stake}</td>
                        <td className="p-3 text-right font-mono text-red-500">${bet.potentialReturn}</td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => onSettleBet(bet.id, 'Won')} className="px-2 py-1 bg-green-500 text-white rounded text-xs font-bold">Win</button>
                            <button onClick={() => onSettleBet(bet.id, 'Lost')} className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">Lose</button>
                            <button onClick={() => onVoidBet(bet.id)} className="px-2 py-1 bg-gray-600 text-white rounded text-xs font-bold">Void</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {openBets.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-gray-500">No live bets at the moment.</td></tr>}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {openBets.map(bet => (
                  <div key={bet.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{bet.username}</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">Open</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">{bet.selections[0]?.selectionName} - {bet.selections[0]?.matchTitle}</div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span>Stake: <strong>${bet.stake}</strong></span>
                      <span>Return: <strong>${bet.potentialReturn}</strong></span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => onSettleBet(bet.id, 'Won')} className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-lg active:scale-95">Win</button>
                      <button onClick={() => onSettleBet(bet.id, 'Lost')} className="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-lg active:scale-95">Lose</button>
                      <button onClick={() => onVoidBet(bet.id)} className="flex-1 py-2 bg-gray-600 text-white text-xs font-bold rounded-lg active:scale-95">Void</button>
                    </div>
                  </div>
                ))}
                {openBets.length === 0 && <div className="text-center py-12 text-gray-500 text-sm">No live bets.</div>}
              </div>

              {/* Recent bet history */}
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-sm">Recent Bet History</h4>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto">
                  {allBets.slice(0, 50).map(bet => (
                    <div key={bet.id} className="px-4 py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold">{bet.username}</span>
                        <span className="text-gray-500 ml-2">{bet.selections[0]?.matchTitle}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">${bet.stake}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bet.status === 'Open' ? 'bg-blue-100 text-blue-700' :
                          bet.status === 'Won' ? 'bg-green-100 text-green-700' :
                          bet.status === 'Lost' ? 'bg-red-100 text-red-700' :
                          bet.status === 'Voided' ? 'bg-gray-200 text-gray-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{bet.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== SETTLEMENTS ===== */}
          {activeTab === 'bets' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-sm">Settle Open Bets ({openBets.length})</h3>
                </div>
                {openBets.length > 0 ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {openBets.map((bet) => (
                      <div key={bet.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-sm text-gray-900 dark:text-white">{bet.username}</div>
                          <div className="text-xs text-gray-500">{bet.selections[0]?.matchTitle} — {bet.selections[0]?.selectionName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">Stake <strong>${bet.stake}</strong> | Return <strong>${bet.potentialReturn}</strong></div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => onSettleBet(bet.id, 'Won')} className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-bold active:scale-95">Settle Win</button>
                          <button onClick={() => onSettleBet(bet.id, 'Lost')} className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-bold active:scale-95">Settle Lose</button>
                          <button onClick={() => onVoidBet(bet.id)} className="px-3 py-2 bg-gray-600 text-white rounded-lg text-xs font-bold active:scale-95">Void</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500 text-sm">No open bets to settle.</div>
                )}
              </div>
            </div>
          )}

          {/* ===== PAYMENTS ===== */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              {/* Payment Gateways */}
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-sm">Payment Gateways</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paymentGateways.map((gw) => (
                    <div key={gw.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary dark:text-bet-yellow">credit_card</span>
                          <div>
                            <div className="font-bold text-sm">{gw.name}</div>
                            <span className="text-[10px] text-gray-500">{gw.type}</span>
                          </div>
                        </div>
                        <button onClick={() => onUpdateGateway(gw.id, { enabled: !gw.enabled })} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${gw.enabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                          {gw.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold uppercase">Fee %</label>
                          <input type="number" value={gw.feePercent} onChange={(e) => onUpdateGateway(gw.id, { feePercent: parseFloat(e.target.value || '0') })} className="w-full p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold uppercase">Min</label>
                          <input type="number" value={gw.minAmount} onChange={(e) => onUpdateGateway(gw.id, { minAmount: parseFloat(e.target.value || '0') })} className="w-full p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 font-bold uppercase">Max</label>
                          <input type="number" value={gw.maxAmount} onChange={(e) => onUpdateGateway(gw.id, { maxAmount: parseFloat(e.target.value || '0') })} className="w-full p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Withdrawal Approvals */}
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-sm">Withdrawal Requests ({withdrawalRequests.length})</h3>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
                  {withdrawalRequests.map((req) => (
                    <div key={req.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-bold text-sm">{req.username}</div>
                          <div className="text-xs text-gray-500">{req.network} | {new Date(req.requestedAt).toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-sm">${req.amount.toFixed(2)}</div>
                          <span className={`text-[10px] font-bold ${req.status === 'Pending' ? 'text-orange-600' : req.status === 'Approved' ? 'text-green-600' : 'text-red-500'}`}>{req.status}</span>
                        </div>
                      </div>
                      {req.status === 'Pending' && (
                        <div className="space-y-2">
                          <input value={noteMap[req.id] || ''} onChange={(e) => setNoteMap({ ...noteMap, [req.id]: e.target.value })} placeholder="Admin note (optional)" className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" />
                          <div className="flex gap-2">
                            <button onClick={() => onApproveWithdrawal(req.id, noteMap[req.id] || '')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold active:scale-95">Approve</button>
                            <button onClick={() => onRejectWithdrawal(req.id, noteMap[req.id] || '')} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold active:scale-95">Reject</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {withdrawalRequests.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">No withdrawal requests.</div>}
                </div>
              </div>
            </div>
          )}

          {/* ===== REPORTS ===== */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">Profit/Loss Reports</h3>
                  <div className="flex gap-1">
                    {reportRanges.map((r) => (
                      <button key={r.key} onClick={() => setReportRange(r.key as 'daily' | 'weekly' | 'monthly')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${reportRange === r.key ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20'}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
                  <StatCard icon="arrow_downward" label="Deposits" value={`$${reportData.deposits.toFixed(2)}`} color="green" />
                  <StatCard icon="arrow_upward" label="Withdrawals" value={`$${reportData.withdrawals.toFixed(2)}`} color="red" />
                  <StatCard icon="receipt_long" label="Bets" value={`$${reportData.bets.toFixed(2)}`} color="blue" />
                  <StatCard icon="gavel" label="Settlements" value={`$${reportData.settlements.toFixed(2)}`} color="yellow" />
                  <StatCard icon="trending_up" label="PNL" value={`$${reportData.pnl.toFixed(2)}`} color={reportData.pnl >= 0 ? 'green' : 'red'} />
                </div>
                <button onClick={exportReportCsv} className="px-4 py-2.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition active:scale-95 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export Report CSV
                </button>
              </div>

              {/* Per-user P&L */}
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-bold text-sm">Per-User Profit/Loss Breakdown</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 dark:bg-black/20 uppercase text-gray-500">
                      <tr>
                        <th className="p-3 text-left">User</th>
                        <th className="p-3 text-left">Role</th>
                        <th className="p-3 text-right">Bets</th>
                        <th className="p-3 text-right">Stake</th>
                        <th className="p-3 text-right">Won</th>
                        <th className="p-3 text-right">Lost</th>
                        <th className="p-3 text-right">Voided</th>
                        <th className="p-3 text-right">Net P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map(user => {
                        const userBets = allBets.filter(b => b.userId === user.id);
                        if (userBets.length === 0) return null;
                        const totalStake = userBets.reduce((s, b) => s + parseFloat(b.stake), 0);
                        const wonBets = userBets.filter(b => b.status === 'Won');
                        const lostBets = userBets.filter(b => b.status === 'Lost');
                        const voidedBets = userBets.filter(b => b.status === 'Voided');
                        const wonPayout = wonBets.reduce((s, b) => s + parseFloat(b.potentialReturn), 0);
                        const lostStake = lostBets.reduce((s, b) => s + parseFloat(b.stake), 0);
                        const pnl = lostStake - wonPayout;
                        return (
                          <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5">
                            <td className="p-3 font-bold">{user.username}</td>
                            <td className="p-3"><span className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px]">{user.role}</span></td>
                            <td className="p-3 text-right">{userBets.length}</td>
                            <td className="p-3 text-right font-mono">${totalStake.toFixed(2)}</td>
                            <td className="p-3 text-right text-green-600">{wonBets.length}</td>
                            <td className="p-3 text-right text-red-500">{lostBets.length}</td>
                            <td className="p-3 text-right text-gray-500">{voidedBets.length}</td>
                            <td className={`p-3 text-right font-mono font-bold ${pnl >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                            </td>
                          </tr>
                        );
                      }).filter(Boolean)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===== SETTINGS ===== */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
                <h3 className="font-bold text-sm mb-1">System Settings</h3>
                <p className="text-xs text-gray-500 mb-4">Frontend controls for maintenance, registration, and global limits.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SettingToggle label="Maintenance Mode" />
                  <SettingToggle label="New User Registration" defaultChecked />
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
                <h4 className="font-bold text-sm mb-3">API Keys</h4>
                <div className="space-y-3">
                  {apiKeys.map((k) => (
                    <div key={k.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-gray-500 text-lg">key</span>
                          <span className="font-bold text-sm">{k.provider}</span>
                        </div>
                        <button onClick={() => onUpdateApiKey(k.id, { enabled: !k.enabled })} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${k.enabled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                          {k.enabled ? 'Enabled' : 'Disabled'}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input value={k.key} onChange={(e) => onUpdateApiKey(k.id, { key: e.target.value })} placeholder="API Key" className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" />
                        <input value={k.secret || ''} onChange={(e) => onUpdateApiKey(k.id, { secret: e.target.value })} placeholder="API Secret" className="p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-xs" />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2">Updated: {new Date(k.updatedAt).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  };
  return (
    <div className="bg-white dark:bg-surface-dark p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.blue}`}>
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs uppercase font-bold truncate">{label}</div>
        <div className="text-lg sm:text-xl font-black text-gray-800 dark:text-white truncate">{value}</div>
      </div>
    </div>
  );
};

const SettingToggle: React.FC<{ label: string; defaultChecked?: boolean }> = ({ label, defaultChecked = false }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button onClick={() => setChecked((v) => !v)} className="flex items-center justify-between text-sm border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition">
      <span className="font-medium">{label}</span>
      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${checked ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-400'}`}>{checked ? 'ON' : 'OFF'}</span>
    </button>
  );
};

export default AdminDashboard;
