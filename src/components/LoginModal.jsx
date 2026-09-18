'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import MakanLogo from './MakanLogo';

export default function LoginModal({ isOpen, onClose, onSwitchToSignUp }) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      setSuccessMessage('Logged in successfully! Welcome back.');
      setTimeout(() => {
        onClose();
        router.push('/');
      }, 600);
    } catch (err) {
      // Handles 404 "User not found", 401 "Invalid credentials", or generic server errors
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setErrorMessage('Please enter a valid email to reset password.');
      return;
    }
    setForgotSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px] animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] bg-white dark:bg-[#1e293b] rounded-[4px] shadow-2xl p-7 sm:p-8 border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        
        {/* Close Button at Top Right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Centered Logo */}
        <div className="flex items-center justify-center mb-6">
          <MakanLogo className="h-9 sm:h-10 w-auto" />
        </div>

        {/* Forgot Password View */}
        {showForgotPassword ? (
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 text-center">
              {t('resetPasswordTitle')}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-4 leading-relaxed">
              {t('resetPasswordDesc')}
            </p>

            {forgotSent ? (
              <div className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 p-3 rounded text-xs text-center mb-4 border border-green-200 dark:border-green-900">
                Password reset link has been sent to <strong>{forgotEmail}</strong>.
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder={t('email')}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-slate-700 rounded-[3px] py-2.5 px-3.5 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-[#60A5FA] hover:bg-[#3B82F6] text-white py-2.5 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
                >
                  {t('sendResetLink')}
                </button>
              </form>
            )}

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotSent(false);
                }}
                className="text-xs text-blue-500 hover:underline cursor-pointer"
              >
                {t('backToLogin')}
              </button>
            </div>
          </div>
        ) : (
          /* Main Login View */
          <div>
            {/* Error / Success Alerts */}
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs p-2.5 rounded-[3px] mb-3 border border-red-100 dark:border-red-900/60 animate-in fade-in duration-150">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-xs p-2.5 rounded-[3px] mb-3 border border-green-100 dark:border-green-900/60 animate-in fade-in duration-150">
                {successMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  className="w-full bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-slate-700 rounded-[3px] py-2.5 px-3.5 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 placeholder:text-gray-400 transition-colors disabled:opacity-60"
                />
              </div>

              {/* Password Input */}
              <div>
                <input
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="w-full bg-white dark:bg-[#1e293b] border border-gray-300 dark:border-slate-700 rounded-[3px] py-2.5 px-3.5 text-xs sm:text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 placeholder:text-gray-400 transition-colors disabled:opacity-60"
                />
              </div>

              {/* I forgot my password Link */}
              <div className="text-center pt-1 pb-1">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {t('forgotPassword')}
                </button>
              </div>

              {/* LOGIN Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#60A5FA] hover:bg-[#3B82F6] disabled:bg-blue-400 text-white py-2.5 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-colors shadow-xs cursor-pointer flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <span>{t('loginBtn')}</span>
                )}
              </button>

              {/* ──── or ──── Divider */}
              <div className="relative flex items-center justify-center my-3.5">
                <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                <span className="bg-white dark:bg-[#1e293b] px-3 text-[11px] text-gray-400 absolute">
                  or
                </span>
              </div>

              {/* Connect with Google Button */}
              <button
                type="button"
                onClick={() => {
                  setSuccessMessage('Connecting to Google Account...');
                  setTimeout(() => onClose(), 1000);
                }}
                className="w-full bg-[#3F51B5] hover:bg-[#334296] text-white py-2.5 px-4 rounded-[3px] text-xs font-semibold flex items-center justify-center space-x-2.5 transition-colors shadow-xs cursor-pointer"
              >
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center p-0.5">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
                    />
                  </svg>
                </div>
                <span>{t('connectWithGoogle')}</span>
              </button>

              {/* Still not a member? Sign Up Now! */}
              <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-3">
                <span>{t('stillNotMember')} </span>
                {onSwitchToSignUp ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToSignUp();
                    }}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    {t('signUpNow')}
                  </button>
                ) : (
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                  >
                    {t('signUpNow')}
                  </Link>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
