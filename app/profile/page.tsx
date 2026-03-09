"use client";

import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, Package, Clock, CheckCircle2, MapPin, Phone, Mail, ShieldCheck, X } from 'lucide-react';
import Image from 'next/image';

// --- MOCK DATA ---
const ONGOING_ORDER = {
    id: "ORD-2026-9842A",
    product: "Weinix Modular Hive Alpha",
    status: "In Production",
    progress: 65, // percentage
    estimatedDelivery: "April 15, 2026",
    image: "/images/bg1.png" // using existing hero bg as a placeholder
};

const BOUGHT_HISTORY = [
    { id: "ORD-2025-1102B", product: "Aero Desk Pod", date: "Nov 02, 2025", status: "Delivered", price: "₹1,45,000" },
    { id: "ORD-2025-0614C", product: "Lounge Expansion Module", date: "Jun 14, 2025", status: "Delivered", price: "₹2,80,000" }
];

const BOUGHT_HISTORY_FULL = [
    { id: "ORD-2025-1102B", product: "Aero Desk Pod", date: "Nov 02, 2025", status: "Delivered", price: "₹1,45,000" },
    { id: "ORD-2025-0614C", product: "Lounge Expansion Module", date: "Jun 14, 2025", status: "Delivered", price: "₹2,80,000" },
    { id: "ORD-2024-0922D", product: "Weinix Echo Base", date: "Sep 22, 2024", status: "Delivered", price: "₹8,50,000" },
    { id: "ORD-2024-0105E", product: "Solar Roof IntegrationKit", date: "Jan 05, 2024", status: "Delivered", price: "₹3,15,000" },
];
// -----------------

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [shouldRenderHistory, setShouldRenderHistory] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let rafId: number;
        
        if (isHistoryModalOpen) {
            setShouldRenderHistory(true);
            rafId = requestAnimationFrame(() => {
                rafId = requestAnimationFrame(() => {
                    setIsHistoryVisible(true);
                });
            });
        } else {
            setIsHistoryVisible(false);
            timeoutId = setTimeout(() => {
                setShouldRenderHistory(false);
            }, 500); 
        }
        
        return () => {
            clearTimeout(timeoutId);
            cancelAnimationFrame(rafId);
        };
    }, [isHistoryModalOpen]);

    useEffect(() => {
        setMounted(true);
        if (status === 'unauthenticated') {
            router.push('/home');
        }
    }, [status, router]);

    if (!mounted || status === 'loading' || !session?.user) return null;

    const user = session.user as any;

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/home' });
    };

    return (
        <div className="min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] text-black dark:text-white pt-24 pb-16 px-5 relative overflow-hidden transition-colors duration-500">
            {/* Background Ambient Glows - radial gradients fix the bounding-box clipping bug of blur filters */}
            <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.04)_0%,transparent_60%)] pointer-events-none" />

            <div className="max-w-[1100px] mx-auto relative z-10 w-full">
                
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">
                            Welcome back, <span className="text-[#8aab00] dark:text-[#ccff00]">{user.name?.split(' ')[0] || user.firstName}</span>.
                        </h1>
                        <p className="text-black/50 dark:text-white/40 text-[13px] md:text-[14px] font-medium tracking-wide">
                            Manage your account, track ongoing modular builds, and view your purchase history.
                        </p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="group flex flex-shrink-0 items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-red-500/10 dark:hover:bg-red-500/10 border border-black/10 dark:border-white/10 hover:border-red-500/30 text-black/60 dark:text-white/60 hover:text-red-500 transition-all duration-300 text-[11px] font-bold uppercase tracking-widest w-fit"
                    >
                        <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Log out
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Profile Details & History */}
                    <div className="lg:col-span-4 flex flex-col gap-6 w-full">
                        
                        {/* Profile Card */}
                        <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/40 dark:text-white/40 mb-5 flex items-center gap-2">
                                <ShieldCheck size={14} />
                                Basic Details
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-3">
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#8aab00]/90 dark:text-[#ccff00]/70 font-bold mb-1">Full Name</p>
                                    <p className="text-[14px] font-bold text-black/90 dark:text-white/90">{user.firstName} {user.lastName || ''}</p>
                                </div>
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center text-black/50 dark:text-white/50">
                                        <Phone size={12} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Mobile Number</p>
                                        <p className="text-[13px] font-bold text-black/90 dark:text-white/90">+91 {user.mobileNumber}</p>
                                    </div>
                                </div>
                                {user.email && (
                                    <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center text-black/50 dark:text-white/50">
                                            <Mail size={12} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Email Address</p>
                                            <p className="text-[13px] font-bold text-black/90 dark:text-white/90">{user.email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order History */}
                        <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col h-full">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/40 dark:text-white/40 flex items-center gap-2">
                                    <Clock size={14} />
                                    History
                                </h2>
                                <button 
                                    onClick={() => setIsHistoryModalOpen(true)}
                                    className="text-[9px] font-bold tracking-widest uppercase text-[#8aab00] dark:text-[#ccff00] hover:text-black dark:hover:text-white transition-colors bg-[#ccff00]/15 dark:bg-[#ccff00]/10 hover:bg-black/5 dark:hover:bg-white/10 px-3 py-1.5 rounded-full border border-[#ccff00]/30 dark:border-[#ccff00]/20 hover:border-black/20 dark:hover:border-white/20"
                                >
                                    View All
                                </button>
                            </div>
                            
                            <div className="space-y-3 flex-1">
                                {BOUGHT_HISTORY.map((item, idx) => (
                                    <div key={idx} className="group relative bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.03] rounded-xl p-3 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="font-bold text-[13px] mb-1 group-hover:text-[#8aab00] dark:group-hover:text-[#ccff00] transition-colors line-clamp-1">{item.product}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-black/40 dark:text-white/40 font-bold uppercase tracking-wider">
                                                    <span>{item.date}</span>
                                                    <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                                                    <span className="truncate max-w-[80px]">{item.id}</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="font-bold text-[13px] text-black dark:text-white">{item.price}</p>
                                                <p className="text-[9px] text-[#8aab00] dark:text-[#ccff00] uppercase tracking-widest font-bold mt-1 opacity-80">{item.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Ongoing Buys */}
                    <div className="lg:col-span-8 w-full">
                        <div className="bg-white/95 dark:bg-[#0f0f0f]/90 backdrop-blur-2xl border border-black/5 dark:border-white/[0.08] rounded-[24px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] h-full relative overflow-hidden group">
                            
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] dark:from-white/[0.02] via-transparent to-transparent opacity-50 pointer-events-none" />

                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 relative z-10">
                                <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/60 dark:text-white/60 flex items-center gap-2">
                                    <Package size={14} className="text-[#8aab00] dark:text-[#ccff00]" />
                                    Ongoing Build
                                </h2>
                                <span className="px-3 py-1 rounded-full bg-[#ccff00]/20 dark:bg-[#ccff00]/10 border border-[#ccff00]/30 dark:border-[#ccff00]/20 text-[#688200] dark:text-[#ccff00] text-[9px] font-bold uppercase tracking-widest animate-pulse">
                                    {ONGOING_ORDER.status}
                                </span>
                            </div>

                            {/* Main Active Order Card */}
                            <div className="relative z-10 flex flex-col sm:flex-row gap-5 items-stretch bg-black/5 dark:bg-[#141414]/90 border border-black/5 dark:border-white/[0.05] rounded-2xl p-4 group-hover:bg-black/10 dark:group-hover:bg-[#181818]/90 transition-colors duration-500 shadow-inner">
                                
                                {/* Placeholder Image for Modular Home */}
                                <div className="w-full sm:w-36 h-36 sm:h-auto bg-black/10 dark:bg-black/60 rounded-xl border border-black/10 dark:border-white/5 overflow-hidden relative flex-shrink-0">
                                    <div className="absolute inset-0 opacity-80 dark:opacity-50 mix-blend-multiply dark:mix-blend-luminosity">
                                         <Image src={ONGOING_ORDER.image} alt={ONGOING_ORDER.product} fill className="object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 dark:from-black/90 dark:via-black/30 to-transparent" />
                                    <div className="absolute bottom-3 left-3">
                                        <p className="text-[8px] uppercase tracking-[0.2em] text-[#8aab00] dark:text-[#ccff00] font-bold mb-0.5">Model</p>
                                        <p className="font-bold text-[12px] leading-tight text-black/90 dark:text-white/90">Alpha Series</p>
                                    </div>
                                </div>

                                <div className="flex-1 w-full flex flex-col justify-center py-1">
                                    <p className="text-[10px] text-black/40 dark:text-white/40 font-bold uppercase tracking-widest mb-1.5">Order #{ONGOING_ORDER.id}</p>
                                    <h3 className="text-xl font-black tracking-tight mb-4 text-black/90 dark:text-white/90">{ONGOING_ORDER.product}</h3>
                                    
                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[9px] font-bold tracking-[0.15em] text-black/50 dark:text-white/50 uppercase">Manufacturing Progress</span>
                                            <span className="text-[12px] font-black text-[#8aab00] dark:text-[#ccff00] leading-none">{ONGOING_ORDER.progress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-black/10 dark:bg-black/60 rounded-full overflow-hidden border border-black/10 dark:border-white/5 relative">
                                            <div 
                                                className="absolute inset-y-0 left-0 bg-[#ccff00] shadow-sm dark:shadow-[0_0_10px_rgba(204,255,0,0.5)] transition-all duration-1000 ease-out" 
                                                style={{ width: `${ONGOING_ORDER.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white dark:bg-[#0a0a0a] rounded-lg p-2.5 border border-black/[0.05] dark:border-white/[0.05]">
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold flex items-center gap-1.5 mb-1">
                                                <MapPin size={10} /> Delivery 
                                            </p>
                                            <p className="text-[11px] font-bold text-black/80 dark:text-white/80">Bangalore, IN</p>
                                        </div>
                                        <div className="bg-white dark:bg-[#0a0a0a] rounded-lg p-2.5 border border-black/[0.05] dark:border-white/[0.05]">
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold flex items-center gap-1.5 mb-1">
                                                <Clock size={10} /> Est. Completion
                                            </p>
                                            <p className="text-[11px] font-black text-[#8aab00] dark:text-[#ccff00]">April 15, 2026</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Stepper */}
                            <div className="mt-8 relative z-10 px-2 sm:px-6">
                                <div className="absolute top-[6px] left-4 right-4 sm:left-8 sm:right-8 h-[2px] bg-black/10 dark:bg-white/5" />
                                <div className="absolute top-[6px] left-4 sm:left-8 h-[2px] bg-[#ccff00] transition-all duration-1000 w-[60%] shadow-none dark:shadow-[0_0_10px_rgba(204,255,0,0.5)]" />
                                
                                <div className="relative flex justify-between">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#ccff00] flex items-center justify-center shadow-sm dark:shadow-[0_0_10px_rgba(204,255,0,0.4)]">
                                            <CheckCircle2 size={10} className="text-black" />
                                        </div>
                                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold text-black/70 dark:text-white/70">Confirmed</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#ccff00] flex items-center justify-center shadow-sm dark:shadow-[0_0_10px_rgba(204,255,0,0.4)]">
                                            <CheckCircle2 size={10} className="text-black" />
                                        </div>
                                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold text-black/70 dark:text-white/70">Designing</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white dark:bg-black border-[2px] border-[#ccff00] flex items-center justify-center z-10">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
                                        </div>
                                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-black text-[#8aab00] dark:text-[#ccff00]">Production</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-white dark:bg-black border-[2px] border-black/10 dark:border-white/10 flex items-center justify-center z-10" />
                                        <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold text-black/30 dark:text-white/20">Delivery</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            {/* View All History Modal */}
            {shouldRenderHistory && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6" style={{ perspective: '1000px' }}>
                    <div 
                        className={`absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-md transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHistoryVisible ? 'opacity-100' : 'opacity-0'}`} 
                        onClick={() => setIsHistoryModalOpen(false)} 
                        style={{ willChange: 'opacity' }}
                    />
                    <div 
                        className={`relative w-full max-w-[600px] max-h-[80vh] flex flex-col bg-white/95 dark:bg-[#111] backdrop-blur-3xl rounded-[24px] shadow-2xl dark:shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-black/10 dark:border-white/10 overflow-hidden transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHistoryVisible ? 'scale-100 translate-y-0 opacity-100 rotate-x-0' : 'scale-95 translate-y-8 opacity-0 pointer-events-none -rotate-x-2'}`}
                        style={{ willChange: 'transform, opacity' }}
                    >
                        <div className="flex items-center justify-between p-5 border-b border-black/5 dark:border-white/5 bg-[#f5f5f5] dark:bg-[#141414]">
                            <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/80 dark:text-white/80 flex items-center gap-2">
                                <Clock size={16} className="text-[#8aab00] dark:text-[#ccff00]" />
                                Full Purchase History
                            </h2>
                            <button onClick={() => setIsHistoryModalOpen(false)} className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-black/50 dark:text-white">
                                <X size={14} />
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1 space-y-3">
                            {BOUGHT_HISTORY_FULL.map((item, idx) => (
                                <div key={idx} className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.03] rounded-xl p-4 flex justify-between items-center gap-4 hover:bg-black/[0.05] dark:hover:bg-white/[0.04] transition-colors">
                                    <div>
                                        <p className="font-bold text-[14px] mb-1 text-black/90 dark:text-white/90">{item.product}</p>
                                        <div className="flex items-center gap-3 text-[11px] text-black/50 dark:text-white/40 font-bold uppercase tracking-wider">
                                            <span>{item.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                                            <span>{item.id}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-black text-[14px] text-black dark:text-white">{item.price}</p>
                                        <p className="text-[10px] text-[#8aab00] dark:text-[#ccff00] uppercase tracking-widest font-bold mt-1 opacity-80">{item.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
