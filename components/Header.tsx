import React from 'react';
import { User } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onProfileClick: () => void;
  onLogoutClick: () => void;
  notificationCount?: number;
  onNotificationsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onProfileClick, onLogoutClick, notificationCount = 0, onNotificationsClick }) => {
  const { t, formatCurrency } = useTranslation();
  
  const initials = (user?.fullName || user?.username || 'U')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="bg-primary/95 dark:bg-primary/95 backdrop-blur-md text-white p-3 flex items-center justify-between sticky top-0 z-50 shadow-lg h-[60px] border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="font-black text-2xl tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          upx<span className="text-bet-yellow bg-none">365</span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs font-bold">
        {user ? (
            <div className="flex items-center gap-3">
                <div className="text-right hidden sm:flex flex-col items-end bg-black/20 px-3 py-1 rounded-lg border border-white/5">
                    <div className="text-bet-yellow font-black text-sm tracking-wide">{formatCurrency(user.balance)}</div>
                    <div className="text-[10px] text-gray-300 font-normal">{user.username}</div>
                </div>
                
                <div className="flex items-center gap-2">
                    {onNotificationsClick && (
                    <button 
                        onClick={onNotificationsClick}
                        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all relative active:scale-95"
                        title={t('header.notifications')}
                    >
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        {notificationCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary"></span>
                        )}
                    </button>
                    )}
                    <button 
                        onClick={onProfileClick}
                        className="w-9 h-9 rounded-full bg-white/10 overflow-hidden flex items-center justify-center hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                        title={t('header.profile')}
                    >
                        {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={t('header.avatar_alt')} className="w-full h-full object-cover" />
                        ) : (
                        <span className="text-xs font-black">{initials}</span>
                        )}
                    </button>
                    <button
                        onClick={onLogoutClick}
                        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/80 transition-all active:scale-95 group"
                        title={t('common.logout')}
                    >
                        <span className="material-symbols-outlined text-[20px] group-hover:text-white">logout</span>
                    </button>
                </div>
            </div>
        ) : (
            <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition hidden sm:block border border-white/5 backdrop-blur-sm">{t('nav.offers')}</button>
                <button onClick={onLoginClick} className="px-5 py-2 rounded-full bg-bet-yellow text-gray-900 font-black hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20 active:scale-95">{t('register')}</button>
                <button onClick={onLoginClick} className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition backdrop-blur-sm font-semibold">{t('login')}</button>
            </div>
        )}
      </div>
    </header>
  );
};

export default Header;
