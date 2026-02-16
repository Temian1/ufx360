import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useTranslation } from '../contexts/TranslationContext';

interface AuthModalProps {
  onLogin: (username: string) => boolean;
  onRegister: (user: Partial<User>) => void;
  onClose: () => void;
}

type AuthStep =
  | 'LOGIN'
  | 'REGISTER_DETAILS'
  | 'REGISTER_VERIFY'
  | 'FORGOT_EMAIL'
  | 'FORGOT_VERIFY'
  | 'FORGOT_RESET';

// SVG Icons
const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const iconMap: Record<string, React.FC> = {
  person: UserIcon,
  lock: LockIcon,
  mail: MailIcon,
  phone: PhoneIcon,
  key: KeyIcon,
  lock_reset: ShieldIcon,
};

const AuthModal: React.FC<AuthModalProps> = ({ onLogin, onRegister, onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<AuthStep>('LOGIN');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    confirmPassword: '',
    otp: '',
    newPassword: '',
    agreeTerms: false,
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    setError('');
  }, [step]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?[\d\s-]{10,}$/.test(phone);

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (pass.length > 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
    if (name === 'password' || name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const simulateLoading = (callback: () => void) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      callback();
    }, 1500);
  };

  const handleDemoLogin = (username: string) => {
    setFormData({ ...formData, username, password: 'demo' });
    setTimeout(() => {
      simulateLoading(() => {
        const success = onLogin(username);
        if (success) onClose();
        else setError(t('error.invalid_credentials'));
      });
    }, 100);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError(t('error.username_password_required'));
      return;
    }
    simulateLoading(() => {
      const success = onLogin(formData.username);
      if (success) onClose();
      else setError(t('error.invalid_credentials'));
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError(t('error.username_password_required'));
      return;
    }
    if (!validateEmail(formData.email)) { setError(t('error.invalid_email')); return; }
    if (!validatePhone(formData.phone)) { setError(t('error.invalid_phone')); return; }
    if (formData.password.length < 6) { setError(t('error.password_length')); return; }
    if (formData.password !== formData.confirmPassword) { setError(t('error.password_mismatch')); return; }
    if (!formData.agreeTerms) { setError(t('error.terms_required')); return; }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    simulateLoading(() => { setStep('REGISTER_VERIFY'); setError(''); });
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp !== generatedOtp && formData.otp !== '123456') { setError(t('error.invalid_otp')); return; }
    simulateLoading(() => {
      onRegister({
        username: formData.username, email: formData.email, phone: formData.phone,
        password: formData.password, role: 'Player', balance: 0, exposure: 0,
        creditLimit: 0, commission: 0, maxBetLimit: 100, isBlocked: false, twoFactorEnabled: false,
      });
    });
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) { setError(t('error.invalid_email')); return; }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    simulateLoading(() => { setStep('FORGOT_VERIFY'); });
  };

  const handleForgotVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp !== generatedOtp && formData.otp !== '123456') { setError(t('error.invalid_otp')); return; }
    simulateLoading(() => { setStep('FORGOT_RESET'); });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) { setError(t('error.password_length')); return; }
    if (formData.newPassword !== formData.confirmPassword) { setError(t('error.password_mismatch')); return; }
    simulateLoading(() => {
      alert(t('success.password_reset'));
      setStep('LOGIN');
      setFormData({ ...formData, password: '', newPassword: '', confirmPassword: '' });
    });
  };

  const renderSvgInput = (label: string, name: string, type = 'text', placeholder = '', iconKey = '', required = true) => {
    const IconComp = iconMap[iconKey];
    return (
      <div className="mb-3">
        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">{label}</label>
        <div className="relative group">
          {IconComp && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary dark:group-focus-within:text-bet-yellow transition-colors pointer-events-none">
              <IconComp />
            </div>
          )}
          <input
            type={type === 'password' && showPassword ? 'text' : type}
            name={name}
            value={formData[name as keyof typeof formData] as string}
            onChange={handleChange}
            className={`w-full bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 ${IconComp ? 'pl-10' : 'pl-3.5'} pr-10 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary dark:focus:border-bet-yellow focus:ring-1 focus:ring-primary/30 dark:focus:ring-bet-yellow/30 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600`}
            placeholder={placeholder}
            required={required}
          />
          {name.toLowerCase().includes('password') && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPasswordStrength = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
    const width = (passwordStrength + 1) * 20;
    const color = colors[passwordStrength] || colors[0];
    return (
      <div className="mt-0.5 mb-3 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${width}%` }}></div>
      </div>
    );
  };

  const renderSubmitButton = (text: string, variant: 'yellow' | 'primary' = 'yellow') => (
    <button
      type="submit"
      disabled={loading}
      className={`w-full font-black uppercase text-xs py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
        variant === 'yellow'
          ? 'bg-bet-yellow hover:bg-yellow-400 text-gray-900'
          : 'bg-primary hover:bg-primary/90 text-white'
      }`}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : text}
    </button>
  );

  const demoAccounts = [
    { username: 'player', role: 'Player', color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' },
    { username: 'agent', role: 'Agent', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' },
    { username: 'admin', role: 'Admin', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-surface-dark w-full max-w-sm rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="bg-primary p-5 text-center relative">
          <div className="font-black text-2xl italic tracking-tighter text-white">
            upx<span className="text-bet-yellow">365</span>
          </div>
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
            {step === 'LOGIN' && t('welcome')}
            {step === 'REGISTER_DETAILS' && t('register')}
            {step === 'REGISTER_VERIFY' && t('auth.verify_phone')}
            {step.startsWith('FORGOT') && t('auth.forgot_password')}
          </p>
          <button onClick={onClose} className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors">
            <CloseIcon />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {step === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit}>
              {/* Demo Quick Login */}
              <div className="mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Quick Demo Login</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.username}
                      type="button"
                      onClick={() => handleDemoLogin(acc.username)}
                      className={`flex flex-col items-center gap-0.5 px-2 py-2 rounded-lg border text-center transition-all active:scale-95 hover:opacity-80 ${acc.color}`}
                    >
                      <span className="text-[10px] font-black uppercase">{acc.role}</span>
                      <span className="text-[9px] opacity-70">@{acc.username}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">or sign in</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10"></div>
              </div>

              {renderSvgInput(t('auth.username'), 'username', 'text', t('auth.placeholder_username'), 'person')}
              {renderSvgInput(t('auth.password'), 'password', 'password', t('auth.placeholder_password'), 'lock')}

              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">{t('auth.remember_me')}</span>
                </label>
                <button type="button" onClick={() => setStep('FORGOT_EMAIL')} className="text-[10px] text-primary dark:text-bet-yellow font-bold hover:underline">
                  {t('auth.forgot_password')}
                </button>
              </div>

              {renderSubmitButton(t('login'))}

              <p className="mt-4 text-center text-[11px] text-gray-500 dark:text-gray-400">
                {t('auth.no_account')}{' '}
                <button type="button" onClick={() => setStep('REGISTER_DETAILS')} className="text-primary dark:text-bet-yellow font-bold hover:underline">
                  {t('register')}
                </button>
              </p>
            </form>
          )}

          {step === 'REGISTER_DETAILS' && (
            <form onSubmit={handleRegisterSubmit}>
              {renderSvgInput(t('auth.username'), 'username', 'text', t('auth.placeholder_username'), 'person')}
              {renderSvgInput(t('auth.email'), 'email', 'email', t('auth.placeholder_email'), 'mail')}
              {renderSvgInput(t('auth.phone'), 'phone', 'tel', t('auth.placeholder_phone'), 'phone')}
              <div>
                {renderSvgInput(t('auth.password'), 'password', 'password', t('auth.placeholder_create_password'), 'lock')}
                {formData.password && renderPasswordStrength()}
              </div>
              {renderSvgInput(t('auth.confirm_password'), 'confirmPassword', 'password', t('auth.placeholder_repeat_password'), 'lock')}

              <label className="flex items-start gap-2 cursor-pointer p-2.5 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 mb-3">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  {t('auth.terms_agree')} <button type="button" className="text-primary dark:text-bet-yellow hover:underline">{t('auth.terms_service')}</button> & <button type="button" className="text-primary dark:text-bet-yellow hover:underline">{t('auth.privacy_policy')}</button>.
                </span>
              </label>

              {renderSubmitButton(t('auth.continue'), 'primary')}

              <p className="mt-3 text-center">
                <button type="button" onClick={() => setStep('LOGIN')} className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  {t('auth.back_login')}
                </button>
              </p>
            </form>
          )}

          {step === 'REGISTER_VERIFY' && (
            <form onSubmit={handleVerifySubmit} className="text-center">
              <div className="mb-4 bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
                  <PhoneIcon />
                </div>
                <h3 className="text-sm font-black text-gray-800 dark:text-white">{t('auth.verify_phone')}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {t('auth.sent_code')} <span className="font-bold text-gray-700 dark:text-gray-300">{formData.phone}</span>
                </p>
                <div className="mt-2 p-1.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-[10px] rounded border border-yellow-200 dark:border-yellow-900/30 inline-block">
                  {t('auth.mock_otp')} <span className="font-mono font-bold tracking-widest">{generatedOtp}</span>
                </div>
              </div>

              {renderSvgInput(t('auth.enter_code'), 'otp', 'text', t('auth.placeholder_otp'), 'key')}
              {renderSubmitButton(t('auth.verify_create'), 'primary')}

              <button type="button" onClick={() => setStep('REGISTER_DETAILS')} className="mt-3 text-[11px] text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto">
                <ArrowLeftIcon /> {t('auth.change_details')}
              </button>
            </form>
          )}

          {step === 'FORGOT_EMAIL' && (
            <form onSubmit={handleForgotEmailSubmit}>
              <div className="text-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mx-auto mb-2 text-gray-400">
                  <ShieldIcon />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {t('auth.forgot_description')}
                </p>
              </div>
              {renderSvgInput(t('auth.email'), 'email', 'email', t('auth.placeholder_email'), 'mail')}
              {renderSubmitButton(t('auth.send_code'), 'primary')}

              <p className="mt-3 text-center">
                <button type="button" onClick={() => setStep('LOGIN')} className="text-[11px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                  {t('auth.back_login')}
                </button>
              </p>
            </form>
          )}

          {step === 'FORGOT_VERIFY' && (
            <form onSubmit={handleForgotVerifySubmit} className="text-center">
              <div className="mb-4 bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 text-primary">
                  <MailIcon />
                </div>
                <h3 className="text-sm font-black text-gray-800 dark:text-white">{t('auth.check_email')}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                  {t('auth.sent_code')} <span className="font-bold text-gray-700 dark:text-gray-300">{formData.email}</span>
                </p>
                <div className="mt-2 p-1.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-[10px] rounded border border-yellow-200 dark:border-yellow-900/30 inline-block">
                  {t('auth.mock_otp')} <span className="font-mono font-bold tracking-widest">{generatedOtp}</span>
                </div>
              </div>

              {renderSvgInput(t('auth.enter_code'), 'otp', 'text', t('auth.placeholder_otp'), 'key')}
              {renderSubmitButton(t('auth.verify_code'), 'primary')}
            </form>
          )}

          {step === 'FORGOT_RESET' && (
            <form onSubmit={handleResetPasswordSubmit}>
              <div className="text-center mb-4">
                <h3 className="text-sm font-black text-gray-800 dark:text-white">{t('auth.create_new_password')}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('auth.reset_description')}</p>
              </div>
              <div>
                {renderSvgInput(t('auth.new_password'), 'newPassword', 'password', t('auth.placeholder_new_password'), 'lock')}
                {formData.newPassword && renderPasswordStrength()}
              </div>
              {renderSvgInput(t('auth.confirm_password'), 'confirmPassword', 'password', t('auth.placeholder_repeat_new_password'), 'lock')}
              {renderSubmitButton(t('auth.reset_password'))}
            </form>
          )}

          {error && (
            <div className="mt-3 p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg flex items-start gap-2 text-red-600 dark:text-red-400 text-[11px]">
              <ErrorIcon />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
