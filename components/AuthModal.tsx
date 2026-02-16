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

  // Reset error when switching steps
  useEffect(() => {
    setError('');
  }, [step]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\+?[\d\s-]{10,}$/.test(phone);
  };

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

  const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setError(t('error.username_password_required'));
            return;
        }
        simulateLoading(() => {
            const success = onLogin(formData.username);
            if (success) {
                onClose();
            } else {
                setError(t('error.invalid_credentials'));
            }
        });
    };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError(t('error.username_password_required'));
        return;
    }

    if (!validateEmail(formData.email)) {
        setError(t('error.invalid_email'));
        return;
    }
    if (!validatePhone(formData.phone)) {
        setError(t('error.invalid_phone'));
        return;
    }
    if (formData.password.length < 6) {
        setError(t('error.password_length'));
        return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('error.password_mismatch'));
      return;
    }
    if (!formData.agreeTerms) {
        setError(t('error.terms_required'));
        return;
    }

    // Generate Mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log("Mock OTP:", otp); 
    
    simulateLoading(() => {
        setStep('REGISTER_VERIFY');
        setError('');
    });
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp !== generatedOtp && formData.otp !== '123456') {
      setError(t('error.invalid_otp'));
      return;
    }
    
    simulateLoading(() => {
        onRegister({
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: 'Player',
            balance: 0,
            exposure: 0,
            creditLimit: 0,
            commission: 0,
            maxBetLimit: 100,
            isBlocked: false,
            twoFactorEnabled: false,
        });
    });
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
        setError(t('error.invalid_email'));
        return;
    }
    // Generate Mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    console.log("Mock OTP for Reset:", otp);
    
    simulateLoading(() => {
        setStep('FORGOT_VERIFY');
    });
  };

  const handleForgotVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp !== generatedOtp && formData.otp !== '123456') {
      setError(t('error.invalid_otp'));
      return;
    }
    simulateLoading(() => {
        setStep('FORGOT_RESET');
    });
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword.length < 6) {
        setError(t('error.password_length'));
        return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
        setError(t('error.password_mismatch'));
        return;
    }
    simulateLoading(() => {
        alert(t('success.password_reset'));
        setStep('LOGIN');
        setFormData({ ...formData, password: '', newPassword: '', confirmPassword: '' });
    });
  };

  const renderInput = (label: string, name: string, type = 'text', placeholder = '', required = true, icon?: string) => (
    <div className="mb-4 group">
      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider group-focus-within:text-primary transition-colors">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        )}
        <input 
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleChange}
          className={`w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 ${icon ? 'pl-10' : 'pl-3.5'} pr-10 text-gray-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-600 shadow-inner`}
          placeholder={placeholder}
          required={required}
        />
        {name.toLowerCase().includes('password') && (
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
            >
            <span className="material-symbols-outlined text-xl">
                {showPassword ? 'visibility_off' : 'visibility'}
            </span>
            </button>
        )}
      </div>
    </div>
  );

  const renderPasswordStrength = () => {
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500'];
      const width = (passwordStrength + 1) * 20;
      const color = colors[passwordStrength] || colors[0];
      
      return (
          <div className="mt-1 mb-4 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${width}%` }}></div>
          </div>
      );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" onClick={onClose}></div>
      <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300 border border-white/10 ring-1 ring-black/5">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#126e51] to-[#0e5840] p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ffdf1b]/10 rounded-full blur-3xl"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
                <div className="font-black text-4xl italic tracking-tighter text-white drop-shadow-md mb-2">
                    upx<span className="text-[#ffdf1b]">365</span>
                </div>
                <p className="text-white/80 text-sm font-medium uppercase tracking-widest">
                    {step === 'LOGIN' && t('welcome')}
                    {step === 'REGISTER_DETAILS' && t('register')}
                    {step === 'REGISTER_VERIFY' && t('auth.verify_phone')}
                    {step.startsWith('FORGOT') && t('auth.forgot_password')}
                </p>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-1">
                <span className="material-symbols-outlined text-xl">close</span>
            </button>
        </div>
        
        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {step === 'LOGIN' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {renderInput(t('auth.username'), 'username', 'text', t('auth.placeholder_username'))}
                    <div className="mb-2">
                        {renderInput(t('auth.password'), 'password', 'password', t('auth.placeholder_password'))}
                        <div className="flex justify-between items-center mt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                                />
                                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{t('auth.remember_me')}</span>
                            </label>
                            <button type="button" onClick={() => setStep('FORGOT_EMAIL')} className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
                                {t('auth.forgot_password')}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#ffdf1b] hover:bg-[#ffe64d] text-gray-900 font-black text-lg py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-yellow-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></span>
                                {t('auth.logging_in')}
                            </>
                        ) : t('login')}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('auth.no_account')}{' '}
                            <button type="button" onClick={() => setStep('REGISTER_DETAILS')} className="text-primary font-bold hover:underline">
                                {t('register')}
                            </button>
                        </p>
                    </div>
                </form>
            )}

            {step === 'REGISTER_DETAILS' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    {renderInput(t('auth.username'), 'username', 'text', t('auth.placeholder_username'))}
                    {renderInput(t('auth.email'), 'email', 'email', t('auth.placeholder_email'))}
                    {renderInput(t('auth.phone'), 'phone', 'tel', t('auth.placeholder_phone'))}
                    <div>
                        {renderInput(t('auth.password'), 'password', 'password', t('auth.placeholder_create_password'))}
                        {formData.password && renderPasswordStrength()}
                    </div>
                    {renderInput(t('auth.confirm_password'), 'confirmPassword', 'password', t('auth.placeholder_repeat_password'))}

                    <label className="flex items-start gap-3 cursor-pointer p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                        <input 
                            type="checkbox" 
                            name="agreeTerms"
                            checked={formData.agreeTerms}
                            onChange={handleChange}
                            className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {t('auth.terms_agree')} <button type="button" className="text-primary hover:underline">{t('auth.terms_service')}</button> & <button type="button" className="text-primary hover:underline">{t('auth.privacy_policy')}</button>.
                        </span>
                    </label>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                {t('auth.processing')}
                            </>
                        ) : t('auth.continue')}
                    </button>

                    <div className="mt-4 text-center">
                        <button type="button" onClick={() => setStep('LOGIN')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            {t('auth.back_login')}
                        </button>
                    </div>
                </form>
            )}

            {step === 'REGISTER_VERIFY' && (
                <form onSubmit={handleVerifySubmit} className="text-center space-y-6">
                    <div className="mb-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <span className="material-symbols-outlined text-5xl text-primary mb-2">sms</span>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('auth.verify_phone')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t('auth.sent_code')} <span className="font-semibold text-gray-700 dark:text-gray-300">{formData.phone}</span>
                        </p>
                        <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded border border-yellow-200 dark:border-yellow-900/30 inline-block">
                            {t('auth.mock_otp')} <span className="font-mono font-bold tracking-widest">{generatedOtp}</span>
                        </div>
                    </div>

                    {renderInput(t('auth.enter_code'), 'otp', 'text', t('auth.placeholder_otp'), true, 'key')}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                {t('auth.verifying')}
                            </>
                        ) : t('auth.verify_create')}
                    </button>
                    
                    <button type="button" onClick={() => setStep('REGISTER_DETAILS')} className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto">
                        <span className="material-symbols-outlined text-sm">arrow_back</span> {t('auth.change_details')}
                    </button>
                </form>
            )}

            {step === 'FORGOT_EMAIL' && (
                <form onSubmit={handleForgotEmailSubmit} className="space-y-6">
                    <div className="text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-2">lock_reset</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            {t('auth.forgot_description')}
                        </p>
                    </div>
                    {renderInput(t('auth.email'), 'email', 'email', t('auth.placeholder_email'), true, 'mail')}
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                             <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                {t('auth.sending')}
                            </>
                        ) : t('auth.send_code')}
                    </button>

                    <div className="mt-4 text-center">
                        <button type="button" onClick={() => setStep('LOGIN')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                            {t('auth.back_login')}
                        </button>
                    </div>
                </form>
            )}

            {step === 'FORGOT_VERIFY' && (
                <form onSubmit={handleForgotVerifySubmit} className="text-center space-y-6">
                    <div className="mb-6 bg-primary/5 p-6 rounded-2xl border border-primary/10">
                        <span className="material-symbols-outlined text-5xl text-primary mb-2">mark_email_read</span>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('auth.check_email')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {t('auth.sent_code')} <span className="font-semibold text-gray-700 dark:text-gray-300">{formData.email}</span>
                        </p>
                        <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs rounded border border-yellow-200 dark:border-yellow-900/30 inline-block">
                            {t('auth.mock_otp')} <span className="font-mono font-bold tracking-widest">{generatedOtp}</span>
                        </div>
                    </div>

                    {renderInput(t('auth.enter_code'), 'otp', 'text', t('auth.placeholder_otp'), true, 'key')}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                {t('auth.verifying')}
                            </>
                        ) : t('auth.verify_code')}
                    </button>
                </form>
            )}

            {step === 'FORGOT_RESET' && (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                     <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{t('auth.create_new_password')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('auth.reset_description')}
                        </p>
                    </div>
                    
                    <div>
                        {renderInput(t('auth.new_password'), 'newPassword', 'password', t('auth.placeholder_new_password'), true, 'lock')}
                        {formData.newPassword && renderPasswordStrength()}
                    </div>
                    {renderInput(t('auth.confirm_password'), 'confirmPassword', 'password', t('auth.placeholder_repeat_new_password'), true, 'lock_reset')}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-bet-yellow to-yellow-400 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-yellow-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></span>
                                {t('auth.resetting')}
                            </>
                        ) : t('auth.reset_password')}
                    </button>
                </form>
            )}

            {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                    <span className="material-symbols-outlined text-xl shrink-0">error</span>
                    <span className="font-medium mt-0.5">{error}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;