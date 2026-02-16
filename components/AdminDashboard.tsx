import React, { useState } from 'react';
import { User, PlacedBet } from '../types';

interface AdminDashboardProps {
  currentUser: User;
  allUsers: User[];
  allBets: PlacedBet[];
  onUpdateUser: (userId: string, updates: Partial<User>) => void;
  onDeleteUser?: (userId: string) => void;
  onSettleBet: (betId: string, result: 'Won' | 'Lost') => void;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  allUsers,
  allBets,
  onUpdateUser,
  onSettleBet,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bets' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalUsers = allUsers.length;
  const totalActiveBets = allBets.filter(b => b.status === 'Open').length;
  const totalVolume = allBets.reduce((sum, b) => sum + parseFloat(b.stake), 0);
  const systemBalance = allUsers.reduce((sum, u) => sum + u.balance, 0);

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const tabs = [
    { id: 'overview' as const, icon: 'dashboard', label: 'Overview' },
    { id: 'users' as const, icon: 'group', label: 'Users' },
    { id: 'bets' as const, icon: 'gavel', label: 'Settlements' },
    { id: 'settings' as const, icon: 'settings', label: 'Settings' },
  ];

  const switchTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

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
              <span className="material-symbols-outlined text-red-500 text-lg">admin_panel_settings</span>
              <span className="text-sm font-bold">Admin Control</span>
              <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded font-bold uppercase">{currentUser.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right text-xs text-gray-400">
              {currentUser.username}
            </div>
            <button onClick={onLogout} className="flex items-center gap-1.5 bg-white/10 hover:bg-red-500/80 text-white px-3 py-2 rounded-lg transition text-xs font-bold active:scale-95">
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="sm:hidden px-4 pb-2 flex items-center gap-2 text-xs text-gray-400">
          <span className="material-symbols-outlined text-red-500 text-sm">admin_panel_settings</span>
          Admin Control
          <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">{currentUser.role}</span>
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
                  ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border-r-4 border-red-600 font-bold'
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

          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <OverviewCard icon="group" label="Total Users" value={String(totalUsers)} color="blue" />
                <OverviewCard icon="receipt_long" label="Active Bets" value={String(totalActiveBets)} color="yellow" />
                <OverviewCard icon="payments" label="Total Volume" value={`$${totalVolume.toLocaleString()}`} color="green" />
                <OverviewCard icon="account_balance" label="System Balance" value={`$${systemBalance.toLocaleString()}`} color="purple" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <div className="bg-white dark:bg-surface-dark p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-sm mb-3 text-gray-800 dark:text-white">Recent Activity</h3>
                  <div className="space-y-3">
                    {allBets.slice(0, 5).map(bet => (
                      <div key={bet.id} className="flex justify-between items-center text-xs border-b border-gray-100 dark:border-gray-700 pb-2">
                        <div>
                          <span className="font-bold text-gray-700 dark:text-gray-300">{bet.username}</span> placed a bet
                          <div className="text-[10px] text-gray-400 mt-0.5">{new Date(bet.date).toLocaleString()}</div>
                        </div>
                        <div className="font-mono font-bold text-sm">${bet.stake}</div>
                      </div>
                    ))}
                    {allBets.length === 0 && <p className="text-xs text-gray-500">No recent activity.</p>}
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-white dark:bg-surface-dark p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-sm mb-3 text-gray-800 dark:text-white">System Health</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Database Status', status: 'Operational' },
                      { label: 'Payment Gateway', status: 'Operational' },
                      { label: 'Live Feed Latency', status: '45ms' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center text-xs">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="text-green-500 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== USERS TAB ===== */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Search + filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="py-2.5 px-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="All">All Roles</option>
                  <option value="Player">Player</option>
                  <option value="Agent">Agent</option>
                  <option value="Master">Master</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block bg-white dark:bg-surface-dark rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs sticky top-0">
                      <tr>
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-right">Balance</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                          <td className="p-4">
                            <div className="font-bold text-gray-900 dark:text-white">{user.username}</div>
                            <div className="text-xs text-gray-500">{user.email || 'No email'}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              user.role === 'Admin' || user.role === 'Super Admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}>{user.role}</span>
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-gray-700 dark:text-gray-300">${user.balance.toFixed(2)}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isBlocked ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                              {user.isBlocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                          <td className="p-4 flex justify-end gap-2">
                            <button
                              onClick={() => onUpdateUser(user.id, { isBlocked: !user.isBlocked })}
                              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${user.isBlocked ? 'text-green-500' : 'text-red-500'}`}
                              title={user.isBlocked ? 'Unblock' : 'Block'}
                            >
                              <span className="material-symbols-outlined text-lg">{user.isBlocked ? 'check_circle' : 'block'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {filteredUsers.map(user => (
                  <div key={user.id} className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="font-black text-xs text-gray-600 dark:text-gray-300">{user.username.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-sm">{user.username}</div>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            user.role === 'Admin' || user.role === 'Super Admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>{user.role}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Balance: <strong className="text-gray-900 dark:text-white">${user.balance.toFixed(2)}</strong></span>
                      <button
                        onClick={() => onUpdateUser(user.id, { isBlocked: !user.isBlocked })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold active:scale-95 ${user.isBlocked ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== BETS TAB ===== */}
          {activeTab === 'bets' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-xl border border-yellow-200 dark:border-yellow-900 text-xs text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span><strong>Warning:</strong> Settling bets is irreversible. Confirm official results first.</span>
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
                        <th className="p-4 text-right">Settlement</th>
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
                          <td className="p-4 flex justify-end gap-2">
                            <button onClick={() => onSettleBet(bet.id, 'Won')} className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-600">Win</button>
                            <button onClick={() => onSettleBet(bet.id, 'Lost')} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600">Lose</button>
                          </td>
                        </tr>
                      ))}
                      {allBets.filter(b => b.status === 'Open').length === 0 && (
                        <tr><td colSpan={7} className="p-8 text-center text-gray-500">No open bets to settle.</td></tr>
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
                    <div className="flex gap-2">
                      <button onClick={() => onSettleBet(bet.id, 'Won')} className="flex-1 py-2 bg-green-500 text-white text-xs font-bold rounded-lg active:scale-95">Win</button>
                      <button onClick={() => onSettleBet(bet.id, 'Lost')} className="flex-1 py-2 bg-red-500 text-white text-xs font-bold rounded-lg active:scale-95">Lose</button>
                    </div>
                  </div>
                ))}
                {allBets.filter(b => b.status === 'Open').length === 0 && (
                  <div className="text-center py-12 text-gray-500 text-sm">No open bets to settle.</div>
                )}
              </div>
            </div>
          )}

          {/* ===== SETTINGS TAB ===== */}
          {activeTab === 'settings' && (
            <div className="max-w-lg mx-auto">
              <div className="bg-white dark:bg-surface-dark p-5 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold mb-5 text-gray-800 dark:text-white">System Settings</h2>

                <div className="space-y-5">
                  <ToggleSetting
                    label="Maintenance Mode"
                    description="Suspend all betting activities temporarily"
                    defaultChecked={false}
                    color="red"
                  />
                  <ToggleSetting
                    label="New User Registration"
                    description="Allow new users to sign up"
                    defaultChecked={true}
                    color="green"
                  />

                  <div className="pt-2">
                    <label className="block font-bold text-sm text-gray-700 dark:text-gray-200 mb-2">Global Max Bet Limit ($)</label>
                    <input
                      type="number"
                      defaultValue={5000}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-black/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="pt-3">
                    <button className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-primary/90 transition active:scale-[0.98]">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const OverviewCard: React.FC<{ icon: string; label: string; value: string; color: string }> = ({ icon, label, value, color }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
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

const ToggleSetting: React.FC<{ label: string; description: string; defaultChecked: boolean; color: string }> = ({ label, description, defaultChecked, color }) => {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
      <div>
        <div className="font-bold text-sm text-gray-700 dark:text-gray-200">{label}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? (color === 'red' ? 'bg-red-600' : 'bg-green-600') : 'bg-gray-300 dark:bg-gray-600'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
};

export default AdminDashboard;
