'use client';

import Link from 'next/link';
import { ArrowRight, Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ModelSelectDialog, { MODEL_OPTIONS } from '@/components/ModelSelectDialog';

export default function LandingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Preload thumbnails for model options in the background
    MODEL_OPTIONS.forEach(option => {
      if (option.thumbnail) {
        const img = new window.Image();
        img.src = `/${option.thumbnail}`;
      }
    });
  }, []);

  return (
    <div className="h-screen w-screen bg-[#e0e1e5] dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />

      <div className="z-10 text-center space-y-8 p-4">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-br from-black to-black/60 dark:from-white dark:to-neutral-500 bg-clip-text text-transparent pb-2 uppercase italic">
          WEINIX
        </h1>
        <p className="text-black/60 dark:text-white/60 text-xl max-w-xl mx-auto font-medium leading-relaxed">
          The future of circular architecture. High-performance building materials engineered from post-consumer textiles. <span className="text-black dark:text-[#ccff00]">Zero waste, zero compromise.</span>
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="group px-8 py-3 bg-[#ccff00] text-black font-semibold rounded-full shadow-[0_8px_30px_rgba(204,255,0,0.2)] hover:scale-[1.03] transition-all active:scale-95 flex items-center gap-2 border border-[#ccff00]"
          >
            Launch Editor
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            href="/home"
            className="px-8 py-3 bg-black/5 dark:bg-white/5 text-black dark:text-white font-semibold rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all border border-black/10 dark:border-white/10 flex items-center gap-2 backdrop-blur-sm"
          >
            View Landing Page
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 text-black/40 dark:text-white/40 text-sm">
        Built with React Three Fiber
      </div>

      <ModelSelectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
