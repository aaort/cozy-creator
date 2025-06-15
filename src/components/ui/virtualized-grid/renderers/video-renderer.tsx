import React, { useRef, useState } from "react";
import type { GridItem } from "../virtualized-grid";

export interface VideoRendererProps {
  item: GridItem;
  width: number;
  isLoaded: boolean;
  onClick?: (item: GridItem) => void;
}

export const VideoPlaceholder: React.FC<{ aspectRatio?: number }> = ({
  aspectRatio,
}) => (
  <div
    className="w-full h-full bg-muted/20 animate-pulse rounded-lg"
    style={aspectRatio ? { aspectRatio } : undefined}
  />
);

export const VideoRenderer: React.FC<VideoRendererProps> = ({
  item,
  isLoaded: externalIsLoaded,
  onClick,
}) => {
  const [internalIsLoaded, setInternalIsLoaded] = useState(false);
  const videoLoaded = externalIsLoaded || internalIsLoaded;
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    setInternalIsLoaded(true);
    const videoElement = e.target as HTMLVideoElement;
    videoElement.play().catch(() => {
      // Ignore autoplay errors
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg group cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={handleClick}
      style={{ aspectRatio: item.aspectRatio }}
    >
      {/* Placeholder shown while video loads */}
      {!videoLoaded && <VideoPlaceholder aspectRatio={item.aspectRatio} />}

      <video
        ref={videoRef}
        loop
        autoPlay
        muted
        playsInline
        preload="metadata"
        className={`
          absolute inset-0 w-full h-full object-cover
          transition-all duration-300 ease-in-out
          group-hover:scale-105
          ${videoLoaded ? "opacity-100" : "opacity-0"}
        `}
        style={{ aspectRatio: item.aspectRatio }}
        src={item.url}
        onLoadedData={handleLoadedData}
      />

      {/* Gradient overlays for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Display metadata on hover */}
      <div className="absolute inset-0 flex flex-col justify-between p-3">
        {/* Bottom metadata - title/subtitle */}
        {(item.title || item.subtitle) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {item.title && (
              <p className="text-white text-sm font-semibold truncate">
                {item.title}
              </p>
            )}
            {item.subtitle && (
              <p className="text-white/90 text-xs mt-1">{item.subtitle}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
