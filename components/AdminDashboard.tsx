import React, { useState } from 'react';
import { User, UserRole, PlacedBet } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'bets' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  // Overview Stats
  const totalUsers = allUsers.length;
  const totalActiveBets = allBets.filter(b => b.status === 'Open').length;
  const totalVolume = allBets.reduce((sum, b) => sum + parseFloat(b.stake), 0);
  const systemBalance = allUsers.reduce((sum, u) => sum + u.balance, 0);

  // Filter Users
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex flex-col">
      {/* Top Bar */}
      <header className="bg-gray-900 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div>
           <h1 className="font-bold text-lg flex items-center gap-2">
             <span className="material-symbols-outlined text-red-500">admin_panel_settings</span>
             Admin Control Center <span className="text-xs bg-red-600 px-2 py-0.5 rounded ml-2 uppercase">{currentUser.role}</span>
           </h1>
        </div>
        <div className="flex items-center gap-4">
            <button onClick={onLogout} className="bg-red-500/20 hover:bg-red-500 text-white px-4 py-2 rounded-full transition text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">logout</span> Logout
            </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-16 sm:w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`p-4 flex items-center gap-3 transition ${activeTab === 'overview' ? 'bg-red-50 text-red-600 dark:text-red-400 border-r-4 border-red-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-2xl">dashboard</span>
                <span className="hidden sm:block font-medium">Overview</span>
            </button>
            <button 
                onClick={() => setActiveTab('users')}
                className={`p-4 flex items-center gap-3 transition ${activeTab === 'users' ? 'bg-red-50 text-red-600 dark:text-red-400 border-r-4 border-red-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-2xl">group</span>
                <span className="hidden sm:block font-medium">User Management</span>
            </button>
            <button 
                onClick={() => setActiveTab('bets')}
                className={`p-4 flex items-center gap-3 transition ${activeTab === 'bets' ? 'bg-red-50 text-red-600 dark:text-red-400 border-r-4 border-red-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-2xl">gavel</span>
                <span className="hidden sm:block font-medium">Bet Settlement</span>
            </button>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`p-4 flex items-center gap-3 transition ${activeTab === 'settings' ? 'bg-red-50 text-red-600 dark:text-red-400 border-r-4 border-red-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-2xl">settings</span>
                <span className="hidden sm:block font-medium">System Settings</span>
            </button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                                <span className="material-symbols-outlined text-2xl">group</span>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Total Users</div>
                                <div className="text-2xl font-black text-gray-800 dark:text-white">{totalUsers}</div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                                <span className="material-symbols-outlined text-2xl">receipt_long</span>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Active Bets</div>
                                <div className="text-2xl font-black text-gray-800 dark:text-white">{totalActiveBets}</div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                <span className="material-symbols-outlined text-2xl">payments</span>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Total Volume</div>
                                <div className="text-2xl font-black text-gray-800 dark:text-white">${totalVolume.toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                                <span className="material-symbols-outlined text-2xl">account_balance</span>
                            </div>
                            <div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">System Balance</div>
                                <div className="text-2xl font-black text-gray-800 dark:text-white">${systemBalance.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Recent Activity</h3>
                            <div className="space-y-4">
                                {allBets.slice(0, 5).map(bet => (
                                    <div key={bet.id} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2">
                                        <div>
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{bet.username}</span> placed a bet
                                            <div className="text-xs text-gray-400">{new Date(bet.date).toLocaleString()}</div>
                                        </div>
                                        <div className="font-mono font-bold">${bet.stake}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">System Health</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Database Status</span>
                                    <span className="text-green-500 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Operational</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Payment Gateway</span>
                                    <span className="text-green-500 font-bold flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Operational</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Live Feed Latency</span>
                                    <span className="text-green-500 font-bold">45ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                            <input 
                                type="text" 
                                placeholder="Search users..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>
                        <select 
                            value={roleFilter} 
                            onChange={e => setRoleFilter(e.target.value)}
                            className="w-full sm:w-auto p-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="All">All Roles</option>
                            <option value="Player">Player</option>
                            <option value="Agent">Agent</option>
                            <option value="Master">Master</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex-1 overflow-auto">
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
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'Admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{user.role}</span>
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-gray-700 dark:text-gray-300">
                                            ${user.balance.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {user.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-end gap-2">
                                            <button 
                                                onClick={() => onUpdateUser(user.id, { isBlocked: !user.isBlocked })}
                                                className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 ${user.isBlocked ? 'text-green-500' : 'text-red-500'}`}
                                                title={user.isBlocked ? "Unblock" : "Block"}
                                            >
                                                <span className="material-symbols-outlined">{user.isBlocked ? 'check_circle' : 'block'}</span>
                                            </button>
                                            <button className="p-2 text-blue-500 hover:bg-blue-50 rounded" title="Edit">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* BETS TAB */}
            {activeTab === 'bets' && (
                <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900 text-sm text-yellow-800 dark:text-yellow-200 mb-4 flex items-center gap-3">
                        <span className="material-symbols-outlined">warning</span>
                        <span><strong>Warning:</strong> Settling bets is irreversible. Ensure official results are confirmed before action.</span>
                    </div>
                    
                    <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Time</th>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Selection</th>
                                        <th className="p-4 text-right">Stake</th>
                                        <th className="p-4 text-right">Potential Return</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-right">Settlement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {allBets.filter(b => b.status === 'Open').map(bet => (
                                        <tr key={bet.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="p-4 text-gray-500">{new Date(bet.date).toLocaleTimeString()}</td>
                                            <td className="p-4 font-medium text-gray-900 dark:text-white">{bet.username}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-gray-800 dark:text-gray-200">{bet.selections[0].selectionName}</div>
                                                <div className="text-xs text-gray-500">{bet.selections[0].matchTitle}</div>
                                            </td>
                                            <td className="p-4 text-right font-mono">${bet.stake}</td>
                                            <td className="p-4 text-right font-mono">${bet.potentialReturn}</td>
                                            <td className="p-4 text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">Open</span></td>
                                            <td className="p-4 flex justify-end gap-2">
                                                <button 
                                                    onClick={() => onSettleBet(bet.id, 'Won')}
                                                    className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 shadow-sm"
                                                >
                                                    Win
                                                </button>
                                                <button 
                                                    onClick={() => onSettleBet(bet.id, 'Lost')}
                                                    className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 shadow-sm"
                                                >
                                                    Lose
                                                </button>
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
                </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto bg-white dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">System Settings</h2>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <div className="font-bold text-gray-700 dark:text-gray-200">Maintenance Mode</div>
                                <div className="text-sm text-gray-500">Suspend all betting activities temporarily</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <div className="font-bold text-gray-700 dark:text-gray-200">New User Registration</div>
                                <div className="text-sm text-gray-500">Allow new users to sign up</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        <div>
                            <label className="block font-bold text-gray-700 dark:text-gray-200 mb-2">Global Max Bet Limit ($)</label>
                            <input type="number" defaultValue={5000} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-black/20" />
                        </div>

                        <div className="pt-4">
                            <button className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
