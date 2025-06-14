import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { VirtualizedImageGrid } from "./components/ui/virtualized-image-grid";

const STATIC_IMAGE_URL = "https://picsum.photos/id/";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <Header />
      </div>

      <main className="px-2 pb-8">
        <VirtualizedImageGrid
          gap={36}
          itemHeight={280}
          itemsPerPage={20}
          className="mx-auto"
          initialItemCount={40}
          baseImageUrl={STATIC_IMAGE_URL}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;
