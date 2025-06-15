import React, { useState } from "react";
import type { GridItem } from "../virtualized-grid";

export interface ImageRendererProps {
  item: GridItem;
  width: number;
  isLoaded: boolean;
  onClick?: (item: GridItem) => void;
}

export const ImagePlaceholder: React.FC<{ aspectRatio?: number }> = ({
  aspectRatio,
}) => (
  <div
    className="w-full h-full bg-muted/20 animate-pulse rounded-lg"
    style={aspectRatio ? { aspectRatio } : undefined}
  />
);

export const ImageRenderer: React.FC<ImageRendererProps> = ({
  item,
  isLoaded: externalIsLoaded,
  onClick,
}) => {
  const [internalIsLoaded, setInternalIsLoaded] = useState(false);
  const imageLoaded = externalIsLoaded || internalIsLoaded;

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  // Determine the correct styling for maintaining aspect ratio
  const aspectRatio = item.aspectRatio || (item.type === "video" ? 16 / 9 : 1);
  const imgStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    aspectRatio,
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden rounded-lg group cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={handleClick}
      style={{
        aspectRatio: item.aspectRatio || (item.type === "video" ? 16 / 9 : 1),
      }}
    >
      {/* Placeholder shown while image loads */}
      {!imageLoaded && <ImagePlaceholder aspectRatio={item.aspectRatio} />}

      <img
        src={item.url}
        loading="lazy"
        style={imgStyle}
        className={`
          absolute inset-0
          transition-all duration-300 ease-in-out
          group-hover:scale-105
          ${imageLoaded ? "opacity-100" : "opacity-0"}
        `}
        onLoad={() => setInternalIsLoaded(true)}
        alt={item.title || `Image ${item.id}`}
      />

      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

      {/* Display metadata on hover */}
      {(item.title || item.subtitle || item.width || item.height) && (
        <div className="absolute inset-0 flex flex-col justify-between p-3">
          {/* Top metadata - dimensions */}
          {(item.width || item.height) && (
            <div className="self-end">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs font-medium">
                  {item.width} × {item.height}
                </span>
              </div>
            </div>
          )}

          {/* Bottom metadata - title/subtitle */}
          {(item.title || item.subtitle) && (
            <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-lg p-2 -m-3 mt-auto">
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
      )}
    </div>
  );
};
