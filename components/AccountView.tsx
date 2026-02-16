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
      <div className="p-3">
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-4 text-sm">
          {t('account.login_prompt')}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-black text-gray-700 dark:text-gray-200">{initials}</span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{user.fullName || user.username}</h2>
              <div className="text-xs text-gray-500">@{user.username}</div>
              <div className="text-xs text-gray-500">{user.email || t('account.no_email')}</div>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded bg-gray-100 dark:bg-black/20 text-xs font-bold cursor-pointer">
            <span className="material-symbols-outlined text-sm">photo_camera</span>
            {t('account.change_avatar')}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarPick(e.target.files?.[0])} />
          </label>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-1 flex overflow-x-auto no-scrollbar gap-1">
        <button onClick={() => setActiveTab('overview')} className={`px-3 py-2 rounded text-xs font-bold ${activeTab === 'overview' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'}`}>{t('account.tab_overview')}</button>
        <button onClick={() => setActiveTab('personal')} className={`px-3 py-2 rounded text-xs font-bold ${activeTab === 'personal' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'}`}>{t('account.tab_personal')}</button>
        <button onClick={() => setActiveTab('security')} className={`px-3 py-2 rounded text-xs font-bold ${activeTab === 'security' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'}`}>{t('account.tab_security')}</button>
        <button onClick={() => setActiveTab('limits')} className={`px-3 py-2 rounded text-xs font-bold ${activeTab === 'limits' ? 'bg-primary text-white' : 'text-gray-600 dark:text-gray-300'}`}>{t('account.tab_limits')}</button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="text-xs text-gray-500">{t('account.role')}</div>
            <div className="text-sm font-bold">{user.role}</div>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="text-xs text-gray-500">{t('account.balance')}</div>
            <div className="text-sm font-bold">${user.balance.toFixed(2)}</div>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="text-xs text-gray-500">{t('account.exposure')}</div>
            <div className="text-sm font-bold">${user.exposure.toFixed(2)}</div>
          </div>
          <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3">
            <div className="text-xs text-gray-500">{t('account.2fa')}</div>
            <button
              onClick={() => onUpdateProfile({ twoFactorEnabled: !user.twoFactorEnabled })}
              className={`mt-1 px-2 py-1 rounded text-xs font-bold ${user.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
            >
              {user.twoFactorEnabled ? t('account.enabled') : t('account.disabled')}
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-3">
          <div className="text-xs text-gray-500 mb-2">{t('account.quick_wallet_actions')}</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="number"
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)}
              className="rounded p-2 bg-gray-100 dark:bg-black/20 text-sm"
            />
            <select
              value={walletMethod}
              onChange={(e) => setWalletMethod(e.target.value as 'Stripe' | 'PayPal' | 'Crypto')}
              className="rounded p-2 bg-gray-100 dark:bg-black/20 text-sm"
            >
              <option value="Stripe">Stripe</option>
              <option value="PayPal">PayPal</option>
              <option value="Crypto">Crypto</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => onDeposit(parseFloat(walletAmount || '0'), walletMethod)}
                className="flex-1 bg-green-600 text-white rounded p-2 text-xs font-bold"
              >
                {t('account.deposit')}
              </button>
              <button
                onClick={() => onWithdraw(parseFloat(walletAmount || '0'), walletMethod)}
                className="flex-1 bg-red-600 text-white rounded p-2 text-xs font-bold"
              >
                {t('account.withdraw')}
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {activeTab === 'personal' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-xs font-bold text-gray-500">{t('account.full_name')}
            <input value={profileForm.fullName} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} className="mt-1 w-full rounded p-2 bg-gray-100 dark:bg-black/20 text-sm" />
          </label>
          <label className="text-xs font-bold text-gray-500">{t('account.email')}
            <input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="mt-1 w-full rounded p-2 bg-gray-100 dark:bg-black/20 text-sm" />
          </label>
          <label className="text-xs font-bold text-gray-500">{t('account.phone')}
            <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="mt-1 w-full rounded p-2 bg-gray-100 dark:bg-black/20 text-sm" />
          </label>
          <label className="text-xs font-bold text-gray-500">{t('account.country')}
            <input value={profileForm.country} onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })} className="mt-1 w-full rounded p-2 bg-gray-100 dark:bg-black/20 text-sm" />
          </label>
          <label className="text-xs font-bold text-gray-500 md:col-span-2">{t('account.dob')}
            <input type="date" value={profileForm.dateOfBirth} onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })} className="mt-1 w-full rounded p-2 bg-gray-100 dark:bg-black/20 text-sm" />
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm font-bold">{t('account.save_profile')}</button>
          </div>
        </form>
      )}

      {activeTab === 'security' && (
        <form onSubmit={handleSaveSecurity} className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-xs font-bold text-gray-500 md:col-span-2">{t('account.current_password')}
            <input type="password" value={securityForm.currentPassword} onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })} className="mt-1 w-full rounded p-2 bg-gray-100 dark:bg-black/20 text-sm" />
          </label>
          <label className="text-xs font-bold text-gray-500">{t('account.new_password')}
            <input type="password" value={securityForm.newPassword} onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })} className="mt-1 w-full rounded p-2 bg-gray-100 dark:bg-black/20 text-sm" />
          </label>
          <label className="text-xs font-bold text-gray-500">{t('account.confirm_password')}
            <input type="password" value={securityForm.confirmPassword} onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })} className="mt-1 w-full rounded p-2 bg-gray-100 dark:bg-black/20 text-sm" />
          </label>
          <div className="md:col-span-2 flex items-center gap-3">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm font-bold">{t('account.update_password')}</button>
            <button
              type="button"
              onClick={() => onUpdateProfile({ twoFactorEnabled: !user.twoFactorEnabled })}
              className="px-4 py-2 rounded text-sm font-bold bg-gray-100 dark:bg-black/20"
            >
              {user.twoFactorEnabled ? t('account.disable_2fa') : t('account.enable_2fa')}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'limits' && (
        <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded p-4">
          <h3 className="font-bold text-gray-800 dark:text-white mb-3">{t('account.rg_title')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{t('account.daily_stake_limit')}</span>
              <input
                type="number"
                value={rgSettings.dailyStakeLimit}
                onChange={(e) => onUpdateRg({ ...rgSettings, dailyStakeLimit: parseFloat(e.target.value || '0') })}
                className="rounded p-2 bg-gray-100 dark:bg-black/20"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{t('account.daily_loss_limit')}</span>
              <input
                type="number"
                value={rgSettings.dailyLossLimit}
                onChange={(e) => onUpdateRg({ ...rgSettings, dailyLossLimit: parseFloat(e.target.value || '0') })}
                className="rounded p-2 bg-gray-100 dark:bg-black/20"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{t('account.session_reminder')}</span>
              <input
                type="number"
                value={rgSettings.sessionReminderMinutes}
                onChange={(e) => onUpdateRg({ ...rgSettings, sessionReminderMinutes: parseFloat(e.target.value || '0') })}
                className="rounded p-2 bg-gray-100 dark:bg-black/20"
              />
            </label>
          </div>
        </div>
      )}

      {message && <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded p-2">{message}</div>}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 text-xs text-blue-900 dark:text-blue-100">
        {t('account.demo_notice')}
      </div>
    </div>
  );
};

export default AccountView;
