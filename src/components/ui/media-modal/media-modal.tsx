import React, { useCallback, useEffect, useRef, useState } from "react";
import type { GridItem } from "../virtualized-grid/virtualized-grid";
import "./animations.css";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: GridItem | null;
  onNext: () => void;
  onPrevious: () => void;
  isFirstItem?: boolean;
  isLastItem?: boolean;
}

export function MediaModal({
  isOpen,
  onClose,
  currentItem,
  onNext,
  onPrevious,
  isFirstItem = false,
  isLastItem = false,
}: MediaModalProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Toggle video playback
  const togglePlayback = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Ignore play errors
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          if (!isLastItem) {
            onNext();
          }
          break;
        case "ArrowLeft":
          // Only go to previous if not the first item
          if (!isFirstItem) {
            onPrevious();
          }
          break;
        case " ": // Space bar
          togglePlayback();
          e.preventDefault(); // Prevent page scrolling
          break;
        default:
          break;
      }
    },
    [
      isOpen,
      onClose,
      onNext,
      onPrevious,
      togglePlayback,
      isFirstItem,
      isLastItem,
    ],
  );

  // Add event listeners for keyboard navigation
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Reset loaded state when item changes
  useEffect(() => {
    setIsLoaded(false);
    setIsPlaying(true);
  }, [currentItem]);

  // Play video when it's loaded
  useEffect(() => {
    if (currentItem?.type === "video" && videoRef.current && isOpen) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Ignore autoplay errors
        });
      }
    }
  }, [currentItem, isOpen, isPlaying]);

  // Handle clicks outside the media content to close the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle video click
  const handleVideoClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      togglePlayback();
    },
    [togglePlayback],
  );

  // Don't render anything if modal is not open or no item
  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm modal-backdrop"
      onClick={handleBackdropClick}
    >
      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative max-w-7xl max-h-[90vh] overflow-hidden rounded-lg modal-content"
      >
        {/* Media Content */}
        <div className="relative media-container">
          {/* Loading Indicator */}
          {!isLoaded && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 transition-opacity duration-200"
              style={{ opacity: !isLoaded ? 1 : 0 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {/* Render Image or Video based on type */}
          {currentItem.type === "image" ? (
            <img
              key={currentItem.url}
              src={currentItem.url}
              alt={currentItem.title || "Image"}
              className="max-h-[85vh] max-w-full object-contain transition-opacity duration-300"
              style={{ opacity: isLoaded ? 1 : 0, cursor: "default" }}
              onLoad={() => setIsLoaded(true)}
            />
          ) : (
            <video
              key={currentItem.url}
              ref={videoRef}
              src={currentItem.url}
              controls={false} /* Disable native controls */
              autoPlay
              onClick={handleVideoClick}
              className="max-h-[85vh] max-w-full object-contain transition-opacity duration-300 cursor-pointer"
              style={{ opacity: isLoaded ? 1 : 0, cursor: "pointer" }}
              onLoadedData={() => setIsLoaded(true)}
              onLoadedMetadata={() => setIsLoaded(true)}
              onCanPlay={() => setIsLoaded(true)}
              onPause={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
            />
          )}

          {/* Play/Pause Indicator (only for videos) */}
          {currentItem.type === "video" && isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 hover:opacity-60 pointer-events-none">
              <div className="bg-black/50 rounded-full p-4 transition-transform duration-300">
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L8.03 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                    />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons - Previous (hidden for first item) */}
          {!isFirstItem && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 hover:scale-110 text-white rounded-full p-2 transition-all animate-fadeSlideIn left shadow-lg control-button"
              style={{ animationDelay: "0.2s" }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onPrevious();
              }}
              aria-label="Previous"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          {/* Next button - show only if there are more items */}
          {!isLastItem && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 hover:scale-110 text-white rounded-full p-2 transition-all animate-fadeSlideIn right shadow-lg control-button"
              style={{ animationDelay: "0.2s" }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Next"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}

          {/* Close Button */}
          <button
            className="absolute right-4 top-4 bg-black/50 hover:bg-black/70 hover:scale-110 text-white rounded-full p-2 transition-all animate-fadeSlideIn top shadow-lg control-button"
            style={{ animationDelay: "0.2s" }}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Caption */}
        {(currentItem.title || currentItem.subtitle) && (
          <div
            className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white p-4 animate-fadeSlideIn bottom transition-opacity duration-300 caption-container"
            style={{ animationDelay: "0.3s" }}
          >
            {currentItem.title && (
              <h3 className="font-semibold text-lg">{currentItem.title}</h3>
            )}
            {currentItem.subtitle && (
              <p className="text-white/80 text-sm mt-1">
                {currentItem.subtitle}
              </p>
            )}
            <div className="text-xs text-white/60 mt-2">
              {currentItem.width && currentItem.height && (
                <span>
                  {currentItem.width} × {currentItem.height}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
