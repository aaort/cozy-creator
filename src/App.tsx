import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { Button } from "./components/ui/button";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="flex items-center justify-center gap-4 mb-8">
        <a
          href="https://vite.dev"
          target="_blank"
          className="hover:opacity-80 transition-opacity"
        >
          <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          className="hover:opacity-80 transition-opacity"
        >
          <img src={reactLogo} className="h-16 w-16" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Vite + React
      </h1>

      <div className="flex flex-col items-center gap-6">
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
          <Button
            onClick={() => setCount((count) => count + 1)}
            variant="ghost"
            className="mb-4"
          >
            count is {count}
          </Button>
          <p className="text-muted-foreground text-center">
            Edit{" "}
            <code className="bg-muted px-2 py-1 rounded text-xs">
              src/App.tsx
            </code>{" "}
            and save to test HMR
          </p>
        </div>

        <p className="text-sm text-muted-foreground text-center max-w-md">
          Click on the Vite and React logos to learn more
        </p>

        <div className="mt-8 p-4 bg-secondary rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-secondary-foreground">
            Tailwind Test
          </h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-8 bg-primary rounded"></div>
            <div className="h-8 bg-secondary rounded"></div>
            <div className="h-8 bg-accent rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
