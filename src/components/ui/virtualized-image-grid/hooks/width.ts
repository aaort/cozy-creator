import { useEffect, useState } from "react";

// Hook to get container width
export const useContainerWidth = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return containerWidth;
};
