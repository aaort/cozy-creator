import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { VariableSizeGrid as Grid, type GridOnScrollProps } from "react-window";
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
  columnWidth: number;
  items: GridItem[];
  columnCount: number;
  renderItem: (
    item: GridItem,
    width: number,
    isLoaded: boolean,
    onItemClick?: (item: GridItem) => void,
    onLoadingStateChange?: (itemId: string, isLoading: boolean) => void,
  ) => React.ReactNode;
  onItemClick?: (item: GridItem) => void;
  enableItemAnimation: boolean;
  onLoadingStateChange: (itemId: string, isLoading: boolean) => void;
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
  const {
    columnCount,
    items,
    itemWidth,
    gap,
    renderItem,
    onItemClick,
    columnWidth,
    enableItemAnimation,
  } = data;
  const itemIndex = rowIndex * columnCount + columnIndex;

  if (itemIndex >= items.length) return null;

  const item = items[itemIndex];

  // Calculate height based on aspect ratio, default to 16/9 for videos
  const aspectRatio = item.aspectRatio || (item.type === "video" ? 16 / 9 : 1);
  const itemHeight = itemWidth / aspectRatio;

  return (
    <div
      style={{
        ...style,
        width: columnWidth,
        height: itemHeight + gap / 2,
        overflow: "hidden",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: gap / 4,
      }}
    >
      <div
        style={{
          width: itemWidth,
          height: itemHeight,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          ...(enableItemAnimation && {
            opacity: 0,
            transform: "translateY(8px)",
            animation: `gridItemFadeIn 0.4s ease-out forwards`,
            animationDelay: `${Math.min(itemIndex * 25, 600)}ms`,
          }),
        }}
      >
        {renderItem(
          item,
          itemWidth,
          true,
          onItemClick,
          data.onLoadingStateChange,
        )}
      </div>
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
    onLoadingStateChange?: (itemId: string, isLoading: boolean) => void,
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
  getRowHeight?: (
    index: number,
    items: GridItem[],
    columns: number,
    itemWidth: number,
    gap: number,
  ) => number;
  defaultRowHeight?: number;
  /** Enable smooth transition animation when the grid first renders. Defaults to true. */
  enableInitialTransition?: boolean;
  /** Duration of the initial transition animation in milliseconds. Defaults to 500ms. */
  initialTransitionDuration?: number;
  /**
   * Threshold for triggering infinite loading. Higher values load more eagerly and reduce empty content during fast scrolling.
   * Represents the number of items before the end of the list when loading should start. Defaults to 50.
   */
  infiniteLoaderThreshold?: number;
  /**
   * Number of rows to render outside the visible area for smoother scrolling.
   * Higher values prevent blank content during fast scrolling but use more memory. Defaults to 8.
   */
  overscanRowCount?: number;
  /**
   * Number of columns to render outside the visible area.
   * Usually kept low since horizontal scrolling is less common. Defaults to 2.
   */
  overscanColumnCount?: number;
  /**
   * Enable scroll prevention when content is loading. Prevents fast scrolling past unloaded content.
   * Defaults to true.
   */
  enableScrollPrevention?: boolean;
  /**
   * Maximum percentage of loading items in visible area before scroll prevention kicks in.
   * Lower values are more restrictive. Defaults to 0.3 (30%).
   */
  loadingThreshold?: number;
}

