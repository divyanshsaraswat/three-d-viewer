'use client';

import { useState, useRef, useEffect, ImgHTMLAttributes } from 'react';

interface BlurImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    /** Duration for the blur-to-clear transition in ms (default: 700) */
    transitionDuration?: number;
}

/**
 * A lazy-loading image component with a blur-up reveal effect.
 * Images start fully blurred and transition to sharp once loaded.
 */
export default function BlurImage({
    src,
    alt = '',
    className = '',
    transitionDuration = 700,
    style,
    ...rest
}: BlurImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Handle images that are already cached and load instantly
    useEffect(() => {
        if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
            setIsLoaded(true);
        }
    }, [src]);

    return (
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={className}
            style={{
                filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
                transition: `filter ${transitionDuration}ms ease-out`,
                ...style,
            }}
            {...rest}
        />
    );
}
