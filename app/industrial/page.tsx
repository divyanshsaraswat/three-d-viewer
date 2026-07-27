"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
    Layers, Factory, SlidersHorizontal, Recycle, Tag, Handshake,
    Building2, ShieldCheck, Leaf, Zap, Globe, Users,
    ChevronDown, Mail, Phone, ArrowRight, CheckCircle2, Loader2,
    ClipboardList, MessageSquare, FileCheck, FlaskConical, PackageCheck, Truck,
    Wind, Grid3x3, Box, Shirt,
} from 'lucide-react';
import { submitContactInquiry } from '@/utils/api/contact';
import BlurImage from '@/components/BlurImage';

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const solutions = [
    { num: "01", icon: Layers, title: "Bulk Material Supply", desc: "Containerized shipments of recovered fiber, insulation and composite board stock, sized to your monthly production volume." },
    { num: "02", icon: Factory, title: "OEM Manufacturing", desc: "We produce sheets, boards and padded goods to your engineering drawings under your own product line." },
    { num: "03", icon: SlidersHorizontal, title: "Custom Fiber Blends", desc: "Recycled-to-virgin ratios, denier and colour formulated to a target spec sheet, tested before scale-up." },
    { num: "04", icon: Recycle, title: "Industrial Recycling", desc: "Take-back programs that convert your own pre- and post-production textile waste into reusable material credits." },
    { num: "05", icon: Tag, title: "Private Label Solutions", desc: "Unbranded material and finished panels ready for your packaging, labelling and retail identity." },
    { num: "06", icon: Handshake, title: "Long-Term Supply Partnerships", desc: "Fixed-rate annual contracts with priority allocation, dedicated account management and locked lead times." },
];

const whyItems = [
    { icon: Building2, title: "Industrial-Scale Production", desc: "Multiple processing lines running continuous shifts to meet container-level order volumes." },
    { icon: ShieldCheck, title: "Consistent Quality", desc: "Every batch passes multi-stage sorting, testing and a documented QC checklist before dispatch." },
    { icon: Leaf, title: "Eco-Friendly Manufacturing", desc: "Mechanical shredding with zero dye and minimal water use across the entire recovery process." },
    { icon: Zap, title: "Fast Turnaround", desc: "Standard SKUs ship in 7–10 days; custom blends in 15–20 days with production tracking." },
    { icon: Globe, title: "Global Logistics", desc: "FOB, CIF and DDP shipping terms with export documentation handled in-house." },
    { icon: Users, title: "Dedicated B2B Support", desc: "A named account manager and technical contact for every partner from RFQ through repeat orders." },
];

