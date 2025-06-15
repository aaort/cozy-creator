import { MediaModal, useMediaModal } from "@components/ui/media-modal";
import type { GridItem } from "@components/ui/virtualized-grid";
import {
  VideoRenderer,
  VirtualizedGrid,
  useAvailableHeight,
  useContainerWidth,
  useResponsiveColumns,
  useResponsiveGap,
  useScrollOffset,
  useVideos,
} from "@components/ui/virtualized-grid";
import { HEADER_HEIGHT } from "@constants/layout";
import videoMetadata from "@data/video-metadata.json";
import { useCallback, useEffect, useRef } from "react";

// Convert the initial videos from the JSON data
const initialVideos: GridItem[] = videoMetadata.videos.map((vid, index) => ({
  id: `video-${index + 1}`,
  url: vid.src,
  width: vid.width,
  height: vid.height,
  title: (vid as any).model || vid.title || `Video ${index + 1}`,
  subtitle: "Click to view full size",
  type: "video",
  aspectRatio: 16 / 9,
}));

export function Videos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [space, updateSpace] = useScrollOffset(HEADER_HEIGHT);
  const columns = useResponsiveColumns({
    base: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 3,
  });
  const containerWidth = useContainerWidth(
    containerRef as React.RefObject<HTMLElement>,
  );
  const availableHeight = useAvailableHeight();
  const gap = useResponsiveGap(16);
  const {
    isOpen,
    currentItem,
    openModal,
    closeModal,
    goToNext,
    goToPrevious,
    isFirstItem,
    isLastItem,
  } = useMediaModal();

  // Custom row height calculation for videos - uses a fixed 16:9 aspect ratio
  const getVideoRowHeight = useCallback(
    (
      _: number,
      __: GridItem[],
      ___: number,
      itemWidth: number,
      gap: number,
    ) => {
      // Fixed height for video rows based on 16:9 aspect ratio
      // Use a proportional gap that works well with the larger spacing
      const videoHeight = (itemWidth * 9) / 16;
      return videoHeight + gap * 0.6;
    },
    [],
  );

  const {
    videos,
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    loadInitialVideos,
  } = useVideos({
    initialVideos,
    itemsPerPage: 10,
  });

  useEffect(() => {
    loadInitialVideos();
  }, [loadInitialVideos]);

  const handleScroll = (props: { scrollTop: number }) => {
    updateSpace(props.scrollTop);
  };

  const handleItemClick = (item: GridItem) => {
    openModal(item, videos);
  };

  const renderVideo = (
    item: GridItem,
    width: number,
    isLoaded: boolean,
    onClick?: (item: GridItem) => void,
  ) => {
    return (
      <VideoRenderer
        item={item}
        width={width}
        isLoaded={isLoaded}
        onClick={onClick}
      />
    );
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-auto"
      onScroll={(e) => updateSpace(e.currentTarget.scrollTop)}
    >
      <main
        ref={containerRef}
        className="px-4 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto"
        style={{ paddingTop: space }}
      >
        {containerWidth && (
          <VirtualizedGrid
            items={videos}
            renderItem={renderVideo}
            hasNextPage={hasNextPage}
            isNextPageLoading={isNextPageLoading}
            loadNextPage={loadNextPage}
            gap={gap}
            onGridScroll={handleScroll}
            columns={columns}
            availableHeight={availableHeight}
            containerWidth={containerWidth}
            onItemClick={handleItemClick}
            getRowHeight={getVideoRowHeight}
          />
        )}
      </main>

      {/* Media Modal */}
      <MediaModal
        isOpen={isOpen}
        onClose={closeModal}
        currentItem={currentItem}
        onNext={goToNext}
        onPrevious={goToPrevious}
        isFirstItem={isFirstItem}
        isLastItem={isLastItem}
      />
    </div>
  );
}
