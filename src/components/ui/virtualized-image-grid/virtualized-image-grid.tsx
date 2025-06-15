import React, { useCallback, useEffect, useRef, useState } from "react";
import { FixedSizeGrid as Grid, type GridOnScrollProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import { useResponsiveColumns } from "./hooks/columns";
import { useAvailableHeight } from "./hooks/height";
import { useContainerWidth } from "./hooks/width";

const MAX_IMAGE_AMOUNT = 1000;

interface GridItemData {
  gap: number;
  items: string[];
  itemWidth: number;
  columnCount: number;
}

const ImagePlaceholder: React.FC = () => (
  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center">
    <div className="flex flex-col items-center space-y-2 text-gray-400 dark:text-gray-500">
      <svg
        className="w-8 h-8 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <div className="w-12 h-2 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
    </div>
  </div>
);

const GridItem: React.FC<{
  rowIndex: number;
  data: GridItemData;
  columnIndex: number;
  style: React.CSSProperties;
}> = ({ columnIndex, rowIndex, style, data }) => {
  const { columnCount, items, itemWidth, gap } = data;
  const itemIndex = rowIndex * columnCount + columnIndex;
  const [imageLoaded, setImageLoaded] = useState(false);

  if (itemIndex >= items.length) return null;

  const imageUrl = items[itemIndex];

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
  const [items, setItems] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const columns = useResponsiveColumns();
  const containerWidth = useContainerWidth(containerRef);
  const availableHeight = useAvailableHeight();

  console.log("");

  // Initialize items
  useEffect(() => {
    const initialItems = Array.from({ length: initialItemCount }).map(
      (_, index) => `${baseImageUrl}${index}/1000/1000.jpg`,
    );
    setItems(initialItems);
  }, [baseImageUrl, initialItemCount]);

  // Reset grid when columns change
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.setState({ columnIndex: 0, rowIndex: 0 });
    }
  }, [columns]);

  const loadNextPage = useCallback(async () => {
    if (isNextPageLoading) return;

    setIsNextPageLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentLength = items.length;
    const newItems = Array.from({ length: itemsPerPage }).map(
      (_, index) => `${baseImageUrl}${currentLength + index}/1000/1000.jpg`,
    );

    setItems((prevItems) => [...prevItems, ...newItems]);
    setIsNextPageLoading(false);

    // Simulate ending pagination after reaching max
    if (currentLength + itemsPerPage >= MAX_IMAGE_AMOUNT) {
      setHasNextPage(false);
    }
  }, [baseImageUrl, items.length, itemsPerPage, isNextPageLoading]);

  const isItemLoaded = useCallback((index: number) => !!items[index], [items]);

  const itemWidth = Math.floor(
    (containerWidth - gap * (columns + 1)) / columns,
  );
  const rowCount = Math.ceil(items.length / columns);
  const columnCount = columns;

  const gridItemData: GridItemData = {
    columnCount,
    items,
    itemWidth,
    gap,
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
        isItemLoaded={isItemLoaded}
        itemCount={hasNextPage ? items.length + 1 : items.length}
        loadMoreItems={loadNextPage}
        threshold={5}
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

        {!hasNextPage && items.length > 0 && !isNextPageLoading && (
          <span className="text-muted-foreground text-sm">
            No more images to load
          </span>
        )}
      </div>
    </div>
  );
}
