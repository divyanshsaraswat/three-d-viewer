'use client';

import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import gsap from 'gsap';
import { X, User, Building, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  contact: z.string().regex(/^\+?[\d\s\-]{10,15}$/, 'Please enter a valid 10-15 digit contact number'),
  email: z.string().email('Please enter a valid email address'),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { trackEvent } = useAnalytics();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      tl.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
        .to(modalRef.current, { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.5, 
          ease: 'back.out(1.7)' 
        }, '-=0.1');
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onClose();
        setIsSuccess(false);
        reset();
      }
    });
    tl.to(modalRef.current, { opacity: 0, y: 50, scale: 0.9, duration: 0.3, ease: 'power2.in' })
      .to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power2.in' }, '-=0.1');
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    trackEvent('bni_registration_submitted', { company: data.company });
    try {
      const response = await fetch('/api/bni/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        trackEvent('bni_registration_success', { company: data.company });
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = 'https://www.instagram.com/re_verse.in/';
        }, 1500);
      } else {
        const errorData = await response.json();
        trackEvent('bni_registration_failed', { error: errorData.error });
        alert(errorData.error || 'Failed to register');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      trackEvent('bni_registration_error', { error: error.message });
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        ref={overlayRef}
        onClick={handleClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 cursor-pointer"
      />

      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl opacity-0 translate-y-12 scale-95 overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ccff00]/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#ccff00]/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-[#ccff00]/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-[#ccff00]" />
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Registration Complete</h3>
            <p className="text-white/60 font-medium">We&apos;ve reserved your spot. See you at the BNI event!</p>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                Join <span className="text-[#ccff00]">BNI</span> <br />Experience
              </h2>
              <p className="text-white/50 text-sm font-medium tracking-wide">
                Fill in your details to secure your exclusive registration for the Weinix x BNI networking event.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Name Field */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#ccff00] transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    {...register('name')}
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#ccff00]/50 rounded-2xl py-4 pl-14 pr-5 text-white outline-none transition-all placeholder:text-white/20"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1 ml-2">{errors.name.message}</p>}
                </div>

                {/* Company Field */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#ccff00] transition-colors">
                    <Building size={18} />
                  </div>
                  <input
                    {...register('company')}
                    placeholder="Company Name"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#ccff00]/50 rounded-2xl py-4 pl-14 pr-5 text-white outline-none transition-all placeholder:text-white/20"
                  />
                  {errors.company && <p className="text-red-500 text-xs mt-1 ml-2">{errors.company.message}</p>}
                </div>

                {/* Contact Field */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#ccff00] transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    {...register('contact')}
                    placeholder="Contact Number"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#ccff00]/50 rounded-2xl py-4 pl-14 pr-5 text-white outline-none transition-all placeholder:text-white/20"
                  />
                  {errors.contact && <p className="text-red-500 text-xs mt-1 ml-2">{errors.contact.message}</p>}
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#ccff00] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#ccff00]/50 rounded-2xl py-4 pl-14 pr-5 text-white outline-none transition-all placeholder:text-white/20"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-2">{errors.email.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ccff00] hover:bg-[#b8e600] text-black font-black uppercase tracking-tighter py-5 rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.2)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
