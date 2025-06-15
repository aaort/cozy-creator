import { useMediaQuery } from "./media-query";

/**
 * Hook to provide responsive gap values based on screen size
 * @param baseGap Optional base gap value (default: 16)
 * @returns Responsive gap value
 */
export function useResponsiveGap(baseGap: number = 16): number {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");

  // Responsive gap values
  if (isLg) {
    return Math.max(baseGap * 2, 32); // Large screens: 32px minimum
  } else if (isMd) {
    return Math.max(baseGap * 1.5, 24); // Medium screens: 24px minimum
  } else if (isSm) {
    return Math.max(baseGap * 1.25, 20); // Small screens: 20px minimum
  } else {
    return baseGap; // Mobile: use base gap (16px)
  }
}
