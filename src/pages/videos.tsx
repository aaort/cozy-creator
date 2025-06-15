import { MediaModal, useMediaModal } from "@/components/ui/media-modal";
import type { GridItem } from "@/components/ui/virtualized-grid";
import {
  VideoRenderer,
  VirtualizedGrid,
  useAvailableHeight,
  useContainerWidth,
  useResponsiveColumns,
  useScrollOffset,
  useVideos,
} from "@/components/ui/virtualized-grid";
import { HEADER_HEIGHT } from "@constants/layout";
import videoMetadata from "@data/video-metadata.json";
import { useEffect, useRef } from "react";

// Convert the initial videos from the JSON data
const initialVideos: GridItem[] = videoMetadata.videos.map((vid, index) => ({
  id: `video-${index + 1}`,
  url: vid.src,
  width: vid.width,
  height: vid.height,
  title: `Video ${index + 1}`,
  subtitle: "Click to view full size",
  type: "video",
  aspectRatio: 16 / 9,
}));

export function Videos() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [space, updateSpace] = useScrollOffset(HEADER_HEIGHT);
  const columns = useResponsiveColumns();
  const containerWidth = useContainerWidth(
    containerRef as React.RefObject<HTMLElement>,
  );
  const availableHeight = useAvailableHeight();
  const { isOpen, currentItem, openModal, closeModal, goToNext, goToPrevious } =
    useMediaModal();

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
      <main ref={containerRef} className="px-2" style={{ paddingTop: space }}>
        {containerWidth && (
          <VirtualizedGrid
            items={videos}
            renderItem={renderVideo}
            hasNextPage={hasNextPage}
            isNextPageLoading={isNextPageLoading}
            loadNextPage={loadNextPage}
            gap={16}
            onGridScroll={handleScroll}
            columns={columns}
            availableHeight={availableHeight}
            containerWidth={containerWidth}
            onItemClick={handleItemClick}
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
      />
    </div>
  );
}
