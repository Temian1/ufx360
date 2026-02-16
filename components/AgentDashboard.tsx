import React, { useEffect, useState } from 'react';
import { User, UserRole, PlacedBet } from '../types';

interface AgentDashboardProps {
  currentUser: User;
  allUsers: User[];
  allBets: PlacedBet[];
  onCreateUser: (user: Omit<User, 'id'>) => void;
  onUpdateBalance: (userId: string, amount: number) => void;
  onToggleBlock: (userId: string) => void;
  onSettleBet: (betId: string, result: 'Won' | 'Lost') => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  onLogout: () => void;
}

const ROLES: UserRole[] = ['Super Admin', 'Admin', 'Senior Super', 'Super Master', 'Master', 'Agent', 'Player'];

const AgentDashboard: React.FC<AgentDashboardProps> = ({
  currentUser,
  allUsers,
  allBets,
  onCreateUser,
  onUpdateBalance,
  onToggleBlock,
  onSettleBet,
  onUpdateProfile,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'downline' | 'bets' | 'create' | 'commission' | 'profile'>('downline');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});

  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserCredit, setNewUserCredit] = useState('');
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser.fullName || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    country: currentUser.country || '',
  });

  useEffect(() => {
    setProfileForm({
      fullName: currentUser.fullName || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      country: currentUser.country || '',
    });
  }, [currentUser]);

  const directDownline = allUsers.filter(u => u.parentId === currentUser.id);
  const totalDownlineBalance = directDownline.reduce((sum, u) => sum + u.balance, 0);
  const totalDownlineExposure = directDownline.reduce((sum, u) => sum + u.exposure, 0);

  const downlineUserIds = directDownline.map(u => u.id);
  const downlineBets = allBets.filter(b => downlineUserIds.includes(b.userId));
  const totalTurnover = downlineBets.reduce((sum, b) => sum + parseFloat(b.stake), 0);
  const totalCommission = totalTurnover * 0.05;

  const getNextRole = (role: UserRole): UserRole | null => {
    const idx = ROLES.indexOf(role);
    if (idx >= 0 && idx < ROLES.length - 1) return ROLES[idx + 1];
    return null;
  };

  const nextRole = getNextRole(currentUser.role);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nextRole) return;
    onCreateUser({
      username: newUserUsername,
      password: newUserPassword,
      role: nextRole,
      parentId: currentUser.id,
      balance: parseFloat(newUserCredit),
      exposure: 0,
      creditLimit: parseFloat(newUserCredit),
      commission: 0,
      maxBetLimit: 1000,
      isBlocked: false
    });
    setNewUserUsername('');
    setNewUserPassword('');
    setNewUserCredit('');
    setActiveTab('downline');
  };

  const switchTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const tabs = [
    { id: 'downline' as const, icon: 'group', label: 'Downline' },
    { id: 'create' as const, icon: 'person_add', label: 'Register User' },
    { id: 'commission' as const, icon: 'percent', label: 'Commission' },
    { id: 'bets' as const, icon: 'gavel', label: 'Risk & Bets' },
    { id: 'profile' as const, icon: 'badge', label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex flex-col">
      {/* ===== HEADER ===== */}
      <header className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1 hover:bg-white/10 rounded">
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
            {/* Logo */}
            <div className="font-black text-xl tracking-tighter italic">
              upx<span className="text-bet-yellow">365</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <span className="material-symbols-outlined text-primary text-lg">shield_person</span>
              <span className="text-sm font-bold">Agent Panel</span>
              <span className="text-[10px] bg-bet-yellow text-gray-900 px-2 py-0.5 rounded font-bold">{currentUser.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Balance */}
            <div className="text-right bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <div className="text-bet-yellow font-black text-sm leading-tight">${currentUser.balance.toFixed(2)}</div>
              <div className="text-[10px] text-gray-400">{currentUser.username}</div>
            </div>
            <button onClick={onLogout} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/80 transition active:scale-95">
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>

        {/* Mobile role badge */}
        <div className="sm:hidden px-4 pb-2 flex items-center gap-2 text-xs text-gray-400">
          <span className="material-symbols-outlined text-primary text-sm">shield_person</span>
          Agent Panel
          <span className="bg-bet-yellow text-gray-900 px-1.5 py-0.5 rounded text-[10px] font-bold">{currentUser.role}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* ===== SIDEBAR (desktop always, mobile overlay) ===== */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
        )}
        <nav className={`
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700
          flex flex-col transition-transform duration-200 ease-out pt-14 lg:pt-0
        `}>
          {/* Mobile close */}
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
                  ? 'bg-primary/10 text-primary dark:text-bet-yellow border-r-4 border-primary dark:border-bet-yellow font-bold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <StatCard icon="group" label="Downline Users" value={String(directDownline.length)} color="blue" />
            <StatCard icon="account_balance" label="Downline Balance" value={`$${totalDownlineBalance.toFixed(2)}`} color="green" />
            <StatCard icon="trending_up" label="Exposure" value={`$${totalDownlineExposure.toFixed(2)}`} color="red" />
            <StatCard icon="payments" label="Commission" value={`$${totalCommission.toFixed(2)}`} color="yellow" />
          </div>

          {/* Mobile tab bar */}
          <div className="lg:hidden flex overflow-x-auto no-scrollbar gap-2 mb-4 pb-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-surface-dark text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ===== DOWNLINE TAB ===== */}
          {activeTab === 'downline' && (
            <div className="space-y-3">
              {/* Desktop table */}
              <div className="hidden md:block bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                      <tr>
                        <th className="p-4">Username</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-right">Balance</th>
                        <th className="p-4 text-right">Exposure</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Deposit/Withdraw</th>
                        <th className="p-4 text-center">Block</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {directDownline.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                          <td className="p-4 font-bold text-gray-900 dark:text-white">{user.username}</td>
                          <td className="p-4"><span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium">{user.role}</span></td>
                          <td className="p-4 text-right font-mono font-bold text-green-600 dark:text-green-400">${user.balance.toFixed(2)}</td>
                          <td className="p-4 text-right font-mono text-red-500">${user.exposure.toFixed(2)}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                              {user.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                placeholder="Amount"
                                value={depositAmounts[user.id] || ''}
                                onChange={e => setDepositAmounts({ ...depositAmounts, [user.id]: e.target.value })}
                                className="w-20 text-xs p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20 text-center"
                              />
                              <button
                                onClick={() => { const amt = parseFloat(depositAmounts[user.id] || '0'); if (amt > 0) { onUpdateBalance(user.id, amt); setDepositAmounts({ ...depositAmounts, [user.id]: '' }); } }}
                                className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded" title="Deposit"
                              >
                                <span className="material-symbols-outlined text-lg">add_circle</span>
                              </button>
                              <button
                                onClick={() => { const amt = parseFloat(depositAmounts[user.id] || '0'); if (amt > 0) { onUpdateBalance(user.id, -amt); setDepositAmounts({ ...depositAmounts, [user.id]: '' }); } }}
                                className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Withdraw"
                              >
                                <span className="material-symbols-outlined text-lg">remove_circle</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button onClick={() => onToggleBlock(user.id)} className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                              <span className="material-symbols-outlined">{user.isBlocked ? 'check_circle' : 'block'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {directDownline.length === 0 && (
                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">No users found. Register one to get started.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile card list */}
              <div className="md:hidden space-y-3">
                {directDownline.map(user => (
                  <div key={user.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <span className="text-primary dark:text-bet-yellow font-black text-sm">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{user.username}</div>
                          <span className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium">{user.role}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="bg-gray-50 dark:bg-black/20 rounded-lg p-2">
                        <div className="text-gray-500 text-[10px]">Balance</div>
                        <div className="font-bold text-green-600 dark:text-green-400">${user.balance.toFixed(2)}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-black/20 rounded-lg p-2">
                        <div className="text-gray-500 text-[10px]">Exposure</div>
                        <div className="font-bold text-red-500">${user.exposure.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={depositAmounts[user.id] || ''}
                        onChange={e => setDepositAmounts({ ...depositAmounts, [user.id]: e.target.value })}
                        className="flex-1 text-xs p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-black/20"
                      />
                      <button
                        onClick={() => { const amt = parseFloat(depositAmounts[user.id] || '0'); if (amt > 0) { onUpdateBalance(user.id, amt); setDepositAmounts({ ...depositAmounts, [user.id]: '' }); } }}
                        className="px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-lg active:scale-95"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => { const amt = parseFloat(depositAmounts[user.id] || '0'); if (amt > 0) { onUpdateBalance(user.id, -amt); setDepositAmounts({ ...depositAmounts, [user.id]: '' }); } }}
                        className="px-3 py-2 bg-red-500 text-white text-xs font-bold rounded-lg active:scale-95"
                      >
                        W/D
                      </button>
                      <button onClick={() => onToggleBlock(user.id)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg active:scale-95">
                        <span className="material-symbols-outlined text-sm">{user.isBlocked ? 'check_circle' : 'block'}</span>
                      </button>
                    </div>
                  </div>
                ))}
                {directDownline.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2 block">group_off</span>
                    No users yet. Register one to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== CREATE / REGISTER USER TAB ===== */}
          {activeTab === 'create' && (
            <div className="max-w-lg mx-auto">
              <div className="bg-white dark:bg-surface-dark rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">person_add</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Register New {nextRole}</h2>
                    <p className="text-xs text-gray-500">Create a new user under your hierarchy</p>
                  </div>
                </div>

                {nextRole ? (
                  <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Username</label>
                      <input
                        type="text"
                        required
                        value={newUserUsername}
                        onChange={e => setNewUserUsername(e.target.value)}
                        placeholder="Enter username"
                        className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Password</label>
                      <input
                        type="password"
                        required
                        value={newUserPassword}
                        onChange={e => setNewUserPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Initial Credit Limit</label>
                      <input
                        type="number"
                        required
                        value={newUserCredit}
                        onChange={e => setNewUserCredit(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                      />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition active:scale-[0.98] text-sm">
                      Register User
                    </button>
                  </form>
                ) : (
                  <p className="text-red-500 text-sm">You cannot create any lower level users.</p>
                )}
              </div>
            </div>
          )}

          {/* ===== COMMISSION TAB ===== */}
          {activeTab === 'commission' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary to-emerald-600 text-white p-5 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-3xl">payments</span>
                  </div>
                  <div>
                    <div className="text-white/80 text-xs font-bold uppercase">Total Commission Earned</div>
                    <div className="text-3xl sm:text-4xl font-black">${totalCommission.toFixed(2)}</div>
                    <div className="text-xs text-white/70 mt-0.5">5% of downline turnover (${totalTurnover.toFixed(2)})</div>
                  </div>
                </div>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-800 dark:text-white">Turnover Breakdown</h3>
                </div>
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                    <tr>
                      <th className="p-4">Downline User</th>
                      <th className="p-4 text-right">Total Bets</th>
                      <th className="p-4 text-right">Total Turnover</th>
                      <th className="p-4 text-right">Commission (5%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {directDownline.map(user => {
                      const userBets = allBets.filter(b => b.userId === user.id);
                      const turnover = userBets.reduce((sum, b) => sum + parseFloat(b.stake), 0);
                      const commission = turnover * 0.05;
                      return (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="p-4 font-medium text-gray-900 dark:text-white">{user.username}</td>
                          <td className="p-4 text-right">{userBets.length}</td>
                          <td className="p-4 text-right font-mono">${turnover.toFixed(2)}</td>
                          <td className="p-4 text-right font-mono text-green-600 font-bold">${commission.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    {directDownline.length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500">No downline users found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {directDownline.map(user => {
                  const userBets = allBets.filter(b => b.userId === user.id);
                  const turnover = userBets.reduce((sum, b) => sum + parseFloat(b.stake), 0);
                  const commission = turnover * 0.05;
                  return (
                    <div key={user.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{user.username}</span>
                        <span className="text-xs text-gray-500">{userBets.length} bets</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-gray-50 dark:bg-black/20 p-2 rounded-lg">
                          <div className="text-gray-500 text-[10px]">Turnover</div>
                          <div className="font-bold">${turnover.toFixed(2)}</div>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                          <div className="text-gray-500 text-[10px]">Commission</div>
                          <div className="font-bold text-green-600">${commission.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== BETS / RISK TAB ===== */}
          {activeTab === 'bets' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl text-xs text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                <span><strong>Risk Management:</strong> Settle open bets to update player balances.</span>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                      <tr>
                        <th className="p-4">Time</th>
                        <th className="p-4">User</th>
                        <th className="p-4">Selection</th>
                        <th className="p-4 text-right">Stake</th>
                        <th className="p-4 text-right">Return</th>
                        <th className="p-4 text-center">Status</th>
                        {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && (
                          <th className="p-4 text-right">Settle</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {allBets.filter(b => b.status === 'Open').map(bet => (
                        <tr key={bet.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                          <td className="p-4 text-gray-500 text-xs">{new Date(bet.date).toLocaleTimeString()}</td>
                          <td className="p-4 font-medium text-gray-900 dark:text-white">{bet.username}</td>
                          <td className="p-4">
                            <div className="font-bold text-gray-800 dark:text-gray-200 text-xs">{bet.selections[0].selectionName}</div>
                            <div className="text-[10px] text-gray-500">{bet.selections[0].matchTitle}</div>
                          </td>
                          <td className="p-4 text-right font-mono">${bet.stake}</td>
                          <td className="p-4 text-right font-mono">${bet.potentialReturn}</td>
                          <td className="p-4 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Open</span></td>
                          {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && (
                            <td className="p-4 flex justify-end gap-2">
                              <button onClick={() => onSettleBet(bet.id, 'Won')} className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600">Win</button>
                              <button onClick={() => onSettleBet(bet.id, 'Lost')} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600">Lose</button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {allBets.filter(b => b.status === 'Open').length === 0 && (
                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">No open bets.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {allBets.filter(b => b.status === 'Open').map(bet => (
                  <div key={bet.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">{bet.username}</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">Open</span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {bet.selections[0].selectionName} - {bet.selections[0].matchTitle}
                    </div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span>Stake: <strong>${bet.stake}</strong></span>
                      <span>Return: <strong>${bet.potentialReturn}</strong></span>
                    </div>
                    {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && (
                      <div className="flex gap-2">
                        <button onClick={() => onSettleBet(bet.id, 'Won')} className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-lg active:scale-95">Win</button>
                        <button onClick={() => onSettleBet(bet.id, 'Lost')} className="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-lg active:scale-95">Lose</button>
                      </div>
                    )}
                  </div>
                ))}
                {allBets.filter(b => b.status === 'Open').length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-sm">No open bets to settle.</div>
                )}
              </div>
            </div>
          )}

          {/* ===== PROFILE TAB ===== */}
          {activeTab === 'profile' && (
            <div className="max-w-lg mx-auto">
              <div className="bg-white dark:bg-surface-dark rounded-xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-black text-lg">
                      {(currentUser.fullName || currentUser.username || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Agent Profile</h2>
                    <p className="text-xs text-gray-500">{currentUser.username} - {currentUser.role}</p>
                  </div>
                </div>

                <form
                  className="space-y-4"
                  onSubmit={(e) => { e.preventDefault(); onUpdateProfile(profileForm); }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Full Name</label>
                      <input
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Phone</label>
                      <input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Country</label>
                      <input
                        value={profileForm.country}
                        onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-black/20 p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary outline-none text-sm"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition active:scale-[0.98] text-sm">
                    Save Profile
                  </button>
                </form>
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

export default AgentDashboard;
