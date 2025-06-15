import { Header } from "@components/layout/header";
import { GenerateFab } from "@ui/generate/generate-fab";
import { Route, Routes } from "react-router-dom";
import { LiveFeed, Videos } from "./pages";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden max-h-[100vh]">
      <Header />

      <Routes>
        <Route path="/" element={<LiveFeed />} />
        <Route path="/videos" element={<Videos />} />
      </Routes>

      <GenerateFab />
    </div>
  );
}

export default App;
