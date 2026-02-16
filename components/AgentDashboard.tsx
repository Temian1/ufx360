import React, { useState } from 'react';
import { User, UserRole, PlacedBet } from '../types';

interface AgentDashboardProps {
  currentUser: User;
  allUsers: User[];
  allBets: PlacedBet[];
  onCreateUser: (user: Omit<User, 'id'>) => void;
  onUpdateBalance: (userId: string, amount: number) => void;
  onToggleBlock: (userId: string) => void;
  onSettleBet: (betId: string, result: 'Won' | 'Lost') => void;
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
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'downline' | 'bets' | 'create' | 'commission'>('downline');
  
  // Create User Form State
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserCredit, setNewUserCredit] = useState('');

  // Filter users belonging to this agent
  const directDownline = allUsers.filter(u => u.parentId === currentUser.id);
  
  // Calculate Downline Stats
  const totalDownlineBalance = directDownline.reduce((sum, u) => sum + u.balance, 0);
  const totalDownlineExposure = directDownline.reduce((sum, u) => sum + u.exposure, 0);
  
  // Commission Calculation (Mock: 5% of total turnover)
  const downlineUserIds = directDownline.map(u => u.id);
  const downlineBets = allBets.filter(b => downlineUserIds.includes(b.userId));
  const totalTurnover = downlineBets.reduce((sum, b) => sum + parseFloat(b.stake), 0);
  const totalCommission = totalTurnover * 0.05; // 5% commission rate

  // Helper to determine next role
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg flex flex-col">
      {/* Top Bar */}
      <header className="bg-primary dark:bg-dark-header text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div>
           <h1 className="font-bold text-lg flex items-center gap-2">
             <span className="material-symbols-outlined">shield_person</span>
             Agent Panel <span className="text-xs bg-bet-yellow text-black px-2 py-0.5 rounded ml-2">{currentUser.role}</span>
           </h1>
           <p className="text-xs text-gray-300">Welcome, {currentUser.username}</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <div className="text-xs text-gray-300">My Balance</div>
                <div className="font-bold text-bet-yellow">${currentUser.balance.toFixed(2)}</div>
            </div>
            <button onClick={onLogout} className="bg-red-500/20 hover:bg-red-500 text-white p-2 rounded-full transition">
                <span className="material-symbols-outlined text-sm">logout</span>
            </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-16 sm:w-64 bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <button 
                onClick={() => setActiveTab('downline')}
                className={`p-4 flex items-center gap-3 transition ${activeTab === 'downline' ? 'bg-primary/10 text-primary dark:text-bet-yellow border-r-4 border-primary dark:border-bet-yellow' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-2xl">group</span>
                <span className="hidden sm:block font-medium">Downline</span>
            </button>
            <button 
                onClick={() => setActiveTab('create')}
                className={`p-4 flex items-center gap-3 transition ${activeTab === 'create' ? 'bg-primary/10 text-primary dark:text-bet-yellow border-r-4 border-primary dark:border-bet-yellow' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-2xl">person_add</span>
                <span className="hidden sm:block font-medium">Create User</span>
            </button>
            <button 
                onClick={() => setActiveTab('commission')}
                className={`p-4 flex items-center gap-3 transition ${activeTab === 'commission' ? 'bg-primary/10 text-primary dark:text-bet-yellow border-r-4 border-primary dark:border-bet-yellow' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-2xl">percent</span>
                <span className="hidden sm:block font-medium">Commission</span>
            </button>
            <button 
                onClick={() => setActiveTab('bets')}
                className={`p-4 flex items-center gap-3 transition ${activeTab === 'bets' ? 'bg-primary/10 text-primary dark:text-bet-yellow border-r-4 border-primary dark:border-bet-yellow' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5'}`}
            >
                <span className="material-symbols-outlined text-2xl">gavel</span>
                <span className="hidden sm:block font-medium">Risk & Bets</span>
            </button>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Total Downline Users</div>
                    <div className="text-2xl font-black text-gray-800 dark:text-white">{directDownline.length}</div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Downline Balance</div>
                    <div className="text-2xl font-black text-green-600 dark:text-green-400">${totalDownlineBalance.toFixed(2)}</div>
                </div>
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold">Current Exposure</div>
                    <div className="text-2xl font-black text-red-500">${totalDownlineExposure.toFixed(2)}</div>
                </div>
            </div>

            {/* DOWNLINE TAB */}
            {activeTab === 'downline' && (
                <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 dark:text-gray-400 font-bold uppercase text-xs">
                                <tr>
                                    <th className="p-4">Username</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4 text-right">Balance</th>
                                    <th className="p-4 text-right">Exposure</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {directDownline.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition">
                                        <td className="p-4 font-medium text-gray-900 dark:text-white">{user.username}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400">
                                            <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">{user.role}</span>
                                        </td>
                                        <td className="p-4 text-right font-mono font-bold text-green-600 dark:text-green-400">
                                            ${user.balance.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-right font-mono text-red-500">
                                            ${user.exposure.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {user.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-end gap-2">
                                            <button 
                                                onClick={() => onUpdateBalance(user.id, 100)}
                                                className="p-1 text-green-500 hover:bg-green-50 rounded" title="Deposit $100"
                                            >
                                                <span className="material-symbols-outlined">add_circle</span>
                                            </button>
                                            <button 
                                                onClick={() => onUpdateBalance(user.id, -100)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded" title="Withdraw $100"
                                            >
                                                <span className="material-symbols-outlined">remove_circle</span>
                                            </button>
                                            <button 
                                                onClick={() => onToggleBlock(user.id)}
                                                className="p-1 text-gray-500 hover:bg-gray-100 rounded" title="Block/Unblock"
                                            >
                                                <span className="material-symbols-outlined">{user.isBlocked ? 'check_circle' : 'block'}</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {directDownline.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">No users found. Create one to get started.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* CREATE USER TAB */}
            {activeTab === 'create' && (
                <div className="max-w-md mx-auto bg-white dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Create New {nextRole}</h2>
                    {nextRole ? (
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Username</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newUserUsername}
                                    onChange={e => setNewUserUsername(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-black/20 p-2 rounded border border-gray-300 dark:border-gray-600 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    required
                                    value={newUserPassword}
                                    onChange={e => setNewUserPassword(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-black/20 p-2 rounded border border-gray-300 dark:border-gray-600 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1">Initial Credit Limit</label>
                                <input 
                                    type="number" 
                                    required
                                    value={newUserCredit}
                                    onChange={e => setNewUserCredit(e.target.value)}
                                    className="w-full bg-gray-100 dark:bg-black/20 p-2 rounded border border-gray-300 dark:border-gray-600 focus:border-primary outline-none"
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-primary text-white font-bold py-2 rounded hover:bg-green-700 transition">
                                    Create User
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-red-500">You cannot create any lower level users.</p>
                    )}
                </div>
            )}

            {/* COMMISSION TAB */}
            {activeTab === 'commission' && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-lg shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 rounded-full">
                                <span className="material-symbols-outlined text-4xl">payments</span>
                            </div>
                            <div>
                                <div className="text-green-100 text-sm font-bold uppercase">Total Commission Earned</div>
                                <div className="text-4xl font-black">${totalCommission.toFixed(2)}</div>
                                <div className="text-sm text-green-100 mt-1">Based on 5% of downline turnover</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
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
                </div>
            )}

            {/* BETS / RISK TAB (Admin Only for Settlement) */}
            {activeTab === 'bets' && (
                <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded text-sm text-blue-800 dark:text-blue-200 mb-4">
                        <span className="font-bold">Risk Management:</span> Admins can manually settle open bets here to update player balances.
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
                                        {currentUser.role === 'Super Admin' || currentUser.role === 'Admin' ? (
                                            <th className="p-4 text-right">Settlement</th>
                                        ) : null}
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
                                            {(currentUser.role === 'Super Admin' || currentUser.role === 'Admin') && (
                                                <td className="p-4 flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => onSettleBet(bet.id, 'Won')}
                                                        className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600"
                                                    >
                                                        Win
                                                    </button>
                                                    <button 
                                                        onClick={() => onSettleBet(bet.id, 'Lost')}
                                                        className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600"
                                                    >
                                                        Lose
                                                    </button>
                                                </td>
                                            )}
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

        </main>
      </div>
    </div>
  );
};

export default AgentDashboard;