const industries = [
    { name: "Fashion", image: "https://images.unsplash.com/photo-1517146783983-418c681b56c5" },
    { name: "Construction", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5" },
    { name: "Furniture", image: "https://images.unsplash.com/photo-1784037988217-ba73d7ddc83d" },
    { name: "Packaging", image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8" },
    { name: "Automotive", image: "https://images.unsplash.com/photo-1567789884554-0b844b597180" },
    { name: "Home Décor", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45" },
    { name: "Retail", image: "https://images.unsplash.com/photo-1736236560164-bc741c70bca5" },
    { name: "Industrial Manufacturing", image: "https://images.unsplash.com/photo-1689942010216-dc412bb1e7a9" },
];

const processSteps = [
    { title: "Collection", desc: "Textile waste sourced from mills, retailers and post-consumer channels." },
    { title: "Sorting", desc: "Manual sorting by fiber type, colour and grade." },
    { title: "Fiber Recovery", desc: "Mechanical shredding breaks fabric back to raw fiber." },
    { title: "Material Processing", desc: "Blending, carding and pressing into target formats." },
    { title: "Quality Testing", desc: "Density, tensile strength and compliance verification." },
    { title: "Packaging", desc: "Export-grade packing sized to container specification." },
    { title: "Shipping", desc: "Dispatch via air, sea or land freight with full documentation." },
];

const products = [
    { icon: Layers, name: "Recovered Fibers", applications: "Yarn, nonwovens, filling", moq: "500 kg", industries: "Fashion, Furniture" },
    { icon: Wind, name: "Insulation", applications: "Thermal & acoustic panels", moq: "1 pallet", industries: "Construction, Automotive" },
    { icon: Grid3x3, name: "Composite Boards", applications: "Facades, interior walls", moq: "200 sheets", industries: "Construction, Retail" },
    { icon: Box, name: "Industrial Padding", applications: "Packaging, cushioning", moq: "1 container", industries: "Packaging, Automotive" },
    { icon: Shirt, name: "Recycled Textile Materials", applications: "General-purpose fabric stock", moq: "500 kg", industries: "Retail, Home Décor" },
];

const capacityStats = [
    { target: 500, suffix: "+", label: "Business Partners" },
    { target: 25, suffix: "+", label: "Countries" },
    { target: 99, suffix: "%", label: "Quality Rate" },
    { target: 100, suffix: "%", label: "Sustainable Materials" },
];

const impactRings = [
    { pct: 72, title: "Carbon Reduction", desc: "Vs. virgin fiber production" },
    { pct: 85, title: "Landfill Diversion", desc: "Textile waste kept from disposal" },
    { pct: 90, title: "Water Savings", desc: "Vs. conventional textile dyeing" },
    { pct: 100, title: "Circular Economy", desc: "Material fully traceable to source" },
    { pct: 95, title: "ESG Commitment", desc: "Partner audit compliance rate" },
];

const customList = [
    { tag: "OEM", title: "Original Equipment Manufacturing", desc: "We produce to your existing product specification under your brand." },
    { tag: "ODM", title: "Original Design Manufacturing", desc: "Our design team develops the product from concept through finished spec." },
    { tag: "PRIVATE LABEL", title: "Private Label Solutions", desc: "Unbranded stock ready for your own packaging and identity." },
    { tag: "SPEC", title: "Custom Specifications", desc: "Density, thickness, blend ratio and dimensions engineered to your requirement." },
    { tag: "R&D", title: "Material Engineering", desc: "In-house lab testing for tensile strength, thermal and acoustic performance." },
    { tag: "LOGISTICS", title: "Packaging", desc: "Export-ready packaging engineered for your shipping method and destination market." },
];

const workflowSteps = [
    { icon: ClipboardList, title: "Submit Inquiry", desc: "Share your product, target volume and destination country through our RFQ form." },
    { icon: MessageSquare, title: "Technical Discussion", desc: "Our engineering team reviews your specification and confirms feasibility." },
    { icon: FileCheck, title: "Quotation", desc: "A formal quote covering pricing, MOQ, lead time and shipping terms." },
    { icon: FlaskConical, title: "Prototype", desc: "Pilot batch produced and shipped for your approval before full production." },
    { icon: PackageCheck, title: "Production", desc: "Full-scale manufacturing begins on confirmed order and purchase agreement." },
    { icon: Truck, title: "Shipping", desc: "Export documentation prepared and goods dispatched to your facility." },
];

const testimonials = [
    { quote: "Lead times have been reliable for eight consecutive quarters, which matters more to our planning team than a marginally lower unit price.", initials: "RM", company: "Nordfeld Interiors", meta: "Furniture · Germany" },
    { quote: "The composite board specification matched our facade tender requirements without a single revision cycle.", initials: "AK", company: "Kestrel Construction Group", meta: "Construction · UAE" },
    { quote: "Private label packaging and documentation arrived exactly as briefed, which made customs clearance straightforward.", initials: "JT", company: "Trellis Retail Co.", meta: "Retail · United States" },
];

const faqs = [
    { q: "What is the minimum order quantity?", a: "MOQ varies by product: 500 kg for fiber and textile stock, 1 pallet for insulation, and 200 sheets for composite boards. Custom blends may carry a higher MOQ depending on formulation." },
    { q: "Which countries do you export to?", a: "We currently ship to partners in 25+ countries across Europe, the Middle East, North America and Southeast Asia, with FOB, CIF and DDP terms available." },
    { q: "What is the typical lead time?", a: "Standard catalog SKUs ship in 7–10 business days. Custom fiber blends and OEM production typically require 15–20 business days after sample approval." },
    { q: "Can we request samples before ordering?", a: "Yes. Sample kits are available for all product categories and are typically dispatched within 3–5 business days of your request." },
    { q: "Do you support custom specifications?", a: "Our material engineering team works from your target density, blend ratio, dimensions or performance requirement and produces a pilot batch before full-scale manufacturing." },
    { q: "What certifications do your materials carry?", a: "Our materials are OEKO-TEX®, GRS (Global Recycled Standard) and ISO 14001 compliant, with certificates provided per shipment on request." },
    { q: "What payment terms do you offer?", a: "Standard terms are 30% advance with 70% against shipping documents. Long-term partners may qualify for extended net terms after an initial trading period." },
];

const industryOptions = ["Fashion", "Construction", "Furniture", "Packaging", "Automotive", "Home Décor", "Retail", "Industrial Manufacturing"];
const productOptions = ["Recovered Fibers", "Insulation", "Composite Boards", "Industrial Padding", "Recycled Textile Materials", "Custom / Other"];

function AnimatedCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
    const ref = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        if (!ref.current) return;
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
            onUpdate: () => {
                if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix;
            },
        });
    }, { scope: ref });

    return (
        <div className="text-center border-t md:border-t-0 md:border-l border-white/10 first:border-0 pt-6 md:pt-0 md:pl-8 first:pl-0">
            <span ref={ref} className="block text-4xl md:text-5xl font-black tracking-tighter text-white">0{suffix}</span>
            <span className="block mt-2 font-mono text-[11px] uppercase tracking-widest text-white/50">{label}</span>
        </div>
    );
}

