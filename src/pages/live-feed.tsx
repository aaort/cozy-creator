import { VirtualizedImageGrid } from "@components/ui/virtualized-image-grid";
import { STATIC_IMAGE_URL } from "@constants/data";
import { HEADER_HEIGHT } from "@constants/layout";
import { useState } from "react";
import type { GridOnScrollProps } from "react-window";

export function LiveFeed() {
  const [space, setSpace] = useState<number>(HEADER_HEIGHT);

  const handleGridScroll = (props: GridOnScrollProps) => {
    setSpace(Math.max(HEADER_HEIGHT - props.scrollTop, 0));
  };

  return (
    <main
      className="px-4 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto"
      style={{ paddingTop: space }}
    >
      <VirtualizedImageGrid
        gap={32}
        itemsPerPage={40}
        initialItemCount={40}
        onGridScroll={handleGridScroll}
        baseImageUrl={STATIC_IMAGE_URL}
      />
    </main>
  );
}
