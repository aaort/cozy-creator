import React, { useCallback, useEffect, useRef, useState } from "react";
import { FixedSizeGrid as Grid, type GridOnScrollProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { ImagePlaceholder } from "./atoms/image-placeholder";
import { useResponsiveColumns } from "./hooks/columns";
import { useAvailableHeight } from "./hooks/height";
import { useImages, type ImageData } from "./hooks/images";
import { useContainerWidth } from "./hooks/width";

interface GridItemData {
  gap: number;
  itemWidth: number;
  items: ImageData[];
  columnCount: number;
}

const GridItem: React.FC<{
  rowIndex: number;
  data: GridItemData;
  columnIndex: number;
  style: React.CSSProperties;
}> = ({ columnIndex, rowIndex, style, data }) => {
  const { columnCount, items: images, itemWidth, gap } = data;
  const itemIndex = rowIndex * columnCount + columnIndex;
  const [imageLoaded, setImageLoaded] = useState(false);

  if (itemIndex >= images.length) return null;

  const imageUrl = images[itemIndex].url;

  return (
    <div
      style={{
        ...style,
        left: (style.left as number) + gap / 2,
        top: (style.top as number) + gap / 2,
        width: itemWidth,
        height: itemWidth, // Square aspect ratio
      }}
    >
      <div className="relative w-full h-full overflow-hidden rounded-lg group cursor-pointer hover:shadow-lg transition-all duration-300">
        {/* Placeholder shown while image loads */}
        {!imageLoaded && <ImagePlaceholder />}

        <img
          src={imageUrl}
          loading="lazy"
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-all duration-300 ease-in-out
            group-hover:scale-105
            ${imageLoaded ? "opacity-100" : "opacity-0"}
          `}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)} // Show placeholder on error too
        />

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
    </div>
  );
};

interface VirtualizedImageGridProps {
  gap?: number;
  itemHeight: number;
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
  const gridRef = useRef<Grid>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Reset grid when columns change
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.setState({ columnIndex: 0, rowIndex: 0 });
    }
  }, [columns]);

  const isItemLoaded = useCallback(
    (index: number) => !!images[index],
    [images],
  );

  const itemWidth = Math.floor(
    (containerWidth - gap * (columns + 1)) / columns,
  );
  const rowCount = Math.ceil(images.length / columns);
  const columnCount = columns;

  const gridItemData: GridItemData = {
    gap,
    itemWidth,
    columnCount,
    items: images,
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
    <div ref={containerRef} className={`w-full ${className}`}>
      <InfiniteLoader
        threshold={5}
        isItemLoaded={isItemLoaded}
        loadMoreItems={loadNextPage}
        itemCount={hasNextPage ? images.length + 1 : images.length}
      >
        {({ onItemsRendered, ref }) => (
          <Grid
            ref={(grid) => {
              gridRef.current = grid;
              if (typeof ref === "function") {
                ref(grid);
              } else if (ref) {
                // @ts-expect-error current is typed as never, will fix it later
                ref.current = grid;
              }
            }}
            onScroll={onGridScroll}
            className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ml-4"
            columnCount={columnCount}
            columnWidth={itemWidth + gap}
            height={availableHeight}
            rowCount={rowCount}
            rowHeight={itemWidth + gap} // Square aspect ratio
            width={containerWidth}
            itemData={gridItemData}
            onItemsRendered={({
              visibleColumnStartIndex,
              visibleColumnStopIndex,
              visibleRowStartIndex,
              visibleRowStopIndex,
            }) => {
              const startIndex =
                visibleRowStartIndex * columnCount + visibleColumnStartIndex;
              const stopIndex =
                visibleRowStopIndex * columnCount + visibleColumnStopIndex;

              onItemsRendered({
                overscanStartIndex: startIndex,
                overscanStopIndex: stopIndex,
                visibleStartIndex: startIndex,
                visibleStopIndex: stopIndex,
              });
            }}
          >
            {GridItem}
          </Grid>
        )}
      </InfiniteLoader>

      <div className="h-16 flex justify-center items-center">
        {isNextPageLoading && (
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground text-sm">
              Loading more images...
            </span>
          </div>
        )}

        {!hasNextPage && images.length > 0 && !isNextPageLoading && (
          <span className="text-muted-foreground text-sm">
            No more images to load
          </span>
        )}
      </div>
    </div>
  );
}
