import { HEADER_HEIGHT } from "@constants/layout";
import { useEffect, useState } from "react";

// Hook to calculate available height for the grid
export const useAvailableHeight = () => {
  const [availableHeight, setAvailableHeight] = useState(600);

  useEffect(() => {
    const calculateHeight = () => {
      // Get window height
      const windowHeight = window.innerHeight;

      console.log("windowHeight", windowHeight);

      // Calculate available height by subtracting fixed header and footer heights
      const calculatedHeight = Math.max(400, windowHeight);

      console.log("calculatedHeight", calculatedHeight);
      setAvailableHeight(calculatedHeight);
    };

    // Initial calculation
    calculateHeight();

    // Recalculate on resize
    window.addEventListener("resize", calculateHeight);

    // Also recalculate after a short delay to ensure DOM is ready
    const timer = setTimeout(calculateHeight, 100);

    return () => {
      window.removeEventListener("resize", calculateHeight);
      clearTimeout(timer);
    };
  }, []);

  return availableHeight;
};

export function useScrollOffset(
  initialOffset: number = HEADER_HEIGHT,
): [number, (scrollTop: number) => void] {
  const [offset, setOffset] = useState<number>(initialOffset);

  const updateOffset = (scrollTop: number) => {
    setOffset(Math.max(initialOffset - scrollTop, 0));
  };

  return [offset, updateOffset];
}
