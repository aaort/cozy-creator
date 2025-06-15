import { HEADER_HEIGHT } from "@constants/layout";
import videoMetadata from "@data/video-metadata.json";
import { useState } from "react";

interface VideoData {
  url: string;
  width: string | number;
  height: string | number;
}

const videos: VideoData[] = videoMetadata.videos.map((vid) => ({
  url: vid.src,
  width: vid.width,
  height: vid.height,
}));

export function Videos() {
  const [space, setSpace] = useState<number>(HEADER_HEIGHT);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setSpace(Math.max(HEADER_HEIGHT - scrollTop, 0));
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-auto"
      onScroll={handleScroll}
    >
      <main className="px-2" style={{ paddingTop: space }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {videos.map((video, index) => (
            <div
              key={`${video.url}-${index}`}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-border"
            >
              <div className="aspect-video relative overflow-hidden rounded-2xl bg-muted/20">
                <video
                  loop
                  autoPlay
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  src={video.url}
                  onLoadedData={(e) => {
                    const videoElement = e.target as HTMLVideoElement;
                    videoElement.play().catch(() => {
                      // Ignore autoplay errors
                    });
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-white text-xs font-medium">
                      {video.width} × {video.height}
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm font-semibold truncate">
                  Video {index + 1}
                </p>
                <p className="text-white/90 text-xs mt-1">
                  Click to view full size
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
