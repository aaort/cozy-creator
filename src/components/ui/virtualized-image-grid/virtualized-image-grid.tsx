import { MediaModal, useMediaModal } from "@/components/ui/media-modal";
import { imagesToGridItems } from "@/components/ui/virtualized-grid/adapters/image-adapter";
import { ImageRenderer } from "@/components/ui/virtualized-grid/renderers/image-renderer";
import type { GridItem } from "@/components/ui/virtualized-grid/virtualized-grid";
import { VirtualizedGrid } from "@/components/ui/virtualized-grid/virtualized-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GridOnScrollProps, VariableSizeGrid } from "react-window";
import { useResponsiveColumns } from "./hooks/columns";
import { useAvailableHeight } from "./hooks/height";
import { useImages } from "./hooks/images";
import { useContainerWidth } from "./hooks/width";

interface VirtualizedImageGridProps {
  gap?: number;
  itemHeight?: number; // This is kept for backward compatibility but won't be used
  className?: string;
  baseImageUrl?: string; // Optional since we now use image_metadata.json
  itemsPerPage?: number;
  initialItemCount?: number;
  onGridScroll?: (props: GridOnScrollProps) => void;
}

export function VirtualizedImageGrid({
  baseImageUrl = "https://picsum.photos/id/", // Default value for backward compatibility
  initialItemCount = 40,
  itemsPerPage = 20,
  gap = 16,
  onGridScroll,
  className = "",
}: VirtualizedImageGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<VariableSizeGrid<unknown>>(null);
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
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Custom row height calculation for images
  const getImageRowHeight = useCallback(
    (
      index: number,
      items: GridItem[],
      columns: number,
      itemWidth: number,
      gap: number,
    ) => {
      const startItemIndex = index * columns;
      let maxRowHeight = itemWidth; // Default square height
      let hasItems = false;

      // Find the tallest item in this row
      for (let i = 0; i < columns; i++) {
        const itemIndex = startItemIndex + i;
        if (itemIndex < items.length) {
          hasItems = true;
          const item = items[itemIndex];
          const aspectRatio = item.aspectRatio || 1;
          const itemHeight = itemWidth / aspectRatio;
          maxRowHeight = Math.max(maxRowHeight, itemHeight);
        }
      }

      // If no items in this row, use minimal height
      if (!hasItems) {
        return gap;
      }

      return maxRowHeight + gap / 2; // Use smaller spacing between rows
    },
    [],
  );

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

  // When images change, reset grid measurements to recalculate row heights
  useEffect(() => {
    if (gridRef.current && images.length > 0) {
      setImagesLoaded(true);
      // Give a small delay to ensure DOM updates
      setTimeout(() => {
        if (gridRef.current) {
          gridRef.current.resetAfterRowIndex(0, true);
        }
      }, 100);
    }
  }, [images]);

  // Convert the images to GridItem format
  const gridItems: GridItem[] = useCallback(() => {
    const items = imagesToGridItems(images);
    // After conversion, if we have the grid ref, reset measurements
    if (gridRef.current && items.length > 0) {
      setTimeout(() => {
        if (gridRef.current) {
          gridRef.current.resetAfterRowIndex(0, true);
        }
      }, 50);
    }
    return items;
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
        isLoaded={imagesLoaded || isLoaded}
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
          ref={gridRef}
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
          getRowHeight={getImageRowHeight}
        />
      </div>

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
    </>
  );
}
