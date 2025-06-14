import * as React from "react";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
  const [theme, setTheme] = React.useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    }
    return "light";
  });

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <Button
      className="h-9 w-9 p-2"
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
    >
      <div className="relative">
        <Moon className="h-4 w-4 transition-all duration-300 ease-in-out dark:rotate-90 dark:scale-0 dark:opacity-0" />
        <Sun className="absolute inset-0 h-4 w-4 transition-all duration-300 ease-in-out rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
