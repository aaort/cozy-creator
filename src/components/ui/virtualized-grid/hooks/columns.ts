import { useEffect, useState } from "react";
import { useMediaQuery } from "./media-query";

export function useResponsiveColumns(
  defaultColumns: Record<string, number> = {
    base: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
  },
): number {
  const [columns, setColumns] = useState(defaultColumns.base);

  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
    if (isXl) {
      setColumns(defaultColumns.xl);
    } else if (isLg) {
      setColumns(defaultColumns.lg);
    } else if (isMd) {
      setColumns(defaultColumns.md);
    } else if (isSm) {
      setColumns(defaultColumns.sm);
    } else {
      setColumns(defaultColumns.base);
    }
  }, [isSm, isMd, isLg, isXl, defaultColumns]);

  return columns;
}
