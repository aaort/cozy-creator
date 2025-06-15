import { Header } from "@components/layout/header";
import { VirtualizedImageGrid } from "@components/ui/virtualized-image-grid";
import { STATIC_IMAGE_URL } from "@constants/data";
import { useState } from "react";
import type { GridOnScrollProps } from "react-window";
import { HEADER_HEIGHT } from "./constants/layout";

function App() {
  const [space, setSpace] = useState<number>(HEADER_HEIGHT);

  const handleGridScroll = (props: GridOnScrollProps) => {
    setSpace(Math.max(HEADER_HEIGHT - props.scrollTop, 0));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="px-2" style={{ paddingTop: space }}>
        <VirtualizedImageGrid
          gap={36}
          itemHeight={280}
          itemsPerPage={40}
          className="mx-auto"
          initialItemCount={40}
          onGridScroll={handleGridScroll}
          baseImageUrl={STATIC_IMAGE_URL}
        />
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
