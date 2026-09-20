import React, { useState } from 'react';
import { CloudinaryService, CloudinaryTransformOptions } from '../../services/cloudinary';
import { Image as ImageIcon } from 'lucide-react';

export interface CloudinaryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  transform?: CloudinaryTransformOptions;
  fallbackSrc?: string;
  caption?: string;
  className?: string;
}

/**
 * CloudinaryImage
 * Renders Cloudinary CDN-hosted media directly inside Titan OS.
 * Automatically handles on-the-fly transformations (f_auto, q_auto, responsive sizes),
 * loading skeleton states, and graceful image error fallback.
 */
export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  transform = { quality: 'auto', format: 'auto' },
  fallbackSrc = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  caption,
  className = '',
  alt = 'Cloudinary media asset',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const resolvedUrl = React.useMemo(() => {
    if (!src) return fallbackSrc;
    if (src.includes('cloudinary.com')) {
      return CloudinaryService.getTransformedUrl(src, transform);
    }
    if (!src.startsWith('http://') && !src.startsWith('https://')) {
      return CloudinaryService.buildCdnUrl(src, transform);
    }
    return src;
  }, [src, transform, fallbackSrc]);

  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/[0.05] animate-pulse flex items-center justify-center text-zinc-500">
          <ImageIcon className="w-5 h-5 opacity-40" />
        </div>
      )}

      <img
        src={hasError ? fallbackSrc : resolvedUrl}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...rest}
      />

      {caption && (
        <span className="block text-[10px] font-mono text-zinc-400 mt-1 truncate">
          {caption}
        </span>
      )}
    </div>
  );
};
