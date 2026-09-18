'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MakanLogo from '@/components/MakanLogo';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { register, login } = useAuth();

  const [membershipType, setMembershipType] = useState('individual'); // 'individual' or 'corporate'
  const [isSignInMode, setIsSignInMode] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [commercialConsent, setCommercialConsent] = useState(false);

  // Validation / Message / Loading
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isSignInMode) {
      if (membershipType === 'individual' && !name.trim()) {
        setErrorMessage('Please enter your Name / Surname.');
        return;
      }
      if (membershipType === 'corporate' && !companyName.trim()) {
        setErrorMessage('Please enter your Company Name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid E-mail address.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!acceptTerms) {
        setErrorMessage('You must accept the User Agreement and Terms.');
        return;
      }

      setIsLoading(true);
      try {
        await register({
          name: membershipType === 'individual' ? name.trim() : companyName.trim(),
          email: email.trim(),
          password,
          membershipType,
          companyName: companyName.trim(),
          taxNumber: taxNumber.trim()
        });
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 800);
      } catch (err) {
        setErrorMessage(err.message || 'Registration failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter your email and password.');
        return;
      }
      setIsLoading(true);
      try {
        await login(email.trim(), password);
        setSuccessMessage('Signed in successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 800);
      } catch (err) {
        setErrorMessage(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full bg-[#333333]/40 dark:bg-black/60 min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12 transition-colors duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[840px] bg-white dark:bg-[#1e293b] rounded-[4px] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800 transition-colors">
        
        {/* Close Button at top right */}
        <Link
          href="/"
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors z-20"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT COLUMN: BRAND & VALUE PROPOSITIONS */}
          <div className="p-8 sm:p-10 flex flex-col items-center justify-between text-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-800 bg-[#FAFAFA]/50 dark:bg-slate-900/40">
            
            {/* Top Brand Logo */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col items-center justify-center">
                <MakanLogo className="h-10 sm:h-12 w-auto mb-2" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Why should I join MAKAN?
                </h2>
                <p className="text-[10.5px] text-gray-400 dark:text-gray-400 leading-relaxed max-w-[280px]">
                  To quickly find and contact real estate advertisements, and freely create and manage your own ads.
                </p>
              </div>
            </div>

            {/* 4 Value Proposition Badges */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-8 w-full max-w-[280px]">
              
              {/* Badge 1: Yellow */}
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-11 h-11 rounded-full bg-amber-400/90 text-white flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight text-center">
                  Instant Advert<br />Tracking
                </span>
              </div>

              {/* Badge 2: Red */}
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-11 h-11 rounded-full bg-[#E53935] text-white flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight text-center">
                  Advertise Easily &<br />Manage Portfolio
                </span>
              </div>

              {/* Badge 3: Blue/Purple */}
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight text-center">
                  Save Favorite<br />Properties
                </span>
              </div>

              {/* Badge 4: Light Blue */}
              <div className="flex flex-col items-center space-y-1.5">
                <div className="w-11 h-11 rounded-full bg-sky-400 text-white flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium leading-tight text-center">
                  Direct Agent<br />Messaging
                </span>
              </div>

            </div>

            <div className="text-[9.5px] text-gray-300 dark:text-gray-600">
              © {new Date().getFullYear()} MAKAN. All rights reserved.
            </div>

          </div>

          {/* RIGHT COLUMN: SIGN UP / SIGN IN FORM */}
          <div className="p-8 sm:p-10 flex flex-col justify-between">
            
            <div>
              {/* Membership Tabs */}
              {!isSignInMode && (
                <div className="flex items-center space-x-6 border-b border-gray-100 dark:border-slate-800 pb-3 mb-5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setMembershipType('individual')}
                    className={`relative pb-3 transition-colors cursor-pointer ${
                      membershipType === 'individual'
                        ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    Individual Membership
                  </button>

                  <button
                    type="button"
                    onClick={() => setMembershipType('corporate')}
                    className={`relative pb-3 transition-colors cursor-pointer ${
                      membershipType === 'corporate'
                        ? 'text-blue-600 dark:text-blue-400 font-bold border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    Corporate Membership
                  </button>
                </div>
              )}

              {isSignInMode && (
                <div className="mb-5">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Sign in to your MAKAN account</p>
                </div>
              )}

              {/* Google Social Login */}
              <button
                type="button"
                className="w-full bg-[#3B5998] hover:bg-[#324b80] text-white py-2.5 px-4 rounded-[2px] text-xs font-medium flex items-center justify-center gap-2.5 transition-colors shadow-xs cursor-pointer"
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
                <span>Connect with Google</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
                <span className="bg-white dark:bg-[#1e293b] px-2.5 text-[10.5px] text-gray-400 absolute">or</span>
              </div>

              {/* Error / Success Alerts */}
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-[11px] p-2 rounded-[2px] mb-3 border border-red-100 dark:border-red-900/60">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-[11px] p-2 rounded-[2px] mb-3 border border-green-100 dark:border-green-900/60">
                  {successMessage}
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                
                {/* Individual: Name / Surname */}
                {!isSignInMode && membershipType === 'individual' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Name / Surname *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 focus:border-gray-400 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400"
                    />
                  </div>
                )}

                {/* Corporate: Company Name & Tax */}
                {!isSignInMode && membershipType === 'corporate' && (
                  <>
                    <div>
                      <input
                        type="text"
                        placeholder="Company Name *"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 focus:border-gray-400 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Tax / Registration Number *"
                        value={taxNumber}
                        onChange={(e) => setTaxNumber(e.target.value)}
                        className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 focus:border-gray-400 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </>
                )}

                {/* E-mail */}
                <div>
                  <input
                    type="email"
                    placeholder="E-mail *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 focus:border-gray-400 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* Password */}
                <div>
                  <input
                    type="password"
                    placeholder="Password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 focus:border-gray-400 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* Confirm Password */}
                {!isSignInMode && (
                  <div>
                    <input
                      type="password"
                      placeholder="Confirm Password *"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 focus:border-gray-400 rounded-[2px] py-2 px-3 text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400"
                    />
                  </div>
                )}

                {/* Checkboxes for Sign Up */}
                {!isSignInMode && (
                  <div className="space-y-2 pt-1 text-[10.5px] text-gray-500 dark:text-gray-400">
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>
                        I accept the <span className="text-blue-600 dark:text-blue-400 hover:underline">User Agreement</span> and Privacy Policy.
                      </span>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={commercialConsent}
                        onChange={(e) => setCommercialConsent(e.target.checked)}
                        className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>
                        I want to be informed about campaigns via commercial electronic message.
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#4285F4] hover:bg-[#3367d6] disabled:bg-blue-400 text-white py-2.5 rounded-[2px] font-semibold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{isSignInMode ? 'Sign In' : 'Sign Up'}</span>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Bottom Switcher */}
            <div className="pt-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-50 dark:border-slate-800 mt-4">
              {!isSignInMode ? (
                <span>
                  Already a member?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignInMode(true);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignInMode(false);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
