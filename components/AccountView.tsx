import React, { useMemo, useState } from 'react';
import { ResponsibleGamingSettings, User } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

type AccountTab = 'overview' | 'personal' | 'security' | 'limits';

interface AccountViewProps {
  user: User | null;
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

const AccountView: React.FC<AccountViewProps> = ({ user, rgSettings, onUpdateRg, onUpdateProfile, onDeposit, onWithdraw }) => {
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
  const [walletMethod, setWalletMethod] = useState<'Stripe' | 'PayPal' | 'Crypto'>('Stripe');

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

  return (
    <div className="p-3 sm:p-4 space-y-3 animate-in fade-in duration-300">
      {/* Compact Profile Card - no shadows */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="p-3 sm:p-4 flex items-center gap-3">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 overflow-hidden flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-black text-gray-500 dark:text-gray-400">{initials}</span>
              )}
            </div>
            <label className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition border border-white dark:border-surface-dark">
              <span className="material-symbols-outlined text-white text-[10px]">photo_camera</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarPick(e.target.files?.[0])} />
            </label>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-gray-900 dark:text-white truncate">{user.fullName || user.username}</h2>
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary dark:text-bet-yellow text-[9px] font-bold uppercase tracking-wider shrink-0">
                {user.role}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 truncate">@{user.username} &middot; {user.email || t('account.no_email')}</p>
          </div>

          {/* Status */}
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 dark:bg-green-500/10 text-[10px] font-bold text-green-600 dark:text-green-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Active
          </span>
        </div>

        {/* Quick Balance Strip */}
        <div className="grid grid-cols-3 border-t border-gray-100 dark:border-white/5 divide-x divide-gray-100 dark:divide-white/5">
          <div className="px-3 py-2 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t('account.balance')}</p>
            <p className="text-sm font-black text-gray-900 dark:text-white tabular-nums">${user.balance.toFixed(2)}</p>
          </div>
          <div className="px-3 py-2 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{t('account.exposure')}</p>
            <p className="text-sm font-black text-bet-yellow tabular-nums">${user.exposure.toFixed(2)}</p>
          </div>
          <div className="px-3 py-2 text-center">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Available</p>
            <p className="text-sm font-black text-green-600 dark:text-green-400 tabular-nums">${available.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation - no shadows */}
      <div className="flex gap-1 bg-gray-50 dark:bg-white/5 rounded-xl p-1 border border-gray-100 dark:border-white/5">
        {tabConfig.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === key
              ? 'bg-white dark:bg-surface-dark text-primary dark:text-bet-yellow'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span className="material-symbols-outlined text-base">{icon}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Content - no shadows */}
      <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4">
            {/* Quick Wallet */}
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-3">{t('account.quick_wallet_actions')}</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">$</span>
                  <input
                    type="number"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={walletMethod}
                  onChange={(e) => setWalletMethod(e.target.value as 'Stripe' | 'PayPal' | 'Crypto')}
                  className="px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none text-gray-700 dark:text-gray-300"
                >
                  <option value="Stripe">Stripe</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Crypto">Crypto</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => onDeposit(parseFloat(walletAmount || '0'), walletMethod)}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-colors active:scale-95 flex items-center gap-1.5 justify-center"
                  >
                    <span className="material-symbols-outlined text-sm">add_card</span>
                    {t('account.deposit')}
                  </button>
                  <button
                    onClick={() => onWithdraw(parseFloat(walletAmount || '0'), walletMethod)}
                    className="flex-1 sm:flex-none bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors active:scale-95 flex items-center gap-1.5 justify-center border border-gray-200 dark:border-white/10"
                  >
                    <span className="material-symbols-outlined text-sm">payments</span>
                    {t('account.withdraw')}
                  </button>
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Max Bet Limit</p>
                <p className="text-sm font-black text-gray-900 dark:text-white">${user.maxBetLimit}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{t('account.2fa')}</p>
                <button
                  onClick={() => onUpdateProfile({ twoFactorEnabled: !user.twoFactorEnabled })}
                  className={`mt-0.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    user.twoFactorEnabled
                    ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                    : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400'
                  }`}
                >
                  {user.twoFactorEnabled ? t('account.enabled') : t('account.disabled')}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <form onSubmit={handleSaveProfile} className="p-4">
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
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors active:scale-95"
                >
                  {t('account.save_profile')}
                </button>
              </div>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handleSaveSecurity} className="p-4">
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
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors active:scale-95"
                >
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
