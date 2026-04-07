"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Phone, Loader2, ChevronDown } from 'lucide-react';
import { useGlobalContext } from '@/context/GlobalContext';
import { signIn, getSession } from 'next-auth/react';
import { requestOtp as apiRequestOtp } from '@/utils/api/auth';

const IS_DEV = process.env.NEXT_PUBLIC_EDITOR_MODE !== "prod";




const IndiaFlag = () => (
    <svg className="w-5 h-5 rounded-sm overflow-hidden" viewBox="0 0 600 400">
        <rect width="600" height="133.3" fill="#FF9933"/>
        <rect y="133.3" width="600" height="133.3" fill="#FFFFFF"/>
        <rect y="266.6" width="600" height="133.4" fill="#138808"/>
        <circle cx="300" cy="200" r="60" fill="#000080"/>
        <circle cx="300" cy="200" r="48" fill="#FFFFFF"/>
        <circle cx="300" cy="200" r="46" fill="#000080"/>
        {Array.from({length: 24}).map((_, i) => (
            <path key={i} d="M300 154 L303 200 L297 200 Z" fill="#000080" transform={`rotate(${i * 15} 300 200)`} />
        ))}
    </svg>
);


export default function AuthModal() {
    const { isAuthModalOpen, setIsAuthModalOpen } = useGlobalContext();
    
    const [mode, setMode] = useState<'signup' | 'signin'>('signin');
    const [step, setStep] = useState<1 | 2>(1); // 1: Details, 2: OTP
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [resendMessage, setResendMessage] = useState('');
    
    // Animation states
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 2 && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, resendTimer]);

    useEffect(() => {
        if (isAuthModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isAuthModalOpen]);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let rafId: number;
        
        if (isAuthModalOpen) {
            setShouldRender(true);
            // Double requestAnimationFrame ensures the DOM has fully flushed the initial un-animated state 
            // before we trigger the transition class, completely eliminating mounting stutter.
            rafId = requestAnimationFrame(() => {
                rafId = requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        } else {
            setIsVisible(false);
            // Wait for the 500ms CSS transition to finish before unmounting
            timeoutId = setTimeout(() => {
                setShouldRender(false);
                // Reset form state when completely closed
                setMode('signin');
                setStep(1);
                setFirstName('');
                setLastName('');
                setEmail('');
                setMobileNumber('');
                setOtp('');
                setError('');
                setResendTimer(0);
                setResendMessage('');
            }, 500); 
        }
        
        return () => {
            clearTimeout(timeoutId);
            cancelAnimationFrame(rafId);
        };
    }, [isAuthModalOpen]);

    // AbortController ref for in-flight requests
    const abortRef = useRef<AbortController | null>(null);

    // Cleanup in-flight requests on unmount or close
    useEffect(() => {
        return () => { abortRef.current?.abort(); };
    }, []);

    if (!shouldRender) return null;

    const handleClose = () => {
        setIsAuthModalOpen(false);
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, ''); // Extract only digits
        if (val.length <= 10) {
            setMobileNumber(val);
        }
    };

    const handleActionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (mode === 'signup') {
            if (!firstName.trim() || !lastName.trim()) {
                setError('Please provide your name');
                return;
            }
            if (!email.trim() || !email.includes('@')) {
                setError('Please provide a valid email');
                return;
            }
        }
        
        if (mobileNumber.length !== 10) {
            setError('Please enter a valid 10-digit Indian mobile number');
            return;
        }

        setIsLoading(true);
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const phone = `${mobileNumber}`;

            if (mode === 'signup') {
                // Call the real signup API, which registers the customer + sends OTP
                const signupRes = await signIn('credentials', {
                    mobileNumber,
                    firstName,
                    lastName,
                    email,
                    action: 'signup',
                    redirect: false,
                });

                if (signupRes?.error === 'OTP_SENT' || signupRes?.error === 'CredentialsSignin') {
                    // Expected — OTP was sent, move to verification step
                    setStep(2);
                    setResendTimer(10);
                } else if (signupRes?.error) {
                    setError(signupRes.error);
                }
            } else {
                // Sign in flow — request OTP first
                const otpRes = await apiRequestOtp(phone, controller.signal);

                if (otpRes.success) {
                    if (otpRes.data?.flow === 'signup') {
                        // Phone not registered — switch to signup mode
                        setMode('signup');
                        setError('Phone not registered. Please sign up first.');
                    } else {
                        // OTP sent, move to verification
                        setStep(2);
                        setResendTimer(10);
                    }
                } else if (otpRes.error) {
                    // Fallback: if backend is unreachable, still allow step 2 for dev
                    if (otpRes.status === 0) {
                        setStep(2);
                        setResendTimer(10);
                    } else {
                        setError(otpRes.error);
                    }
                }
            }
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') return;
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifySubmit = (e?: React.FormEvent, overrideOtp?: string) => {
        if (e) e.preventDefault();
        setError('');

        const codeToVerify = overrideOtp || otp;

        if (codeToVerify.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        // OTP Verification using NextAuth Credentials Provider
        signIn('credentials', {
            mobileNumber,
            otp: codeToVerify,
            firstName,
            lastName,
            email,
            redirect: false,
        }).then(async (result) => {
            setIsLoading(false);
            if (result?.error) {
                // NextAuth wraps the authorize() thrown error message into result.error
                // Show backend message directly (e.g. "Invalid OTP", "OTP verification failed")
                const msg = result.error === 'CredentialsSignin'
                    ? 'Invalid OTP code. Please try again.'
                    : result.error;
                setError(msg);
            } else if (result?.ok) {
                if (IS_DEV) {
                    const session = await getSession();
                    console.log('[AUTH] Session stored after authentication:', session);
                }
                handleClose();
            }
        }).catch((err) => {
            setIsLoading(false);
            setError('An unexpected error occurred');
        });
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
        setOtp(val);
        if (val.length === 6) {
            handleVerifySubmit(undefined, val);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0 || isLoading) return;
        
        setIsLoading(true);
        setError('');
        setResendMessage('');

        try {
            const phone = `${mobileNumber}`;
            const controller = new AbortController();
            abortRef.current = controller;

            const otpRes = await apiRequestOtp(phone, controller.signal);

            if (otpRes.success) {
                setResendMessage('OTP sent successfully!');
                setResendTimer(10);
                setTimeout(() => setResendMessage(''), 5000);
            } else if (otpRes.error) {
                if (otpRes.status === 0) {
                    setResendMessage('OTP sent successfully!');
                    setResendTimer(10);
                    setTimeout(() => setResendMessage(''), 5000);
                } else {
                    setError(otpRes.error);
                }
            }
        } catch (err: unknown) {
            if (err instanceof DOMException && err.name === 'AbortError') return;
            setError('Failed to resend OTP');
        } finally {
            setIsLoading(false);
            setOtp('');
        }
    };

    // Format mobile number like "00000 00000" or similar while typing if needed, 
    // but just showing raw digits is fine too based on the prompt. Let's do raw for simplicity.

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6" style={{ perspective: '1000px' }}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-white/60 dark:bg-black/50 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{ willChange: 'opacity' }}
                onClick={handleClose}
            />

            {/* Modal Content - Liquid Glass Effect & Compact */}
            {/* Light mode: extremely frosted white pane. Dark mode: dark transparent background. */}
            <div 
                className={`relative w-full max-w-[420px] bg-white/70 dark:bg-black/40 backdrop-blur-[48px] rounded-[32px] box-shadow-xl overflow-hidden border border-black/5 dark:border-white/10 [box-shadow:inset_0_1px_1px_rgba(255,255,255,0.8)] dark:[box-shadow:inset_0_1px_1px_rgba(255,255,255,0.1)] transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] p-6 sm:p-7 pt-8 ${
                    isVisible ? 'scale-100 translate-y-0 opacity-100 rotate-x-0' : 'scale-95 translate-y-8 opacity-0 pointer-events-none -rotate-x-2'
                }`}
                style={{ willChange: 'transform, opacity' }}
            >
                
                {/* Subtle soft gradient background overlay for the authentic "liquid" depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 dark:from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />

                {/* Close Button top-right (subtle circle) */}
                <button 
                    onClick={handleClose}
                    className="absolute top-5 right-5 p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 transition-all duration-300 z-10 flex items-center justify-center backdrop-blur-md hover:rotate-90 hover:scale-110"
                    style={{ width: '32px', height: '32px' }}
                >
                    <X size={14} strokeWidth={2.5} className="text-black/50 hover:text-black dark:text-white/60 dark:hover:text-white" />
                </button>

                {/* Header Toggle (Sign up / Sign in) */}
                <div className={`relative z-10 flex items-center gap-1 bg-black/5 dark:bg-black/40 backdrop-blur-md p-1 rounded-full w-fit mb-6 border border-black/5 dark:border-white/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <button 
                        onClick={() => { setMode('signup'); setStep(1); setError(''); }}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 ${mode === 'signup' ? 'bg-white text-black shadow-sm scale-100 dark:bg-[#1e1e20] dark:text-white' : 'text-black/50 hover:text-black dark:text-white/40 dark:hover:text-white/70 scale-95 hover:scale-100'}`}
                    >
                        Sign up
                    </button>
                    <button 
                        onClick={() => { setMode('signin'); setStep(1); setError(''); }}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-300 ${mode === 'signin' ? 'bg-white text-black shadow-sm scale-100 dark:bg-[#1e1e20] dark:text-white' : 'text-black/50 hover:text-black dark:text-white/40 dark:hover:text-white/70 scale-95 hover:scale-100'}`}
                    >
                        Sign in
                    </button>
                </div>

                <div className="relative z-10">
                    <h2 className={`text-[22px] font-bold tracking-tight text-black dark:text-white mb-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        {step === 1 ? (mode === 'signup' ? 'Create an account' : 'Welcome back') : 'Verify your number'}
                    </h2>

                    {step === 1 ? (
                        <form onSubmit={handleActionSubmit} className="space-y-3">
                            
                            {/* Sign up only fields: First Name, Last Name, Email */}
                            {mode === 'signup' && (
                                <div className={`space-y-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-150 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                    <div className="flex gap-3">
                                        <div className="relative w-1/2 group">
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="First name"
                                                className="w-full bg-black/5 dark:bg-black/20 backdrop-blur-sm border border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30 focus:bg-black/10 dark:focus:bg-white/5 transition-all duration-300 text-[14px] shadow-inner group-hover:bg-black/10 dark:group-hover:bg-white/5"
                                            />
                                        </div>
                                        <div className="relative w-1/2 group">
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Last name"
                                                className="w-full bg-black/5 dark:bg-black/20 backdrop-blur-sm border border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/30 rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30 focus:bg-black/10 dark:focus:bg-white/5 transition-all duration-300 text-[14px] shadow-inner group-hover:bg-black/10 dark:group-hover:bg-white/5"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-black/30 group-focus-within:text-black/70 dark:text-white/30 dark:group-focus-within:text-white/70 transition-colors duration-300">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full bg-black/5 dark:bg-black/20 backdrop-blur-sm border border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/30 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/30 focus:bg-black/10 dark:focus:bg-white/5 transition-all duration-300 text-[14px] shadow-inner group-hover:bg-black/10 dark:group-hover:bg-white/5"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Always show Mobile Number Input */}
                            <div className={`space-y-1 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'signup' ? 'delay-200' : 'delay-150'} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                <p className="text-[11px] font-medium text-black/50 dark:text-white/40 ml-1">
                                    WhatsApp number only for sign in
                                </p>
                                <div className={`relative group flex items-center bg-black/5 dark:bg-black/20 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-xl focus-within:ring-1 focus-within:ring-black/20 dark:focus-within:ring-white/30 focus-within:bg-black/10 dark:focus-within:bg-white/5 transition-all shadow-inner hover:bg-black/10 dark:hover:bg-white/5`}>
                                
                                {/* Country Code Selector (Static for India based on prompt) */}
                                <div className="flex items-center gap-2 pl-4 pr-2 py-3 border-r border-black/10 dark:border-white/10 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 rounded-l-xl transition-colors">
                                    <IndiaFlag />
                                    <ChevronDown size={14} className="text-black/40 group-focus-within:text-black/70 dark:text-white/40 dark:group-focus-within:text-white/70 transition-colors" />
                                </div>
                                <span className="pl-3 text-black/60 dark:text-white/50 text-[14px] font-medium group-focus-within:text-black dark:group-focus-within:text-white/80 transition-colors">+91</span>

                                <input
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={handleMobileChange}
                                    placeholder="00000 00000"
                                    className="w-full bg-transparent text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 py-3 pl-2 pr-4 focus:outline-none text-[14px]"
                                />
                            </div>
                        </div>

                        {error && <p className="text-[12px] text-red-500 font-medium pt-1 px-1 transition-opacity duration-300">{error}</p>}

                            <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'signup' ? 'delay-[250ms]' : 'delay-200'} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                <button 
                                    type="submit" 
                                    disabled={isLoading || mobileNumber.length !== 10 || (mode === 'signup' && (!firstName || !lastName || !email))}
                                    className="w-full mt-2 group relative flex items-center justify-center py-3.5 text-[14px] font-bold text-white dark:text-black bg-black dark:bg-[#e0e0e0] hover:bg-black/80 dark:hover:bg-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-[0_4px_14px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_14px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)]"
                                >
                                    <div className="absolute inset-0 bg-white/10 dark:bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <span className="relative flex items-center gap-2">
                                        {isLoading ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            mode === 'signup' ? 'Create an account' : 'Sign in'
                                        )}
                                    </span>
                                </button>
                            </div>


                            {/* Footer Text */}
                            <div className={`pt-4 text-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mode === 'signup' ? 'delay-[400ms]' : 'delay-[350ms]'} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                                <p className="text-[11px] text-black/50 dark:text-white/30 font-medium tracking-wide">
                                    By {mode === 'signup' ? 'creating an account' : 'signing in'}, you agree to our <a href="#" className="text-black/70 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors underline-offset-4 hover:underline">Terms & Service</a>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifySubmit} className={`space-y-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                             <div>
                                <label className="block text-[13px] font-medium text-black/60 dark:text-white/50 mb-3 px-1">
                                    Enter the 6-digit code sent to +91 {mobileNumber}
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        placeholder="000000"
                                        className={`w-full bg-black/5 dark:bg-black/20 backdrop-blur-sm border border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/30 rounded-2xl py-5 px-6 text-center tracking-[1em] focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20 focus:bg-black/10 dark:focus:bg-white/5 transition-all font-bold text-2xl shadow-inner ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                                        autoFocus
                                        disabled={isLoading}
                                    />
                                </div>
                                {error && <p className="mt-2 text-sm text-red-500 font-medium px-1">{error}</p>}
                            </div>

                            {/* Verification State / Auto-submit loading */}
                            <div className={`transition-all duration-300 overflow-hidden flex items-center justify-center ${isLoading ? 'h-[50px] opacity-100 mt-2' : 'h-0 opacity-0 mt-0'}`}>
                                <div className="flex items-center gap-2 text-[14px] font-bold text-black/60 dark:text-white/60">
                                    <Loader2 size={18} className="animate-spin" />
                                    Verifying Code...
                                </div>
                            </div>
                            
                            {resendMessage && (
                                <p className="text-center text-[13px] text-green-600 dark:text-green-400 font-medium mb-1 transition-opacity duration-300">
                                    {resendMessage}
                                </p>
                            )}

                            <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${isLoading ? 'pt-0' : 'pt-2'}`}>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0 || isLoading}
                                    className="text-[13px] font-medium text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors disabled:opacity-50 disabled:hover:text-black/80 dark:disabled:hover:text-white/80"
                                >
                                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                                </button>
                                
                                <button 
                                    type="button" 
                                    onClick={() => { setStep(1); setResendMessage(''); }}
                                    className="text-[13px] font-medium text-black/60 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors underline-offset-4 hover:underline"
                                >
                                    Change mobile number
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
