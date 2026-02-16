import React, { useMemo, useState } from 'react';
import { ResponsibleGamingSettings, User, WithdrawalRequest } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

type AccountTab = 'overview' | 'personal' | 'security' | 'limits';

interface AccountViewProps {
  user: User | null;
  agentProfile?: User | null;
  pendingWithdrawal?: WithdrawalRequest | null;
  rgSettings: ResponsibleGamingSettings;
  onUpdateRg: (settings: ResponsibleGamingSettings) => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  onDeposit: (amount: number, method: 'Stripe' | 'PayPal' | 'Crypto') => void;
  onWithdraw: (amount: number, method: 'Stripe' | 'PayPal' | 'Crypto') => void;
}

const tabConfig: { key: AccountTab; icon: string; label: string }[] = [
  { key: 'overview', icon: 'dashboard', label: 'Overview' },
  { key: 'personal', icon: 'person', label: 'Profile' },
  { key: 'security', icon: 'shield', label: 'Security' },
  { key: 'limits', icon: 'tune', label: 'Limits' },
];

const AccountView: React.FC<AccountViewProps> = ({ user, agentProfile, pendingWithdrawal, rgSettings, onUpdateRg, onUpdateProfile, onDeposit, onWithdraw }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AccountTab>('overview');
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: user?.country || '',
    dateOfBirth: user?.dateOfBirth || '',
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [walletAmount, setWalletAmount] = useState('50');

  const initials = useMemo(() => {
    const source = user?.fullName || user?.username || 'U';
    return source
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const handleAvatarPick = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdateProfile({ avatarUrl: String(reader.result || '') });
      setMessage(t('account.avatar_updated'));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setMessage(t('account.profile_saved'));
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityForm.newPassword || securityForm.newPassword !== securityForm.confirmPassword) {
      setMessage(t('account.password_match_error'));
      return;
    }
    onUpdateProfile({ password: securityForm.newPassword });
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setMessage(t('account.password_updated'));
  };

  if (!user) {
    return (
      <div className="p-4">
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 rounded-xl p-6 text-sm text-center text-gray-500">
          {t('account.login_prompt')}
        </div>
      </div>
    );
  }

  const available = Math.max(user.balance - user.exposure, 0);
  const quickAmounts = [50, 100, 250, 500];

  return (
    <div className="p-3 sm:p-4 space-y-3 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-16 bg-gradient-to-r from-primary to-emerald-600 dark:from-primary dark:to-emerald-700 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvc3ZnPg==')] opacity-50" />
        </div>

        <div className="px-4 pb-4 pt-3">
          {/* Avatar + Info Row */}
          <div className="flex items-end gap-3 mb-3">
            <div className="relative group shrink-0 -mt-10">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-surface-dark border-4 border-white dark:border-surface-dark overflow-hidden flex items-center justify-center shadow-lg">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                    <span className="text-lg font-black text-white">{initials}</span>
                  </div>
                )}
              </div>
              <label className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition border-2 border-white dark:border-surface-dark shadow-sm">
                <span className="material-symbols-outlined text-white text-xs">photo_camera</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarPick(e.target.files?.[0])} />
              </label>
            </div>

            <div className="flex-1 min-w-0 pb-0.5">
              <div className="flex items-center gap-2 min-w-0">
                <h2 className="text-base font-black text-gray-900 dark:text-white truncate min-w-0 flex-1">{user.fullName || user.username}</h2>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-bet-yellow/10 dark:text-bet-yellow text-[10px] font-bold uppercase tracking-wider shrink-0">
                  {user.role}
                </span>
              </div>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 text-[10px] font-bold text-green-600 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </span>
              </div>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">@{user.username} &middot; {user.email || t('account.no_email')}</p>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-2.5 text-center border border-gray-100 dark:border-white/5">
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t('account.balance')}</p>
              <p className="text-base font-black text-gray-900 dark:text-white tabular-nums mt-0.5">${user.balance.toFixed(2)}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-500/5 rounded-xl p-2.5 text-center border border-amber-100 dark:border-amber-500/10">
              <p className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">{t('account.exposure')}</p>
              <p className="text-base font-black text-amber-600 dark:text-bet-yellow tabular-nums mt-0.5">${user.exposure.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-500/5 rounded-xl p-2.5 text-center border border-green-100 dark:border-green-500/10">
              <p className="text-[9px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">Available</p>
              <p className="text-base font-black text-green-600 dark:text-green-400 tabular-nums mt-0.5">${available.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/5">
        {tabConfig.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === key
              ? 'bg-white dark:bg-surface-dark text-primary dark:text-bet-yellow shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            {/* Quick Wallet Actions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary dark:text-bet-yellow text-lg">account_balance_wallet</span>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{t('account.quick_wallet_actions')}</p>
              </div>

              {/* Deposit / Withdraw Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Deposit Card */}
                <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5 px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">support_agent</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">Deposit</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Agent-based only</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-surface-dark">
                    {agentProfile ? (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary dark:text-bet-yellow text-sm">person</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{agentProfile.fullName || agentProfile.username}</p>
                          <p className="text-[10px] text-gray-400 truncate">
                            {agentProfile.phone || agentProfile.email || 'Contact your agent'}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-gray-300 dark:text-gray-600 text-sm">chevron_right</span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-gray-400">Contact your assigned agent to deposit funds.</p>
                    )}
                  </div>
                </div>

                {/* Withdraw Card */}
                <div className="rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-500/10 dark:to-orange-500/5 px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-xl">payments</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">Withdraw</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Generate a claim code</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-surface-dark space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                        <input
                          type="number"
                          value={walletAmount}
                          onChange={(e) => setWalletAmount(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 rounded-lg bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-300/50 text-gray-900 dark:text-white"
                          placeholder="Amount"
                        />
                      </div>
                      <button
                        onClick={() => onWithdraw(parseFloat(walletAmount || '0'), 'Crypto')}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-4 py-2 text-xs font-bold transition-colors active:scale-95 flex items-center gap-1.5 shrink-0"
                      >
                        <span className="material-symbols-outlined text-sm">send</span>
                        Withdraw
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      {quickAmounts.map(amt => (
                        <button
                          key={amt}
                          onClick={() => setWalletAmount(amt.toString())}
                          className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${
                            walletAmount === amt.toString()
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Withdrawal Banner */}
              {pendingWithdrawal && (
                <div className="mt-3 rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-xl">qr_code</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Pending Withdrawal Code</p>
                      <p className="text-xl font-black tracking-[0.15em] text-orange-900 dark:text-orange-200 mt-0.5 font-mono">{pendingWithdrawal.claimCode}</p>
                      <p className="text-[11px] text-orange-700 dark:text-orange-300 mt-1">
                        Amount: <span className="font-bold">${pendingWithdrawal.amount.toFixed(2)}</span> &middot; Share this code with your agent to complete the withdrawal
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-gray-400 text-sm">speed</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Max Bet Limit</p>
                </div>
                <p className="text-sm font-black text-gray-900 dark:text-white">${user.maxBetLimit}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-gray-400 text-sm">lock</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('account.2fa')}</p>
                </div>
                <button
                  onClick={() => onUpdateProfile({ twoFactorEnabled: !user.twoFactorEnabled })}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    user.twoFactorEnabled
                    ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400'
                  }`}
                >
                  {user.twoFactorEnabled ? t('account.enabled') : t('account.disabled')}
                </button>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-gray-400 text-sm">verified_user</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Verification</p>
                </div>
                <p className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Verified
                </p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-gray-400 text-sm">group</span>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Agent</p>
                </div>
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                  {agentProfile ? (agentProfile.fullName || agentProfile.username) : 'Not assigned'}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <form onSubmit={handleSaveProfile} className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary dark:text-bet-yellow text-lg">badge</span>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Personal Information</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.full_name')}</label>
                <input
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full rounded-xl p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.email')}</label>
                <input
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full rounded-xl p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.phone')}</label>
                <input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full rounded-xl p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.country')}</label>
                <input
                  value={profileForm.country}
                  onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                  className="w-full rounded-xl p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.dob')}</label>
                <input
                  type="date"
                  value={profileForm.dateOfBirth}
                  onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                  className="w-full rounded-xl p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2 pt-1">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  {t('account.save_profile')}
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleSaveSecurity} className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary dark:text-bet-yellow text-lg">shield</span>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Security Settings</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.current_password')}</label>
                <input
                  type="password"
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  className="w-full rounded-xl p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.new_password')}</label>
                <input
                  type="password"
                  value={securityForm.newPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  className="w-full rounded-xl p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.confirm_password')}</label>
                <input
                  type="password"
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  className="w-full rounded-xl p-2.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">lock_reset</span>
                  {t('account.update_password')}
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ twoFactorEnabled: !user.twoFactorEnabled })}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-700 dark:text-gray-300 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">{user.twoFactorEnabled ? 'lock_open' : 'lock'}</span>
                  {user.twoFactorEnabled ? t('account.disable_2fa') : t('account.enable_2fa')}
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'limits' && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary dark:text-bet-yellow text-lg">tune</span>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Responsible Gaming</p>
            </div>
            <p className="text-xs text-gray-400 mb-3">Set limits to manage your betting activity responsibly.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.daily_stake_limit')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    value={rgSettings.dailyStakeLimit}
                    onChange={(e) => onUpdateRg({ ...rgSettings, dailyStakeLimit: parseFloat(e.target.value || '0') })}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.daily_loss_limit')}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    value={rgSettings.dailyLossLimit}
                    onChange={(e) => onUpdateRg({ ...rgSettings, dailyLossLimit: parseFloat(e.target.value || '0') })}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.session_reminder')}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={rgSettings.sessionReminderMinutes}
                    onChange={(e) => onUpdateRg({ ...rgSettings, sessionReminderMinutes: parseFloat(e.target.value || '0') })}
                    className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-medium">min</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      {message && (
        <div className="text-xs font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-3 flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {message}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
        <span className="material-symbols-outlined text-sm">info</span>
        {t('account.demo_notice')}
      </div>
    </div>
  );
};

export default AccountView;
