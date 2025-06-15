import { useEffect, useState } from "react";

// Hook to detect current Tailwind breakpoint and return column count
export const useResponsiveColumns = () => {
  const [columns, setColumns] = useState(2);

  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia("(min-width: 1536px)").matches) {
        setColumns(4); // 2xl
      } else if (window.matchMedia("(min-width: 1280px)").matches) {
        setColumns(3); // xl
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setColumns(2); // lg/md/sm
      } else {
        setColumns(1); // default/xs
      }
    };

    // Set initial value
    updateColumns();

    // Create media query listeners for each breakpoint
    const mediaQueries = [
      window.matchMedia("(min-width: 1536px)"),
      window.matchMedia("(min-width: 1280px)"),
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(min-width: 768px)"),
      window.matchMedia("(min-width: 640px)"),
    ];

    mediaQueries.forEach((mq) => mq.addEventListener("change", updateColumns));

    return () => {
      mediaQueries.forEach((mq) =>
        mq.removeEventListener("change", updateColumns),
      );
    };
  }, []);

  return columns;
};