export const VirtualizedGrid = forwardRef<Grid, VirtualizedGridProps>(
  function VirtualizedGrid(props, ref) {
    const {
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
      enableInitialTransition = true,
      initialTransitionDuration = 500,
      infiniteLoaderThreshold = 50,
      overscanRowCount = 8,
      overscanColumnCount = 2,
      enableScrollPrevention = true,
      loadingThreshold = 0.3,
    } = props;
    const gridRef = useRef<Grid>(null);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [showContent, setShowContent] = useState(!enableInitialTransition);
    const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
    const [visibleItemIds, setVisibleItemIds] = useState<Set<string>>(
      new Set(),
    );
    const [isScrollPrevented, setIsScrollPrevented] = useState(false);
    const lastScrollTime = useRef<number>(0);

    // Reset grid when columns change
    useEffect(() => {
      if (gridRef.current) {
        gridRef.current.resetAfterColumnIndex(0, true);
        gridRef.current.resetAfterRowIndex(0, true);
      }
    }, [columns]);

    // Handle initial transition
    useEffect(() => {
      if (enableInitialTransition && items.length > 0 && isInitialRender) {
        const timer = setTimeout(() => {
          setShowContent(true);
          setIsInitialRender(false);
        }, 50); // Small delay to ensure DOM is ready

        return () => clearTimeout(timer);
      } else if (!enableInitialTransition && isInitialRender) {
        setIsInitialRender(false);
      }
    }, [enableInitialTransition, items.length, isInitialRender]);

    // Track loading state changes
    const handleLoadingStateChange = useCallback(
      (itemId: string, isLoading: boolean) => {
        setLoadingItems((prev) => {
          const newSet = new Set(prev);
          if (isLoading) {
            newSet.add(itemId);
          } else {
            newSet.delete(itemId);
          }
          return newSet;
        });
      },
      [],
    );

    // Calculate loading ratio in visible area
    const getVisibleLoadingRatio = useCallback(() => {
      if (visibleItemIds.size === 0) return 0;
      let loadingCount = 0;
      visibleItemIds.forEach((itemId) => {
        if (loadingItems.has(itemId)) {
          loadingCount++;
        }
      });
      return loadingCount / visibleItemIds.size;
    }, [loadingItems, visibleItemIds]);

    // Enhanced scroll handler with prevention
    const handleScroll = useCallback(
      (props: GridOnScrollProps) => {
        // Apply scroll prevention if enabled
        if (enableScrollPrevention) {
          const loadingRatio = getVisibleLoadingRatio();
          const hasHeavyContent = Array.from(visibleItemIds).some((itemId) => {
            const item = items.find((i) => i.id === itemId);
            return item?.type === "video";
          });

          // More aggressive prevention for videos
          const effectiveThreshold = hasHeavyContent
            ? loadingThreshold * 0.6
            : loadingThreshold;

          if (loadingRatio > effectiveThreshold) {
            // Prevent fast scrolling by returning early
            // Only allow slow, deliberate scrolling
            const now = Date.now();
            const timeSinceLastScroll = now - lastScrollTime.current;

            if (timeSinceLastScroll < 100) {
              // Less than 100ms since last scroll
              setIsScrollPrevented(true);
              setTimeout(() => setIsScrollPrevented(false), 200);
              return; // Block rapid scrolling
            }

            lastScrollTime.current = now;
          } else {
            setIsScrollPrevented(false);
          }
        }

        if (onGridScroll) {
          onGridScroll(props);
        }
      },
      [
        enableScrollPrevention,
        loadingThreshold,
        getVisibleLoadingRatio,
        visibleItemIds,
        items,
        onGridScroll,
      ],
    );

    const isItemLoaded = useCallback(
      (index: number) => {
        // Item is loaded if it exists in the items array
        return !!items[index];
      },
      [items],
    );

    const columnCount = columns;
    const itemWidth = Math.floor(
      (containerWidth - gap * (columns - 1)) / columns,
    );
    const columnWidth = containerWidth / columnCount;
    const rowCount = Math.ceil(items.length / columns);

    // Use custom row height calculation function if provided, otherwise use default calculation
    // Calculate row heights based on items and their aspect ratios
    const getRowHeight = useCallback(
      (index: number) => {
        // If custom row height calculation is provided, use it
        if (props.getRowHeight) {
          return props.getRowHeight(index, items, columns, itemWidth, gap);
        }

        // Default row height calculation
        const startItemIndex = index * columns;
        let maxRowHeight = props.defaultRowHeight || itemWidth; // Use default height or square
        let hasItems = false;

        // Find the tallest item in this row
        for (let i = 0; i < columns; i++) {
          const itemIndex = startItemIndex + i;
          if (itemIndex < items.length) {
            hasItems = true;
            const item = items[itemIndex];
            // Default to 16/9 for videos if no aspect ratio is provided
            const aspectRatio =
              item.aspectRatio || (item.type === "video" ? 16 / 9 : 1);
            const itemHeight = itemWidth / aspectRatio;
            maxRowHeight = Math.max(maxRowHeight, itemHeight);
          }
        }

        // If no items in this row, use minimal height
        if (!hasItems) {
          return gap;
        }

        // Use minimal spacing for all item types to reduce vertical gaps
        const defaultSpacing = gap / 2;

        return maxRowHeight + defaultSpacing;
      },
      [props, columns, itemWidth, gap, items],
    );

    // Recalculate grid when items or dimensions change
    useEffect(() => {
      if (gridRef.current) {
        gridRef.current.resetAfterColumnIndex(0);
        gridRef.current.resetAfterRowIndex(0);
      }
    }, [items, itemWidth, columns]);

    const gridItemData: GridItemData = {
      gap,
      itemWidth,
      columnWidth,
      columnCount,
      items,
      renderItem,
      onItemClick,
      enableItemAnimation: enableInitialTransition,
      onLoadingStateChange: handleLoadingStateChange,
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
          opacity: showContent ? 1 : 0,
          transform: showContent
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.95)",
          transition: enableInitialTransition
            ? `opacity ${initialTransitionDuration}ms ease-out, transform ${initialTransitionDuration}ms ease-out`
            : "none",
        }}
      >
        <style>
          {`
            @keyframes gridItemFadeIn {
              from {
                opacity: 0;
                transform: translateY(8px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
        <InfiniteLoader
          threshold={infiniteLoaderThreshold}
          isItemLoaded={isItemLoaded}
          loadMoreItems={loadNextPage}
          itemCount={hasNextPage ? items.length + 1 : items.length}
        >
          {({ onItemsRendered, ref: infiniteLoaderRef }) => (
            <Grid
              onScroll={handleScroll}
              ref={(grid) => {
                gridRef.current = grid;
                if (typeof infiniteLoaderRef === "function") {
                  infiniteLoaderRef(grid);
                } else if (infiniteLoaderRef) {
                  //@ts-expect-error type is not defineds
                  infiniteLoaderRef.current = grid;
                }
                if (typeof ref === "function") {
                  ref(grid);
                } else if (ref) {
                  ref.current = grid;
                }
              }}
              style={{
                overflowX: "hidden",
                width: "100%",
                overscrollBehavior: "contain", // Prevent scroll chaining
                WebkitOverflowScrolling: enableScrollPrevention
                  ? "auto"
                  : "touch",
                msOverflowStyle: "none", // Hide scrollbar in IE/Edge
                scrollbarWidth: "none", // Firefox
              }}
              className="custom-scrollbar overflow-y-auto overflow-x-hidden"
              columnCount={columnCount}
              columnWidth={() => containerWidth / columnCount}
              height={availableHeight}
              rowCount={rowCount}
              rowHeight={getRowHeight} // Use dynamic row height function
              width={containerWidth}
              itemData={gridItemData}
              overscanRowCount={overscanRowCount}
              overscanColumnCount={overscanColumnCount}
              useIsScrolling={true}
              onItemsRendered={({
                visibleColumnStartIndex,
                visibleColumnStopIndex,
                visibleRowStartIndex,
                visibleRowStopIndex,
                overscanColumnStartIndex,
                overscanColumnStopIndex,
                overscanRowStartIndex,
                overscanRowStopIndex,
              }) => {
                const startIndex =
                  overscanRowStartIndex * columnCount +
                  overscanColumnStartIndex;
                const stopIndex =
                  overscanRowStopIndex * columnCount + overscanColumnStopIndex;

                // Track visible items for scroll prevention
                const visibleStart =
                  visibleRowStartIndex * columnCount + visibleColumnStartIndex;
                const visibleStop =
                  visibleRowStopIndex * columnCount + visibleColumnStopIndex;
                const newVisibleIds = new Set<string>();

                for (
                  let i = visibleStart;
                  i <= visibleStop && i < items.length;
                  i++
                ) {
                  if (items[i]) {
                    newVisibleIds.add(items[i].id);
                  }
                }
                setVisibleItemIds(newVisibleIds);

                onItemsRendered({
                  overscanStartIndex: Math.max(0, startIndex - columnCount * 3),
                  overscanStopIndex: Math.min(
                    items.length - 1,
                    stopIndex + columnCount * 3,
                  ),
                  visibleStartIndex: visibleStart,
                  visibleStopIndex: visibleStop,
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

        {/* Scroll prevention indicator */}
        {isScrollPrevented && (
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 z-50"
            style={{
              pointerEvents: "none",
            }}
          >
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Loading content...</span>
          </div>
        )}
      </div>
    );
  },
);
