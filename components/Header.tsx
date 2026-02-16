import React, { useMemo } from 'react';
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
  const { formatCurrency } = useTranslation();

  const validateCode = useMemo(() => Math.floor(1000 + Math.random() * 9000), []);

  const initials = (user?.fullName || user?.username || 'U')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* ========== DESKTOP HEADER ========== */}
      <header className="hidden lg:block bg-gray-900 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="font-black text-2xl tracking-tighter italic text-white shrink-0 cursor-pointer">
            upx<span className="text-bet-yellow">365</span>
          </div>

          {/* Right: Auth block */}
          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <>
                {/* User icon */}
                <span className="material-symbols-outlined text-gray-400 text-2xl">person</span>

                {/* Balance display */}
                <div className="text-right bg-black/30 px-3 py-1.5 rounded">
                  <div className="text-bet-yellow font-black text-sm leading-tight">{formatCurrency(user.balance)}</div>
                  <div className="text-[10px] text-gray-400">{user.username}</div>
                </div>

                {/* Notifications */}
                {onNotificationsClick && (
                  <button
                    onClick={onNotificationsClick}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition relative active:scale-95"
                  >
                    <span className="material-symbols-outlined text-white text-xl">notifications</span>
                    {notificationCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">{notificationCount}</span>
                    )}
                  </button>
                )}

                {/* Profile */}
                <button
                  onClick={onProfileClick}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition border border-white/10 active:scale-95"
                >
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-xs font-black text-white">{initials}</span>
                  )}
                </button>

                {/* Logout */}
                <button
                  onClick={onLogoutClick}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/80 transition active:scale-95 group"
                >
                  <span className="material-symbols-outlined text-xl text-gray-400 group-hover:text-white">logout</span>
                </button>
              </>
            ) : (
              <>
                {/* User icon */}
                <span className="material-symbols-outlined text-gray-400 text-2xl">person</span>

                {/* Inline login fields */}
                <input
                  type="text"
                  placeholder="Username"
                  className="bg-white/10 border border-white/20 rounded px-2.5 py-1.5 text-sm text-white placeholder-gray-500 w-28 focus:outline-none focus:border-primary"
                  onKeyDown={(e) => { if (e.key === 'Enter') onLoginClick(); }}
                  readOnly
                  onClick={onLoginClick}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-white/10 border border-white/20 rounded px-2.5 py-1.5 text-sm text-white placeholder-gray-500 w-28 focus:outline-none focus:border-primary"
                  readOnly
                  onClick={onLoginClick}
                />

                {/* Validate code */}
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-xs">Validate Code</span>
                  <span className="bg-white/10 border border-white/20 rounded px-2 py-1.5 text-bet-yellow font-black text-sm min-w-[50px] text-center">{validateCode}</span>
                </div>

                {/* Login button */}
                <button
                  onClick={onLoginClick}
                  className="bg-primary text-white font-bold text-sm px-5 py-1.5 rounded hover:bg-primary/80 transition active:scale-95 flex items-center gap-1"
                >
                  Login
                  <span className="material-symbols-outlined text-base">login</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========== MOBILE HEADER ========== */}
      <header className="lg:hidden sticky top-0 z-50">
        {/* Row 1: Logo + Login */}
        <div className="bg-primary text-white px-3 py-2 flex items-center justify-between h-[56px]">
          <div className="font-black text-2xl tracking-tighter italic">
            upx<span className="text-bet-yellow">365</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="text-right bg-black/20 px-2.5 py-1 rounded-lg">
                  <div className="text-bet-yellow font-black text-sm">{formatCurrency(user.balance)}</div>
                  <div className="text-[10px] text-gray-300">{user.username}</div>
                </div>
                {onNotificationsClick && (
                  <button
                    onClick={onNotificationsClick}
                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center relative active:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl">notifications</span>
                    {notificationCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-primary"></span>
                    )}
                  </button>
                )}
                <button
                  onClick={onProfileClick}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/10 active:scale-95"
                >
                  <span className="text-xs font-black">{initials}</span>
                </button>
                <button
                  onClick={onLogoutClick}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-500/80 transition active:scale-95"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-red-600 text-white font-bold text-xs px-4 py-1.5 rounded-full hover:bg-red-500 transition active:scale-95 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-base">login</span>
                Login
              </button>
            )}
          </div>
        </div>

      </header>
    </>
  );
};

export default Header;
