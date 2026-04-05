'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
    /** Duration for the blur-to-clear transition in ms (default: 700) */
    transitionDuration?: number;
}

/**
 * A lazy-loading image component with a blur-up reveal effect.
 * Images start fully blurred and transition to sharp once loaded.
 * Requires width + height, or fill prop (Next.js Image requirement).
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

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            onLoad={() => setIsLoaded(true)}
            style={{
                filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
                transition: `filter ${transitionDuration}ms ease-out, transform 500ms cubic-bezier(0.87,0,0.13,1), opacity 500ms cubic-bezier(0.87,0,0.13,1)`,
                ...style,
            }}
            {...rest}
        />
    );
}
