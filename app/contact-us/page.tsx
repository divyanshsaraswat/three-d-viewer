"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    Mail, Phone, MapPin, Send, CheckCircle2,
    Loader2, Building2, ChevronDown, ArrowRight
} from 'lucide-react';
import { submitContactInquiry } from '@/utils/api/contact';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ContactUsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [company, setCompany] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [businessType, setBusinessType] = useState<'b2b' | 'd2c'>('d2c');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const [error, setError] = useState('');

    // Cleanup on unmount
    useEffect(() => {
        return () => { abortRef.current?.abort(); };
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.2 });

        tl.fromTo('.contact-badge',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        )
        .fromTo('.contact-title',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power4.out" },
            "-=0.6"
        )
        .fromTo('.contact-subtitle',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
            "-=0.6"
        );

        // Cards
        const sections = gsap.utils.toArray('.contact-animate') as HTMLElement[];
        sections.forEach((section: HTMLElement) => {
            gsap.set(section, { opacity: 0, y: 40 });
            gsap.to(section, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 88%",
                }
            });
        });
    }, { scope: containerRef });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !email.trim() || !phone.trim() || !subject.trim() || !message.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        if (phone.replace(/\D/g, '').length < 10) {
            setError('Please enter a valid phone number.');
            return;
        }

        setIsSubmitting(true);
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const fullPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
            const res = await submitContactInquiry({
                name,
                email,
                phone: fullPhone,
                company: company || undefined,
                subject,
                message,
                businessType,
            }, controller.signal);

            if (res.success && res.data) {
                setTicketId(res.data.ticketId || '');
                setIsSubmitted(true);
            } else if (res.error) {
                setError(res.error);
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-sm border border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/30 dark:placeholder:text-white/25 rounded-xl py-3.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#ccff00]/50 focus:border-[#ccff00]/40 focus:bg-black/[0.06] dark:focus:bg-white/[0.06] transition-all duration-300 text-[14px] font-medium";

    return (
        <main ref={containerRef} className="relative min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] pt-[18vh] pb-32 overflow-hidden font-sans text-black dark:text-white transition-colors duration-500">

            {/* Background ambient glows */}
            <div className="absolute top-[-15%] left-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.06)_0%,transparent_60%)] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.04)_0%,transparent_60%)] pointer-events-none" />

            {/* HERO */}
            <section className="relative w-full max-w-[1000px] mx-auto flex flex-col items-center text-center px-4 md:px-8 mb-20 z-10">
                {/* Animated gradient backdrop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] sm:w-full min-w-[400px] max-w-[600px] aspect-square -z-10 pointer-events-none opacity-40 dark:opacity-20 blur-[100px] saturate-200">
                    <div className="absolute top-[15%] left-[20%] w-[50%] h-[50%] bg-[#ccff00] rounded-full mix-blend-multiply dark:mix-blend-screen animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                    <div className="absolute bottom-[15%] right-[20%] w-[50%] h-[50%] bg-[#88aa00] rounded-full mix-blend-multiply dark:mix-blend-screen animate-[pulse_5s_cubic-bezier(0.4,0,0.6,1)_infinite]" style={{ animationDelay: '1s' }} />
                </div>

                <span className="contact-badge bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/20 font-semibold tracking-widest text-[10px] sm:text-xs px-6 py-2 rounded-full uppercase mb-8">
                    Contact Us
                </span>

                <h1 className="contact-title text-4xl sm:text-5xl md:text-[4.5rem] font-black leading-[0.95] tracking-tighter uppercase mb-6">
                    LET&apos;S BUILD
                    <span className="block font-serif italic font-light text-2xl sm:text-3xl md:text-4xl text-black/60 dark:text-white/60 tracking-normal capitalize mt-3">
                        Something Extraordinary Together
                    </span>
                </h1>

                <p className="contact-subtitle text-sm md:text-base font-medium tracking-wide text-black/60 dark:text-white/50 max-w-xl mx-auto leading-relaxed">
                    Whether you&apos;re a B2B partner looking for sustainable raw materials or a consumer exploring circular products — we&apos;re ready to talk.
                </p>
            </section>

            {/* MAIN CONTENT */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* LEFT: Contact Form */}
                    <div className="lg:col-span-7 contact-animate">
                        <div className="bg-white/90 dark:bg-[#111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
                            {/* Inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ccff00]/[0.02] via-transparent to-transparent pointer-events-none" />

                            {!isSubmitted ? (
                                <div className="relative z-10">
                                    <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/40 dark:text-white/40 mb-6 flex items-center gap-2">
                                        <Send size={14} className="text-[#8aab00] dark:text-[#ccff00]" />
                                        Send us a message
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {/* Name & Email */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-2 pl-1">Full Name *</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                    placeholder="Your full name"
                                                    className={inputClass}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-2 pl-1">Email Address *</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={e => setEmail(e.target.value)}
                                                    placeholder="you@example.com"
                                                    className={inputClass}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Phone & Company */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-2 pl-1">Phone Number *</label>
                                                <div className="relative flex items-center">
                                                    <span className="absolute left-4 text-black/40 dark:text-white/30 text-[13px] font-medium">+91</span>
                                                    <input
                                                        type="tel"
                                                        value={phone}
                                                        onChange={e => {
                                                            const val = e.target.value.replace(/\D/g, '');
                                                            if (val.length <= 10) setPhone(val);
                                                        }}
                                                        placeholder="00000 00000"
                                                        className={`${inputClass} pl-12`}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-2 pl-1">Company</label>
                                                <input
                                                    type="text"
                                                    value={company}
                                                    onChange={e => setCompany(e.target.value)}
                                                    placeholder="Your company name"
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        {/* Business Type Toggle */}
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-2 pl-1">Business Type *</label>
                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setBusinessType('b2b')}
                                                    className={`flex-1 py-3 rounded-xl text-[13px] font-bold tracking-wide border transition-all duration-300 ${
                                                        businessType === 'b2b'
                                                            ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-[0_4px_14px_rgba(204,255,0,0.2)]'
                                                            : 'bg-black/[0.03] dark:bg-white/[0.04] border-black/10 dark:border-white/10 text-black/50 dark:text-white/40 hover:border-[#ccff00]/30'
                                                    }`}
                                                >
                                                    <Building2 size={14} className="inline mr-2 -mt-0.5" />
                                                    B2B Partner
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setBusinessType('d2c')}
                                                    className={`flex-1 py-3 rounded-xl text-[13px] font-bold tracking-wide border transition-all duration-300 ${
                                                        businessType === 'd2c'
                                                            ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-[0_4px_14px_rgba(204,255,0,0.2)]'
                                                            : 'bg-black/[0.03] dark:bg-white/[0.04] border-black/10 dark:border-white/10 text-black/50 dark:text-white/40 hover:border-[#ccff00]/30'
                                                    }`}
                                                >
                                                    Consumer (D2C)
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-2 pl-1">Subject *</label>
                                            <input
                                                type="text"
                                                value={subject}
                                                onChange={e => setSubject(e.target.value)}
                                                placeholder="What is this about?"
                                                className={inputClass}
                                                required
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-2 pl-1">Message *</label>
                                            <textarea
                                                value={message}
                                                onChange={e => setMessage(e.target.value)}
                                                placeholder="Tell us about your requirements, project details, or any questions..."
                                                rows={5}
                                                className={`${inputClass} resize-none`}
                                                required
                                            />
                                        </div>

                                        {/* Error */}
                                        {error && (
                                            <p className="text-[12px] text-red-500 font-medium px-1">{error}</p>
                                        )}

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full group relative flex items-center justify-center py-4 text-[14px] font-bold text-black bg-[#ccff00] hover:bg-[#d4ff33] rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-[0_8px_30px_rgba(204,255,0,0.2)] hover:shadow-[0_12px_40px_rgba(204,255,0,0.3)] border border-[#ccff00]/50 mt-2"
                                        >
                                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                            <span className="relative flex items-center gap-2">
                                                {isSubmitting ? (
                                                    <><Loader2 size={18} className="animate-spin" /> Sending...</>
                                                ) : (
                                                    <>Send Message <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                                                )}
                                            </span>
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                /* Success State */
                                <div className="relative z-10 flex flex-col items-center justify-center text-center py-16 px-4">
                                    <div className="w-20 h-20 rounded-full bg-[#ccff00]/20 dark:bg-[#ccff00]/10 border-2 border-[#ccff00] flex items-center justify-center mb-8 animate-[pulse_2s_ease-in-out_infinite]">
                                        <CheckCircle2 size={36} className="text-[#8aab00] dark:text-[#ccff00]" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
                                        Message Sent!
                                    </h3>
                                    <p className="text-black/50 dark:text-white/40 text-sm font-medium max-w-md leading-relaxed mb-6">
                                        Thank you for reaching out. Our team will review your inquiry and get back to you within 24 hours.
                                    </p>
                                    {ticketId && (
                                        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-6 py-3 mb-6">
                                            <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Reference ID</p>
                                            <p className="text-[14px] font-black text-[#8aab00] dark:text-[#ccff00]">{ticketId}</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            setIsSubmitted(false);
                                            setName(''); setEmail(''); setPhone('');
                                            setCompany(''); setSubject(''); setMessage('');
                                            setTicketId(''); setError('');
                                        }}
                                        className="text-[12px] font-bold tracking-widest uppercase text-black/50 dark:text-white/40 hover:text-[#8aab00] dark:hover:text-[#ccff00] transition-colors"
                                    >
                                        Send another message →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Info Cards */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Contact Info Card */}
                        <div className="contact-animate bg-white/90 dark:bg-[#111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-[2rem] p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-black/40 dark:text-white/40 mb-6 flex items-center gap-2">
                                <Phone size={14} className="text-[#8aab00] dark:text-[#ccff00]" />
                                Get in Touch
                            </h2>

                            <div className="space-y-4">
                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-4 flex items-center gap-4 group hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#8aab00] dark:text-[#ccff00] group-hover:scale-110 transition-transform">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Email</p>
                                        <a href="mailto:contact@re-verse.in" className="text-[13px] font-bold text-black/80 dark:text-white/80 hover:text-[#8aab00] dark:hover:text-[#ccff00] transition-colors">
                                            contact@re-verse.in
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-4 flex items-center gap-4 group hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#8aab00] dark:text-[#ccff00] group-hover:scale-110 transition-transform">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Phone</p>
                                        <p className="text-[13px] font-bold text-black/80 dark:text-white/80">+91 9898 458 583</p>
                                    </div>
                                </div>

                                <div className="bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] rounded-xl p-4 flex items-start gap-4 group hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center text-[#8aab00] dark:text-[#ccff00] flex-shrink-0 group-hover:scale-110 transition-transform mt-0.5">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Office</p>
                                        <p className="text-[12px] font-medium text-black/70 dark:text-white/60 leading-relaxed">
                                            B-911, Titanium City Center,<br />
                                            Prahlad Nagar Road, Ahmedabad,<br />
                                            Gujarat - 380015, India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hours & CTA Card */}
                        <div className="contact-animate bg-[#111] text-white border border-transparent rounded-[2rem] p-6 sm:p-8 relative overflow-hidden group">
                            {/* Subtle grid bg */}
                            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                            <div className="relative z-10">
                                <h2 className="text-[12px] font-bold tracking-[0.15em] uppercase text-white/40 mb-4">Working Hours</h2>
                                <div className="space-y-2 mb-8 text-[13px] font-medium">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/60">Monday — Friday</span>
                                        <span className="text-[#ccff00] font-bold">9:00 AM — 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/60">Saturday</span>
                                        <span className="text-white/40 font-bold">10:00 AM — 2:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/60">Sunday</span>
                                        <span className="text-white/30 font-bold">Closed</span>
                                    </div>
                                </div>
                                <div className="border-t border-white/10 pt-6">
                                    <p className="text-[11px] text-white/40 font-medium leading-relaxed">
                                        Expecting a reply? Our team typically responds within <span className="text-[#ccff00] font-bold">4–6 hours</span> during business days.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Map Embed Card */}
                        <div className="contact-animate bg-white/90 dark:bg-[#111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <div className="w-full h-[250px] relative bg-gray-100 dark:bg-[#1a1a1a]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.1762!2d72.5099!3d23.0133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b21e53bffff%3A0x6e019fc4f41d3aca!2sTitanium%20City%20Center!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                                    className="absolute inset-0 w-full h-full border-0 grayscale-[0.3] contrast-[1.1]"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Weinix Office Location"
                                />
                            </div>
                            <div className="px-6 py-4 flex items-center justify-between">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Ahmedabad, India</p>
                                <a
                                    href="https://maps.google.com/?q=Titanium+City+Center+Ahmedabad"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] font-bold tracking-widest uppercase text-[#8aab00] dark:text-[#ccff00] hover:text-black dark:hover:text-white transition-colors"
                                >
                                    Open in Maps →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ / Bottom CTA */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto mt-24 relative z-10 contact-animate">
                <div className="bg-[#ccff00] text-black rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all duration-700">
                    <div className="absolute top-0 left-0 w-full h-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/noise-lines.png")' }} />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-xs uppercase tracking-[0.3em] font-black mb-6 opacity-60">Partnerships</h2>
                        <p className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[1] mb-6">
                            Building at scale?
                        </p>
                        <p className="font-semibold text-black/70 text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-8">
                            If you&apos;re an institutional buyer, construction firm, or sustainability-focused brand — let&apos;s explore a strategic partnership.
                        </p>
                        <a
                            href="mailto:contact@re-verse.in"
                            className="inline-flex items-center gap-2 bg-black text-[#ccff00] font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:scale-[1.03] transition-transform shadow-xl"
                        >
                            <Mail size={14} />
                            contact@re-verse.in
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
