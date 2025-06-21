import { useScrollOffset } from "@components/ui/virtualized-grid/hooks";
import { VirtualizedImageGrid } from "@components/ui/virtualized-image-grid";
import { STATIC_IMAGE_URL } from "@constants/data";
import { HEADER_HEIGHT } from "@constants/layout";

export function LiveFeed() {
  const [space, updateSpace] = useScrollOffset(HEADER_HEIGHT);

  return (
    <main
      className="px-4 md:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto"
      style={{ paddingTop: space }}
    >
      <VirtualizedImageGrid
        gap={32}
        itemsPerPage={40}
        initialItemCount={40}
        baseImageUrl={STATIC_IMAGE_URL}
        onGridScroll={(e) => updateSpace(e.scrollTop)}
      />
    </main>
  );
}
