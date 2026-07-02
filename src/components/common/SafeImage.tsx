import { useState, useCallback } from 'react';
import { logImageError } from '../../utils/imageUtils';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  poster?: boolean;
}

export const SafeImage = ({ src, alt, className = '' }: SafeImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  const handleError = useCallback(() => {
    if (!errored) {
      logImageError(imgSrc, alt);
      setErrored(true);
    }
  }, [errored, imgSrc, alt]);

  if (!src) {
    return <div className="w-full h-full bg-[#14141a] animate-pulse rounded-inherit" />;
  }

  return (
    <>
      {!loaded && !errored && (
        <div className="absolute inset-0 bg-[#14141a] animate-pulse" />
      )}
      {errored ? (
        <div className="w-full h-full bg-[#14141a] flex items-center justify-center">
          <span className="text-streamly-gray text-xs">{alt}</span>
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          loading="lazy"
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </>
  );
};