function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
    return (
        <p className={`inline-flex items-center gap-2.5 font-mono uppercase tracking-widest text-xs font-bold text-[#8aab00] dark:text-[#ccff00] mb-4 ${center ? 'justify-center w-full' : ''}`}>
            <span className="w-[22px] h-px bg-current" />
            {children}
        </p>
    );
}

function ImpactRing({ pct, title, desc }: { pct: number; title: string; desc: string }) {
    const circleRef = useRef<SVGCircleElement>(null);
    const circumference = 2 * Math.PI * 40;

    useGSAP(() => {
        if (!circleRef.current) return;
        gsap.to(circleRef.current, {
            strokeDashoffset: circumference - (pct / 100) * circumference,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: circleRef.current, start: "top 88%", once: true },
        });
    }, { scope: circleRef });

    return (
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[1.5rem] p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
                <svg viewBox="0 0 96 96" width="96" height="96" className="-rotate-90">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-black/5 dark:text-white/10" />
                    <circle
                        ref={circleRef}
                        cx="48" cy="48" r="40" fill="none" stroke="#ccff00" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-black dark:text-white">{pct}%</div>
            </div>
            <h4 className="text-sm font-bold mb-1">{title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
    );
}

export default function IndustrialPage() {
    const containerRef = useRef<HTMLDivElement>(null);

    const [company, setCompany] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [industry, setIndustry] = useState('');
    const [product, setProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [requirements, setRequirements] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const [error, setError] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        return () => { abortRef.current?.abort(); };
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo('.ind-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
            .fromTo('.ind-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out" }, "-=0.6")
            .fromTo('.ind-lede', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
            .fromTo('.ind-ctas', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
            .fromTo('.ind-meta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
            .fromTo('.ind-spec', { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, "-=0.7");

        gsap.to('.blend-fill', { width: '60%', duration: 1.6, ease: "power3.out", delay: 1 });

        const sections = gsap.utils.toArray('.industrial-animate') as HTMLElement[];
        sections.forEach((section) => {
            gsap.set(section, { opacity: 0, y: 40 });
            gsap.to(section, {
                opacity: 1, y: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: section, start: "top 88%" },
            });
        });
    }, { scope: containerRef });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!company.trim() || !contact.trim() || !email.trim() || !phone.trim() || !country.trim() || !industry || !product || !quantity.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        try {
            const res = await submitContactInquiry({
                name: contact,
                email,
                phone,
                company,
                subject: `Industrial RFQ — ${product}`,
                message: `Country: ${country}\nIndustry: ${industry}\nProduct: ${product}\nEstimated Quantity: ${quantity}\n\nRequirements:\n${requirements || "—"}`,
                businessType: 'b2b',
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
    // Native <select> popups ignore our bg/text classes — color-scheme tells the browser to render the dropdown itself in the matching theme.
    const selectClass = `${inputClass} dark:[color-scheme:dark] cursor-pointer`;
    const labelClass = "block text-[10px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-2 pl-1";

    return (
        <main ref={containerRef} className="relative min-h-screen bg-[#f5f5f7] dark:bg-[#0a0a0a] font-sans text-black dark:text-white transition-colors duration-500 overflow-hidden pb-32">

            {/* 1. HERO — always-dark full-bleed section */}
            <section className="relative pt-[22vh] md:pt-[24vh] pb-20 md:pb-28 bg-[#111] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '64px 64px', maskImage: 'radial-gradient(ellipse at 50% 30%, black, transparent 75%)' }} />
                <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.14)_0%,transparent_60%)] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[0%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.08)_0%,transparent_60%)] pointer-events-none" />

                <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
                    <div>
                        <span className="ind-badge inline-block bg-white/10 text-[#ccff00] border border-white/15 font-bold tracking-widest text-[10px] sm:text-xs px-6 py-2 rounded-full uppercase mb-8 font-mono">
                            B2B &amp; Industrial Supply
                        </span>

                        <h1 className="ind-title text-4xl sm:text-5xl md:text-[3.6rem] font-black leading-[1.02] tracking-tighter text-white">
                            Sustainable Textile Recycling Solutions for <span className="text-[#ccff00]">Global Industries</span>
                        </h1>

                        <p className="ind-lede mt-6 text-base md:text-lg text-white/70 max-w-xl leading-relaxed font-medium">
                            WEINIX converts post-consumer textile waste into certified recovered fibers, insulation, composite boards and structural panels — supplied at industrial scale to manufacturers, construction firms, fashion brands and distributors in 25+ countries.
                        </p>

                        <div className="ind-ctas mt-9 flex flex-wrap gap-4">
                            <a href="#rfq" className="inline-flex items-center gap-2 bg-[#ccff00] text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:scale-[1.03] transition-transform shadow-[0_10px_24px_rgba(204,255,0,0.25)]">
                                Request a Quote
                            </a>
                            <a href="#partners" className="inline-flex items-center gap-2 bg-transparent border border-white/25 text-white font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/50 transition-all">
                                Become a Business Partner
                            </a>
                        </div>

                        <div className="ind-meta mt-12 flex flex-wrap gap-8">
                            {[["500+", "Business Partners"], ["25+", "Countries Served"], ["99%", "Quality Rate"]].map(([n, l]) => (
                                <div key={l} className="border-l border-white/20 pl-4">
                                    <strong className="block text-2xl font-black text-white">{n}</strong>
                                    <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">{l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Material datasheet spec card */}
                    <div className="ind-spec bg-white/[0.06] border border-white/15 backdrop-blur-xl rounded-[2rem] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
                        <div className="flex justify-between items-center border-b border-dashed border-white/20 pb-4 mb-4">
                            <span className="font-mono text-[11px] uppercase tracking-widest text-[#ccff00]">Material Datasheet</span>
                            <span className="font-mono text-[13px] text-white/85 bg-white/10 px-2.5 py-1 rounded-md">RTX-100</span>
                        </div>
                        <div className="space-y-0">
                            {[["MATERIAL", "Recovered Cotton Fiber"], ["BLEND", "60% Recycled / 40% Virgin"]].map(([k, v]) => (
                                <div key={k} className="flex justify-between py-2.5 border-b border-white/[0.08] text-[13.5px]">
                                    <span className="font-mono text-[12px] text-white/50">{k}</span>
                                    <span className="font-bold text-white">{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-3 mb-3">
                            <div className="blend-fill h-full w-0 rounded-full bg-gradient-to-r from-[#ccff00] to-[#8aab00]" />
                        </div>
                        <div className="space-y-0">
                            {[["DYE PROCESS", "Zero Dye Added"], ["MOQ", "500 kg"], ["LEAD TIME", "15–20 Days"]].map(([k, v]) => (
                                <div key={k} className="flex justify-between py-2.5 border-b border-white/[0.08] text-[13.5px]">
                                    <span className="font-mono text-[12px] text-white/50">{k}</span>
                                    <span className="font-bold text-white">{v}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-5">
                            {["OEKO-TEX®", "ISO 14001", "GRS Certified"].map((c) => (
                                <span key={c} className="font-mono text-[10px] uppercase tracking-wider border border-white/25 text-white/85 px-3 py-1.5 rounded-full">{c}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TRUSTED / MARQUEE */}
            <section className="bg-white dark:bg-[#0a0a0a] py-10 border-y border-black/10 dark:border-white/10">
                <p className="text-center font-mono text-[11px] uppercase tracking-widest text-black/40 dark:text-white/40 mb-6">
                    Supplying manufacturers &amp; distributors across
                </p>
                <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
                    <div className="flex gap-16 w-max animate-[marquee_28s_linear_infinite]">
                        {[...industries, ...industries].map((item, i) => (
                            <span key={i} className="flex items-center gap-2.5 font-black text-xl text-black/40 dark:text-white/30 whitespace-nowrap tracking-tight">
                                <span className="w-2 h-2 rounded-sm bg-[#ccff00] inline-block" />
                                {item.name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. BUSINESS SOLUTIONS */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate max-w-[720px] mb-14">
                    <Eyebrow>What We Offer</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Business solutions built for scale</h2>
                    <p className="text-black/60 dark:text-white/50 text-sm md:text-base leading-relaxed font-medium max-w-xl">
                        From single-container orders to long-term supply contracts, our commercial team structures agreements around your production calendar, not ours.
                    </p>
                </div>
                <div className="industrial-animate grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {solutions.map((s) => (
                        <div key={s.num} className="group bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[1.5rem] p-7 relative overflow-hidden hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ccff00] to-[#8aab00] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                            <span className="font-mono text-xs text-[#8aab00] dark:text-[#ccff00] tracking-widest">{s.num}</span>
                            <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center my-4 group-hover:bg-[#ccff00] group-hover:rotate-[-6deg] group-hover:scale-105 transition-all duration-300">
                                <s.icon size={22} strokeWidth={1.8} className="text-black/70 dark:text-white/70 group-hover:text-black transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 tracking-tight">{s.title}</h3>
                            <p className="text-[13.5px] text-black/55 dark:text-white/45 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. WHY WEINIX */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate max-w-[720px] mb-14">
                    <Eyebrow>Why Partner With Us</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Why procurement teams choose WEINIX</h2>
                </div>
                <div className="industrial-animate grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-x-0 lg:divide-x md:divide-x divide-black/10 dark:divide-white/10 border border-black/10 dark:border-white/10 rounded-[1.5rem] overflow-hidden bg-white dark:bg-[#111]">
                    {whyItems.map((w) => (
                        <div key={w.title} className="p-8 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors">
                            <w.icon size={28} strokeWidth={1.6} className="text-[#8aab00] dark:text-[#ccff00] mb-4" />
                            <h3 className="text-base font-bold mb-2">{w.title}</h3>
                            <p className="text-[13.5px] text-black/55 dark:text-white/45 leading-relaxed">{w.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. INDUSTRIES SERVED */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate max-w-[720px] mb-14">
                    <Eyebrow>Industries Served</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Built for buyers across sectors</h2>
                    <p className="text-black/60 dark:text-white/50 text-sm md:text-base leading-relaxed font-medium max-w-xl">
                        Our material specifications are engineered to meet the compliance and performance requirements of eight core industries.
                    </p>
                </div>
                <div className="industrial-animate grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {industries.map((ind, i) => (
                        <div key={ind.name} className="group relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-[#0d0d0d] flex items-end p-5 cursor-pointer">
                            <BlurImage
                                src={ind.image}
                                alt={ind.name}
                                fill
                                sizes="(max-width: 1024px) 50vw, 25vw"
                                loading="eager"
                                fetchPriority="low"
                                className="object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] bg-[radial-gradient(circle_at_50%_20%,rgba(204,255,0,0.15),transparent_70%)]" />
                            <div className="relative z-10">
                                <small className="block font-mono text-[10px] uppercase tracking-widest text-[#ccff00] mb-1.5">Sector {String(i + 1).padStart(2, "0")}</small>
                                <span className="text-white font-black text-lg leading-tight">{ind.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6. MANUFACTURING PROCESS */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate max-w-[720px] mb-14">
                    <Eyebrow>Manufacturing Process</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">From waste stream to raw material</h2>
                </div>
                <div className="industrial-animate overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="flex gap-4 min-w-[900px] md:min-w-0">
                        {processSteps.map((step, i) => (
                            <div key={step.title} className="flex-1 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[1.25rem] p-5 relative">
                                <div className="w-8 h-8 rounded-full bg-[#ccff00]/15 border border-[#ccff00]/30 flex items-center justify-center font-mono text-[11px] font-bold text-[#8aab00] dark:text-[#ccff00] mb-4">
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <h4 className="text-sm font-bold mb-1.5 leading-snug">{step.title}</h4>
                                <p className="text-[12px] text-black/55 dark:text-white/45 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. PRODUCT CATEGORIES */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate max-w-[720px] mb-14">
                    <Eyebrow>Product Categories</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Materials ready for procurement</h2>
                    <p className="text-black/60 dark:text-white/50 text-sm md:text-base leading-relaxed font-medium max-w-xl">
                        Every category ships with a full datasheet covering composition, MOQ and applicable industries.
                    </p>
                </div>
                <div className="industrial-animate grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {products.map((p) => (
                        <div key={p.name} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[1.5rem] overflow-hidden hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300">
                            <div className="h-32 bg-gradient-to-br from-black/[0.04] to-black/[0.08] dark:from-white/[0.04] dark:to-white/[0.08] flex items-center justify-center">
                                <p.icon size={34} strokeWidth={1.4} className="text-black/25 dark:text-white/25" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-base font-bold mb-3">{p.name}</h3>
                                <div className="space-y-1.5 mb-5">
                                    {[["Applications", p.applications], ["MOQ", p.moq], ["Industries", p.industries]].map(([k, v]) => (
                                        <div key={k} className="flex justify-between text-[12.5px] border-b border-dotted border-black/10 dark:border-white/10 pb-1.5">
                                            <span className="font-mono text-[10.5px] uppercase tracking-wide text-black/40 dark:text-white/35">{k}</span>
                                            <span className="font-bold text-right">{v}</span>
                                        </div>
                                    ))}
                                </div>
                                <a href="#rfq" className="inline-block text-[11px] font-bold uppercase tracking-widest border border-black/15 dark:border-white/15 rounded-full px-5 py-2.5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                                    Request Quote
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 8. MANUFACTURING CAPACITY */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate bg-[#111] rounded-[2rem] p-10 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(204,255,0,0.12),transparent_55%)] pointer-events-none" />
                    {capacityStats.map((s) => (
                        <AnimatedCounter key={s.label} target={s.target} suffix={s.suffix} label={s.label} />
                    ))}
                </div>
            </section>

            {/* 9. SUSTAINABILITY IMPACT */}
            <section id="partners" className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate max-w-[720px] mb-14">
                    <Eyebrow>Sustainability Impact</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Measured, not marketed</h2>
                    <p className="text-black/60 dark:text-white/50 text-sm md:text-base leading-relaxed font-medium max-w-xl">
                        Every partnership includes an ESG reporting summary you can pass directly to your own sustainability disclosures.
                    </p>
                </div>
                <div className="industrial-animate grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {impactRings.map((r) => (
                        <ImpactRing key={r.title} {...r} />
                    ))}
                </div>
            </section>

            {/* 10. CUSTOM MANUFACTURING */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
                    <div className="bg-gradient-to-br from-[#4B5940] to-[#6E7C5C] rounded-[2rem] p-10 text-white min-h-[340px] flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
                        <p className="relative font-mono text-xs uppercase tracking-widest text-[#ccff00] mb-4">Custom Manufacturing</p>
                        <h3 className="relative text-2xl md:text-3xl font-black tracking-tight mb-4">Your specification. Our production line.</h3>
                        <p className="relative text-sm text-white/80 leading-relaxed">
                            Every custom order runs through material engineering and pilot batching before full-scale production begins — so what you approve in the sample is exactly what arrives in the container.
                        </p>
                    </div>
                    <ul className="divide-y divide-black/10 dark:divide-white/10">
                        {customList.map((item) => (
                            <li key={item.tag} className="flex gap-5 py-5 items-start">
                                <span className="font-mono text-[10px] bg-black/5 dark:bg-white/10 text-black dark:text-white px-2.5 py-1.5 rounded-md tracking-wide shrink-0 mt-0.5">{item.tag}</span>
                                <div>
                                    <h4 className="text-sm font-bold mb-1">{item.title}</h4>
                                    <p className="text-[13px] text-black/55 dark:text-white/45 leading-relaxed">{item.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 11. BUSINESS WORKFLOW */}
            <section className="px-4 md:px-8 max-w-[900px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate text-center mb-14">
                    <Eyebrow center>How It Works</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Your business workflow, start to shipment</h2>
                </div>
                <div className="industrial-animate">
                    {workflowSteps.map((step, i) => (
                        <div key={step.title} className="grid grid-cols-[68px_1fr] gap-6 py-6 relative">
                            {i !== workflowSteps.length - 1 && (
                                <div className="absolute left-[34px] top-[76px] bottom-[-12px] w-[2px] bg-black/10 dark:bg-white/10" />
                            )}
                            <div className="w-[68px] h-[68px] rounded-full bg-white dark:bg-[#1a1a1a] border-2 border-black/15 dark:border-white/15 flex items-center justify-center relative z-10">
                                <step.icon size={24} strokeWidth={1.8} className="text-[#8aab00] dark:text-[#ccff00]" />
                            </div>
                            <div className="pt-3">
                                <h4 className="text-lg font-bold mb-1.5">{i + 1}. {step.title}</h4>
                                <p className="text-sm text-black/55 dark:text-white/45 leading-relaxed">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 12. TESTIMONIALS */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate max-w-[720px] mb-14">
                    <Eyebrow>Client Feedback</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">What our business partners say</h2>
                </div>
                <div className="industrial-animate grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {testimonials.map((t) => (
                        <div key={t.company} className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-[1.5rem] p-7 flex flex-col gap-5">
                            <p className="text-[14.5px] text-black/70 dark:text-white/60 leading-relaxed">
                                <span className="text-[#8aab00] dark:text-[#ccff00] text-2xl font-serif leading-none mr-0.5">&ldquo;</span>
                                {t.quote}
                            </p>
                            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-black/10 dark:border-white/10">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#ccff00] to-[#8aab00] flex items-center justify-center text-black font-black text-sm shrink-0">{t.initials}</div>
                                <div>
                                    <strong className="block text-sm font-bold">{t.company}</strong>
                                    <span className="font-mono text-[11px] uppercase tracking-wide text-black/45 dark:text-white/40">{t.meta}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 13. FAQ */}
            <section className="px-4 md:px-8 max-w-[900px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate text-center mb-14">
                    <Eyebrow center>Frequently Asked</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Procurement questions, answered</h2>
                </div>
                <div className="industrial-animate space-y-3">
                    {faqs.map((item, i) => {
                        const isOpen = openFaq === i;
                        return (
                            <div key={item.q} className="bg-white/90 dark:bg-[#111]/80 backdrop-blur-xl border border-black/5 dark:border-white/[0.08] rounded-2xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : i)}
                                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 cursor-pointer"
                                >
                                    <span className="text-[15px] font-bold tracking-tight">{item.q}</span>
                                    <ChevronDown size={18} className={`shrink-0 text-black/40 dark:text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#8aab00] dark:text-[#ccff00]' : ''}`} />
                                </button>
                                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-5 text-[13.5px] text-black/60 dark:text-white/50 leading-relaxed font-medium">{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 14. RFQ FORM */}
            <section id="rfq" className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate max-w-[720px] mb-14">
                    <Eyebrow>Request a Quote</Eyebrow>
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">Get a formal business quotation</h2>
                    <p className="text-black/60 dark:text-white/50 text-sm md:text-base leading-relaxed font-medium max-w-xl">
                        Complete the form below and our commercial team will respond within one business day with pricing, MOQ and lead time.
                    </p>
                </div>

                <div className="industrial-animate grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] rounded-[2rem] overflow-hidden border border-black/5 dark:border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    <div className="bg-[#111] text-white p-8 sm:p-10 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl md:text-2xl font-black mb-3">Why buyers work with WEINIX</h3>
                            <p className="text-sm text-white/65 leading-relaxed">
                                Every RFQ is reviewed by both a commercial and a technical contact, so quotes reflect real production feasibility — not a generic price list.
                            </p>
                            <ul className="mt-8 space-y-4">
                                {[
                                    "Response within 1 business day",
                                    "Certified material documentation included",
                                    "Dedicated account manager on confirmed orders",
                                    "Sample kits available on request",
                                ].map((li) => (
                                    <li key={li} className="flex gap-3 items-start text-[13.5px] text-white/85">
                                        <span className="w-1.5 h-1.5 rounded-sm bg-[#ccff00] mt-1.5 shrink-0" />
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <p className="font-mono text-[12px] text-white/45 mt-10">sales@weinix-industrial.com · +91 98984 58583</p>
                    </div>

                    <div className="bg-white/90 dark:bg-[#111111]/60 p-8 sm:p-10">
                        {!isSubmitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Company Name *</label>
                                        <input type="text" value={company} onChange={e => setCompany(e.target.value)} className={inputClass} required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Contact Person *</label>
                                        <input type="text" value={contact} onChange={e => setContact(e.target.value)} className={inputClass} required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Email Address *</label>
                                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Phone Number *</label>
                                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Country *</label>
                                        <input type="text" value={country} onChange={e => setCountry(e.target.value)} className={inputClass} required />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Industry *</label>
                                        <select value={industry} onChange={e => setIndustry(e.target.value)} className={selectClass} required>
                                            <option value="">Select industry</option>
                                            {industryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Product *</label>
                                        <select value={product} onChange={e => setProduct(e.target.value)} className={selectClass} required>
                                            <option value="">Select product</option>
                                            {productOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Estimated Quantity *</label>
                                        <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="e.g. 5 tons / month" className={inputClass} required />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Requirements</label>
                                    <textarea value={requirements} onChange={e => setRequirements(e.target.value)} placeholder="Tell us about your specification, target lead time or certification needs" rows={4} className={`${inputClass} resize-none`} />
                                </div>

                                {error && <p className="text-[12px] text-red-500 font-medium px-1">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full group relative flex items-center justify-center py-4 text-[14px] font-bold text-black bg-[#ccff00] hover:bg-[#d4ff33] rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 shadow-[0_8px_30px_rgba(204,255,0,0.2)] mt-2"
                                >
                                    <span className="relative flex items-center gap-2">
                                        {isSubmitting ? (<><Loader2 size={18} className="animate-spin" /> Submitting...</>) : (<>Submit Business Quote Request <ArrowRight size={16} /></>)}
                                    </span>
                                </button>
                                <p className="text-[11px] text-black/40 dark:text-white/30 text-center">By submitting, you agree to be contacted by our commercial team regarding this enquiry.</p>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                                <div className="w-20 h-20 rounded-full bg-[#ccff00]/20 dark:bg-[#ccff00]/10 border-2 border-[#ccff00] flex items-center justify-center mb-8">
                                    <CheckCircle2 size={36} className="text-[#8aab00] dark:text-[#ccff00]" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-3">Request Received!</h3>
                                <p className="text-black/50 dark:text-white/40 text-sm font-medium max-w-md leading-relaxed mb-6">
                                    Our commercial team will review your request and respond within one business day.
                                </p>
                                {ticketId && (
                                    <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-6 py-3">
                                        <p className="text-[9px] uppercase tracking-[0.2em] text-black/40 dark:text-white/30 font-bold mb-1">Reference ID</p>
                                        <p className="text-[14px] font-black text-[#8aab00] dark:text-[#ccff00]">{ticketId}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* 15. FOOTER CTA */}
            <section className="px-4 md:px-8 max-w-[1200px] mx-auto pt-24 md:pt-28 relative z-10">
                <div className="industrial-animate bg-[#ccff00] text-black rounded-[2rem] p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[1] mb-8">
                            Let&apos;s Build Sustainable Manufacturing Together
                        </h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a href="#rfq" className="inline-flex items-center gap-2 bg-black text-[#ccff00] font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:scale-[1.03] transition-transform shadow-xl">
                                <Mail size={14} /> Contact Sales
                            </a>
                            <a href="#rfq" className="inline-flex items-center gap-2 bg-transparent border border-black/30 text-black font-bold uppercase tracking-widest text-xs px-8 py-4 rounded-full hover:bg-black/10 transition-colors">
                                <Phone size={14} /> Request Quote
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
