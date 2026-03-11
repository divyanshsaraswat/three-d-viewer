"use client";

import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalContext';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, MapPin, Phone, Mail, ShieldCheck, Loader2, Building2, Briefcase, MessageSquare, Activity, CalendarDays } from 'lucide-react';
import { getCustomerProfile, type CustomerProfile } from '@/utils/api/profile';
import TicketsModal from '@/components/TicketsModal';

const IS_DEV = process.env.NEXT_PUBLIC_EDITOR_MODE !== "prod";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
    
    // Real Profile State
    const [profile, setProfile] = useState<CustomerProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        setMounted(true);
        if (status === 'unauthenticated') {
            router.push('/home');
        }
        if (IS_DEV && status === 'authenticated' && session) {
            console.log('[PROFILE] Session stored object:', session);
        }
    }, [status, router, session]);

    // Fetch Profile Data
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const fetchProfile = async () => {
            if (status !== 'authenticated' || !session?.user) return;
            
            const user = session.user as any;
            const customerId = user.customerId || user.id;

            if (!customerId) {
                setIsLoadingProfile(false);
                return;
            }

            setIsLoadingProfile(true);
            try {
                const res = await getCustomerProfile(customerId, controller.signal);
                if (isMounted && res.success && res.data?.customer) {
                    setProfile(res.data.customer);
                }
            } catch (error) {
                // Ignore abort errors
                if (error instanceof DOMException && error.name === 'AbortError') return;
                console.error("Failed to fetch profile:", error);
            } finally {
                if (isMounted) {
                    setIsLoadingProfile(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [status, session]);

    if (!mounted || status === 'loading' || !session?.user) return null;

    const sessionUser = session.user as any;
    
    // Use real profile data if available, fallback to session data
    const displayName = profile?.profile?.name || sessionUser.firstName + (sessionUser.lastName ? ` ${sessionUser.lastName}` : '');
    const displayPhone = profile?.phone || sessionUser.mobileNumber;
    const displayEmail = profile?.profile?.email || sessionUser.email;

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
                            Welcome back, <span className="text-[#8aab00] dark:text-[#ccff00]">{displayName.split(' ')[0]}</span>.
                        </h1>
                        <p className="text-black/50 dark:text-white/40 text-[13px] md:text-[14px] font-medium tracking-wide">
                            Manage your account, preferences, and recent activity.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsTicketsModalOpen(true)}
                            className="group flex flex-shrink-0 items-center gap-2 px-5 py-2.5 rounded-full bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/20 hover:border-[#ccff00]/40 text-[#8aab00] dark:text-[#ccff00] transition-all duration-300 text-[11px] font-bold uppercase tracking-widest w-fit"
                        >
                            <MessageSquare size={14} className="group-hover:scale-110 transition-transform" />
                            Manage Tickets
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="group flex flex-shrink-0 items-center gap-2 px-5 py-2.5 rounded-full bg-black/5 dark:bg-white/5 hover:bg-red-500/10 dark:hover:bg-red-500/10 border border-black/10 dark:border-white/10 hover:border-red-500/30 text-black/60 dark:text-white/60 hover:text-red-500 transition-all duration-300 text-[11px] font-bold uppercase tracking-widest w-fit"
                        >
                            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Log out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Profile Details & History */}
                    <div className="lg:col-span-4 flex flex-col gap-6 w-full">
                        
                        {/* Profile Card */}
                        <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative">
                            <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/40 dark:text-white/40 mb-5 flex items-center gap-2">
                                <ShieldCheck size={14} />
                                Basic Details
                            </h2>
                            
                            {isLoadingProfile && (
                                <div className="absolute top-5 right-5">
                                    <Loader2 size={14} className="animate-spin text-black/30 dark:text-white/30" />
                                </div>
                            )}
                            
                            <div className={`space-y-4 transition-opacity duration-300 ${isLoadingProfile ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-3">
                                    <p className="text-[9px] uppercase tracking-[0.2em] text-[#8aab00]/90 dark:text-[#ccff00]/70 font-bold mb-1">Full Name</p>
                                    <p className="text-[14px] font-bold text-black/90 dark:text-white/90">{displayName}</p>
                                </div>
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center text-black/50 dark:text-white/50">
                                        <Phone size={12} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Mobile Number</p>
                                        <p className="text-[13px] font-bold text-black/90 dark:text-white/90">+91 {displayPhone}</p>
                                    </div>
                                </div>
                                {displayEmail && (
                                    <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center text-black/50 dark:text-white/50">
                                            <Mail size={12} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Email Address</p>
                                            <p className="text-[13px] font-bold text-black/90 dark:text-white/90">{displayEmail}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Business Profile */}
                        <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/40 dark:text-white/40 mb-5 flex items-center gap-2">
                                <Briefcase size={14} />
                                Business Profile
                            </h2>
                            
                            <div className={`space-y-4 transition-opacity duration-300 ${isLoadingProfile ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center text-black/50 dark:text-white/50">
                                        <Building2 size={12} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Company</p>
                                        <p className="text-[13px] font-bold text-black/90 dark:text-white/90 capitalize">
                                            {profile?.profile?.company || 'Not Specified'}
                                        </p>
                                    </div>
                                    {profile?.profile?.businessType && (
                                        <div className="px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#8aab00] dark:text-[#ccff00]">
                                                {profile.profile.businessType.toUpperCase()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 flex items-center justify-center text-black/50 dark:text-white/50">
                                        <MapPin size={12} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Location</p>
                                        <p className="text-[13px] font-bold text-black/90 dark:text-white/90">
                                            {profile?.profile?.address?.country || 'Not Specified'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Communication Preferences */}
                        <div className="bg-white/90 dark:bg-[#111111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/40 dark:text-white/40 mb-5 flex items-center gap-2">
                                <MessageSquare size={14} />
                                Preferences
                            </h2>
                            
                            <div className={`transition-opacity duration-300 ${isLoadingProfile ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-4 flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-[13px] mb-1 text-black/90 dark:text-white/90">Communication</p>
                                        <p className="text-[11px] text-black/50 dark:text-white/40 font-medium">How we reach you for updates</p>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-full bg-[#ccff00]/15 dark:bg-[#ccff00]/10 border border-[#ccff00]/30 dark:border-[#ccff00]/20">
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-[#688200] dark:text-[#ccff00] capitalize">
                                            {profile?.preferences?.communicationChannel || 'Standard'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity Log */}
                    <div className="lg:col-span-8 w-full">
                        <div className="bg-white/95 dark:bg-[#0f0f0f]/90 backdrop-blur-2xl border border-black/5 dark:border-white/[0.08] rounded-[24px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] h-full min-h-[500px] relative overflow-hidden group">
                            
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] dark:from-white/[0.02] via-transparent to-transparent opacity-50 pointer-events-none" />

                            <div className="flex flex-wrap justify-between items-center gap-4 mb-8 relative z-10">
                                <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/60 dark:text-white/60 flex items-center gap-2">
                                    <Activity size={14} className="text-[#8aab00] dark:text-[#ccff00]" />
                                    Recent Activity
                                </h2>
                                
                                {profile?.status === 'active' && (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 dark:bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-[9px] font-bold uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Active Account
                                    </span>
                                )}
                            </div>

                            <div className="relative z-10">
                                {isLoadingProfile ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-black/30 dark:text-white/30 space-y-4">
                                        <Loader2 size={24} className="animate-spin" />
                                        <p className="text-[11px] font-bold uppercase tracking-widest">Loading sequence...</p>
                                    </div>
                                ) : profile?.activityLog && profile.activityLog.length > 0 ? (
                                    <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[15px] before:w-[2px] before:bg-black/5 dark:before:bg-white/5">
                                        {profile.activityLog.map((log: any, idx: number) => {
                                            const date = new Date(log.timestamp);
                                            const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                            const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                                            return (
                                                <div key={log._id || idx} className="relative pl-10 group/log">
                                                    {/* Timeline Node */}
                                                    <div className="absolute left-0 top-1.5 w-[32px] h-[32px] rounded-full bg-white dark:bg-[#111] border-[2px] border-black/10 dark:border-white/10 flex items-center justify-center shadow-sm z-10 group-hover/log:border-[#8aab00] dark:group-hover/log:border-[#ccff00] transition-colors">
                                                        <div className="w-2 h-2 rounded-full bg-black/20 dark:bg-white/20 group-hover/log:bg-[#8aab00] dark:group-hover/log:bg-[#ccff00] transition-colors" />
                                                    </div>

                                                    {/* Log Content Card */}
                                                    <div className="bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.03] rounded-2xl p-4 sm:p-5 transition-colors duration-300">
                                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-3">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1.5">
                                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#8aab00] dark:text-[#ccff00]">
                                                                        {log.action.replace(/_/g, ' ')}
                                                                    </p>
                                                                    {log.details?.type && (
                                                                        <>
                                                                            <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20" />
                                                                            <span className="text-[9px] uppercase tracking-wider font-bold text-black/40 dark:text-white/30">
                                                                                {log.details.type}
                                                                            </span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                                <h3 className="text-[15px] font-bold text-black/90 dark:text-white/90">
                                                                    {log.details?.subject || "Activity Logged"}
                                                                </h3>
                                                            </div>
                                                            <div className="text-left sm:text-right flex items-center sm:items-end gap-2 sm:gap-0 sm:flex-col opacity-60">
                                                                <p className="text-[11px] font-bold uppercase flex items-center gap-1.5">
                                                                    <CalendarDays size={12} className="hidden sm:block" />
                                                                    {formattedDate}
                                                                </p>
                                                                <p className="text-[10px] font-bold tracking-widest">{formattedTime}</p>
                                                            </div>
                                                        </div>

                                                        {/* Optional details grid for extra data */}
                                                        {log.details?.ticketId && (
                                                            <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-2">
                                                                <div className="bg-white dark:bg-black/40 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/5">
                                                                    <span className="text-[9px] text-black/40 dark:text-white/40 uppercase font-bold mr-2 tracking-widest">ID</span>
                                                                    <span className="text-[11px] font-black">{log.details.ticketId}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                        <div className="w-16 h-16 rounded-full bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-center mb-4 text-black/20 dark:text-white/20">
                                            <Activity size={24} />
                                        </div>
                                        <p className="text-[13px] font-bold text-black/60 dark:text-white/60 mb-1">No Activity Yet</p>
                                        <p className="text-[11px] font-medium text-black/40 dark:text-white/40 max-w-[250px]">
                                            When you interact under your account, your logs will beautifully appear here.
                                        </p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            
            <TicketsModal isOpen={isTicketsModalOpen} onClose={() => setIsTicketsModalOpen(false)} />
        </div>
    );
}
