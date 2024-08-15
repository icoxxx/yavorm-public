import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const getAspectRatioClass = (width: number, height: number) => {
    const ratio = width / height;
    if (ratio > 1.4) return 'aspect-ratio-16-9';  // e.g., 16:9 or wider
    if (ratio < 1.4) return 'aspect-ratio-9-16';    // e.g., 9:16 or taller
    return 'aspect-ratio-16-9';                    
};

const GalleryImage = ({ src, alt }: { src: string, alt: string }) => {
    const [aspectRatioClass, setAspectRatioClass] = useState('');

    useEffect(() => {
        const img = new window.Image();
        img.src = src;
        img.onload = () => {
            const aspectClass = getAspectRatioClass(img.width, img.height);
            setAspectRatioClass(aspectClass);
        };
    }, [src]);

    return (
      aspectRatioClass && (
        <Image className={`gallery-carousel-img ${aspectRatioClass}`} fill src={src} quality={100} alt={alt} />
      )
    );
};

export default GalleryImage;
