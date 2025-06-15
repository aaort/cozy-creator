import { HEADER_HEIGHT } from "@constants/layout";
import { useEffect, useState } from "react";

export function useAvailableHeight(
  offset: number = HEADER_HEIGHT,
  bottomPadding: number = 80,
): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    // Define updateHeight inside the effect to avoid dependency issues
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      setHeight(windowHeight - offset - bottomPadding);
    };

    // Set initial height
    updateHeight();

    // Update height on window resize
    window.addEventListener("resize", updateHeight);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [offset, bottomPadding]);

  return height;
}

export function useScrollOffset(
  initialOffset: number = HEADER_HEIGHT,
): [number, (scrollTop: number) => void] {
  const [offset, setOffset] = useState<number>(initialOffset);

  const updateOffset = (scrollTop: number) => {
    setOffset(Math.max(initialOffset - scrollTop, 0));
  };

  return [offset, updateOffset];
}
