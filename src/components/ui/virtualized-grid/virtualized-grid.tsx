import React, { useCallback, useEffect, useRef } from "react";
import { FixedSizeGrid as Grid, type GridOnScrollProps } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

export interface GridItem {
  id: string;
  url: string;
  width?: number | string;
  height?: number | string;
  title?: string;
  subtitle?: string;
  type: "image" | "video";
  aspectRatio?: number;
}

interface GridItemData {
  gap: number;
  itemWidth: number;
  items: GridItem[];
  columnCount: number;
  renderItem: (
    item: GridItem,
    width: number,
    isLoaded: boolean,
    onItemClick?: (item: GridItem) => void,
  ) => React.ReactNode;
  onItemClick?: (item: GridItem) => void;
}

interface GridItemProps {
  rowIndex: number;
  data: GridItemData;
  columnIndex: number;
  style: React.CSSProperties;
}

function GridItemComponent({
  columnIndex,
  rowIndex,
  style,
  data,
}: GridItemProps) {
  const { columnCount, items, itemWidth, gap, renderItem, onItemClick } = data;
  const itemIndex = rowIndex * columnCount + columnIndex;

  if (itemIndex >= items.length) return null;

  const item = items[itemIndex];

  return (
    <div
      style={{
        ...style,
        left: (style.left as number) + gap / 2,
        top: (style.top as number) + gap / 2,
        width: itemWidth,
        height: item.aspectRatio ? itemWidth / item.aspectRatio : itemWidth,
      }}
    >
      {renderItem(item, itemWidth, false, onItemClick)}
    </div>
  );
}

export interface VirtualizedGridProps {
  items: GridItem[];
  renderItem: (
    item: GridItem,
    width: number,
    isLoaded: boolean,
    onItemClick?: (item: GridItem) => void,
  ) => React.ReactNode;
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  loadNextPage: () => void;
  gap?: number;
  className?: string;
  onGridScroll?: (props: GridOnScrollProps) => void;
  columns: number;
  availableHeight: number;
  containerWidth: number;
  onItemClick?: (item: GridItem) => void;
}

export function VirtualizedGrid({
  items,
  renderItem,
  hasNextPage,
  isNextPageLoading,
  loadNextPage,
  gap = 16,
  onGridScroll,
  className = "",
  columns,
  availableHeight,
  containerWidth,
  onItemClick,
}: VirtualizedGridProps) {
  const gridRef = useRef<Grid>(null);

  // Reset grid when columns change
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.setState({ columnIndex: 0, rowIndex: 0 });
    }
  }, [columns]);

  const isItemLoaded = useCallback((index: number) => !!items[index], [items]);

  const itemWidth = Math.floor(
    (containerWidth - gap * (columns + 1)) / columns,
  );
  const rowCount = Math.ceil(items.length / columns);
  const columnCount = columns;

  const gridItemData: GridItemData = {
    gap,
    itemWidth,
    columnCount,
    items,
    renderItem,
    onItemClick,
  };

  if (!containerWidth) {
    return (
      <div className={`w-full overflow-hidden ${className}`}>
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
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{
        touchAction: "pan-y",
        WebkitOverflowScrolling: "touch",
        position: "relative",
      }}
    >
      <InfiniteLoader
        threshold={15}
        isItemLoaded={isItemLoaded}
        loadMoreItems={loadNextPage}
        itemCount={hasNextPage ? items.length + 1 : items.length}
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
            style={{
              overflowX: "hidden",
              width: "100%",
              overscrollBehavior: "contain", // Prevent scroll chaining
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none", // Hide scrollbar in IE/Edge
              scrollbarWidth: "none", // Firefox
            }}
            className="custom-scrollbar overflow-y-auto overflow-x-hidden"
            columnCount={columnCount}
            columnWidth={itemWidth + gap}
            height={availableHeight}
            rowCount={rowCount}
            rowHeight={itemWidth + gap} // Default square aspect ratio
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
            {GridItemComponent}
          </Grid>
        )}
      </InfiniteLoader>

      <div
        className="h-16 flex justify-center items-center overflow-hidden"
        style={{
          pointerEvents: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        {isNextPageLoading && (
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-muted-foreground text-sm">
              Loading more items...
            </span>
          </div>
        )}

        {!hasNextPage && items.length > 0 && !isNextPageLoading && (
          <span className="text-muted-foreground text-sm">
            No more items to load
          </span>
        )}
      </div>
    </div>
  );
}
