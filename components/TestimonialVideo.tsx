"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function TestimonialVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Play when it comes into view, pause when it leaves
                if (entry.isIntersecting) {
                    if (videoRef.current) {
                        videoRef.current.play().then(() => {
                            setIsPlaying(true);
                        }).catch(e => console.log("Video auto-play prevented:", e));
                    }
                } else {
                    if (videoRef.current) {
                        videoRef.current.pause();
                        setIsPlaying(false);
                    }
                }
            });
        }, { threshold: 0.3 }); // Play when 30% visible

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (videoRef.current) observer.unobserve(videoRef.current);
        };
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Smooth progress bar updates
    useEffect(() => {
        let animationFrameId: number;

        const updateProgress = () => {
            if (videoRef.current) {
                const current = videoRef.current.currentTime;
                const duration = videoRef.current.duration;
                if (duration > 0) {
                    setProgress((current / duration) * 100);
                }
            }
            if (isPlaying) {
                animationFrameId = requestAnimationFrame(updateProgress);
            }
        };

        if (isPlaying) {
            animationFrameId = requestAnimationFrame(updateProgress);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isPlaying]);

    return (
        <div className="w-full max-w-[1000px] mx-auto mb-20 animate-section relative rounded-3xl overflow-hidden shadow-xl aspect-video bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-white/10 group">
            <video
                ref={videoRef}
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none transition-colors"></div>

            {/* Controls */}
            <div className="absolute bottom-6 right-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center cursor-pointer text-white hover:bg-[#ccff00] hover:text-black transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md flex items-center cursor-pointer justify-center text-white hover:bg-[#ccff00] hover:text-black transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                </button>
            </div>

            {/* Progress Bar (Unseekable) */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20">
                <div
                    className="h-full bg-[#ccff00]"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
