import { HEADER_HEIGHT } from "@/constants/layout";
import { useEffect, useState } from "react";

// Hook to calculate available height for the grid
export const useAvailableHeight = () => {
  const [availableHeight, setAvailableHeight] = useState(600);

  useEffect(() => {
    const calculateHeight = () => {
      // Get window height
      const windowHeight = window.innerHeight;

      // Calculate available height by subtracting fixed header and footer heights
      const calculatedHeight = Math.max(400, windowHeight - HEADER_HEIGHT);

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
