import { MediaModal, useMediaModal } from "@/components/ui/media-modal";
import { imagesToGridItems } from "@/components/ui/virtualized-grid/adapters/image-adapter";
import { ImageRenderer } from "@/components/ui/virtualized-grid/renderers";
import type { GridItem } from "@/components/ui/virtualized-grid/virtualized-grid";
import { VirtualizedGrid } from "@/components/ui/virtualized-grid/virtualized-grid";
import { useCallback, useEffect, useRef } from "react";
import type { GridOnScrollProps } from "react-window";
import { useResponsiveColumns } from "./hooks/columns";
import { useAvailableHeight } from "./hooks/height";
import { useImages } from "./hooks/images";
import { useContainerWidth } from "./hooks/width";

interface VirtualizedImageGridProps {
  gap?: number;
  itemHeight?: number; // This is kept for backward compatibility but won't be used
  className?: string;
  baseImageUrl: string;
  itemsPerPage?: number;
  initialItemCount?: number;
  onGridScroll?: (props: GridOnScrollProps) => void;
}

export function VirtualizedImageGrid({
  baseImageUrl,
  initialItemCount = 40,
  itemsPerPage = 20,
  gap = 16,
  onGridScroll,
  className = "",
}: VirtualizedImageGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isOpen, currentItem, openModal, closeModal, goToNext, goToPrevious } =
    useMediaModal();

  const {
    images,
    hasNextPage,
    loadNextPage,
    loadInitialImages,
    isNextPageLoading,
  } = useImages({ initialItemCount, itemsPerPage, baseImageUrl });

  useEffect(() => {
    loadInitialImages();
  }, [loadInitialImages]);

  const columns = useResponsiveColumns();
  const containerWidth = useContainerWidth(containerRef);
  const availableHeight = useAvailableHeight();

  // Convert the images to GridItem format
  const gridItems: GridItem[] = useCallback(() => {
    return imagesToGridItems(images);
  }, [images])();

  // Handle item click
  const handleItemClick = (item: GridItem) => {
    openModal(item, gridItems);
  };

  // Render the image component
  const renderImage = (
    item: GridItem,
    width: number,
    isLoaded: boolean,
    onClick?: (item: GridItem) => void,
  ) => {
    return (
      <ImageRenderer
        item={item}
        width={width}
        isLoaded={isLoaded}
        onClick={onClick}
      />
    );
  };

  if (!containerWidth) {
    return (
      <div ref={containerRef} className={`w-full ${className}`}>
        <div
          className="flex justify-center items-center"
          style={{ height: availableHeight }}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Preparing gallery...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className={`w-full ${className}`}>
        <VirtualizedGrid
          items={gridItems}
          renderItem={renderImage}
          hasNextPage={hasNextPage}
          isNextPageLoading={isNextPageLoading}
          loadNextPage={loadNextPage}
          gap={gap}
          onGridScroll={onGridScroll}
          columns={columns}
          availableHeight={availableHeight}
          containerWidth={containerWidth}
          onItemClick={handleItemClick}
        />
      </div>

      {/* Media Modal */}
      <MediaModal
        isOpen={isOpen}
        onClose={closeModal}
        currentItem={currentItem}
        onNext={goToNext}
        onPrevious={goToPrevious}
      />
    </>
  );
}
