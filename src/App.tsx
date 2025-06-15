import { Header } from "@components/layout/header";
import { VirtualizedImageGrid } from "@components/ui/virtualized-image-grid";
import { STATIC_IMAGE_URL } from "@constants/data";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="px-2 pb-8">
        <VirtualizedImageGrid
          gap={36}
          itemHeight={280}
          itemsPerPage={40}
          className="mx-auto"
          initialItemCount={40}
          baseImageUrl={STATIC_IMAGE_URL}
        />
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default App;
