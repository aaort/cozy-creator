import { useEffect, useState } from "react";

/**
 * Custom hook to get the width of a container element
 * @param ref React ref to the container element
 * @returns The width of the container element
 */
export function useContainerWidth(
  ref: React.RefObject<HTMLElement | HTMLDivElement | null>,
): number | null {
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Define updateWidth inside the effect to avoid dependency issues
    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.getBoundingClientRect().width);
      }
    };

    // Set initial width
    updateWidth();

    // Update width on window resize
    window.addEventListener("resize", updateWidth);

    // Create a ResizeObserver to detect changes in the container size
    const resizeObserver = new ResizeObserver(updateWidth);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Clean up
    return () => {
      window.removeEventListener("resize", updateWidth);
      resizeObserver.disconnect();
    };
  }, [ref]);

  return width;
}
