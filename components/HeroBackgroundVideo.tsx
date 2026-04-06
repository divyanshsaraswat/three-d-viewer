'use client';

import React, { useEffect, useState } from 'react';

interface HeroBackgroundVideoProps {
    videoRef: React.RefObject<HTMLVideoElement | null>;
    setIsVideoLoaded: (loaded: boolean) => void;
}

export default function HeroBackgroundVideo({ videoRef, setIsVideoLoaded }: HeroBackgroundVideoProps) {
    const [showVideo, setShowVideo] = useState(true);

    useEffect(() => {
        const connection = (navigator as any).connection;
        const isSlow =
            connection?.saveData === true ||
            connection?.effectiveType === '2g' ||
            connection?.effectiveType === 'slow-2g';

        if (isSlow) {
            setShowVideo(false);
            setIsVideoLoaded(true); // unblock UI immediately on slow connections
        }
    }, []);

    if (!showVideo) {
        return (
            <div
                className="absolute inset-0 z-0 bg-black"
                style={{
                    backgroundImage: 'url(/bg-video-img.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.7,
                }}
            />
        );
    }

    return (
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-black select-none">
            <video
                ref={videoRef}
                key="hero-video"
                className="hero-bg-video w-full h-full object-cover select-none opacity-70 brightness-[0.65] will-change-transform transform-gpu translate-z-0"
                autoPlay
                loop
                muted
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                controls={false}
                tabIndex={-1}
                preload="metadata"
                poster="/bg-video-img.png"
                onCanPlayThrough={() => setIsVideoLoaded(true)}
            >
                <source src="hero-section 2.webm" type="video/webm" />
                <source src="hero-section 2.mp4" type="video/mp4" />
            </video>
            {/* Invisible layer to physically block ALL interactions on the video */}
            <div className="absolute inset-0 z-10 w-full h-full" onContextMenu={(e) => e.preventDefault()}></div>
            {/* Radial Gradient overlay focused on center */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,transparent_70%)] z-[2]"></div>
        </div>
    );
}
