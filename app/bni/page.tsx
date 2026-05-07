'use client';

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import RegistrationModal from '@/components/RegistrationModal';
import { ArrowRight, Star, Users, ShieldCheck, Globe } from 'lucide-react';

export default function BNIPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.fromTo('.hero-reveal', 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.2 }
    );

    gsap.to('.floating-card', {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.3
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-[0.03]" />
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#ccff00]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ccff00]/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Header Badge */}
        <div className="hero-reveal inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full mb-12">
          <span className="text-[#ccff00] text-[10px] font-black uppercase tracking-[0.2em]">Stall No. 12.3 • BNI Symposium 2026</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="max-w-2xl">
            <h1 className="hero-reveal text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              RE-VERSE <br />
              <span className="text-[#ccff00] italic font-serif tracking-normal lowercase">invites you.</span>
            </h1>

            {/* Mobile Event Image */}
            <div className="lg:hidden relative my-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm bg-white/5 p-2 hero-reveal">
              <div className="absolute inset-0 bg-[#ccff00]/10 blur-[60px] rounded-full animate-pulse" />
              <img 
                src="/bni.webp" 
                alt="BNI Symposium" 
                className="relative z-10 w-full h-auto object-contain rounded-[1.5rem]"
              />
            </div>

            <p className="hero-reveal text-white/60 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-lg">
              Visit us at the BNI Symposium 2026. Discover how RE-VERSE is making your wardrobe truly sustainable through circular engineering.
            </p>

            <div className="hero-reveal flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative flex items-center justify-center gap-3 bg-[#ccff00] hover:bg-[#b8e600] text-black font-black uppercase tracking-tighter px-10 py-5 rounded-2xl shadow-[0_0_50px_rgba(204,255,0,0.3)] transition-all active:scale-[0.98] cursor-pointer overflow-hidden"
              >
                <span className="relative z-10">Secure Your Spot</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              
              <div className="flex items-center gap-4 px-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0a0a] bg-white/10 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                  <span className="text-white">40+</span> Registered
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Event Image (Desktop Only) */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-[#ccff00]/10 blur-[100px] rounded-full animate-pulse" />
            <div className="relative z-10 hero-reveal max-w-md mx-auto lg:max-w-none rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-sm bg-white/5 p-2">
              <img 
                src="/bni.webp" 
                alt="BNI Symposium" 
                className="w-full h-auto object-contain rounded-[1.5rem] transition-transform duration-700 hover:scale-[1.05]"
              />
            </div>
          </div>
        </div>

        {/* Brand Bar */}
        <div className="hero-reveal mt-32 pt-12 border-t border-white/5 flex flex-wrap justify-between items-center gap-12 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <span className="text-2xl font-black tracking-tighter">BNI SYMPOSIUM 2026</span>
          <span className="text-2xl font-black tracking-tighter italic font-serif">GMDC Convention Center</span>
          <span className="text-2xl font-black tracking-tighter uppercase">Ahmedabad</span>
          <span className="text-2xl font-black tracking-tighter lowercase tracking-widest font-serif italic">May 8th & 9th</span>
        </div>
      </div>

      {/* Modal */}
      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
}
