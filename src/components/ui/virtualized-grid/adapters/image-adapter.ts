import type { ImageData } from "@/components/ui/virtualized-image-grid/hooks/images";
import type { GridItem } from "../virtualized-grid";

/**
 * Converts ImageData objects to GridItem format
 * @param image The ImageData object to convert
 * @param index Optional index to use for generating an ID if not present
 * @returns A GridItem representation of the image
 */
export function imageToGridItem(
  image: ImageData,
  index?: number,
): GridItem {
  return {
    id: `image-${index ?? Math.random().toString(36).substring(2, 9)}`,
    url: image.url,
    type: "image",
    // You can extract additional metadata from image.meta if needed
    title: image.meta?.model ? `Model: ${image.meta.model}` : undefined,
    subtitle: "Click to view full size",
    // Default to square aspect ratio if not specified
    aspectRatio: 1,
  };
}

/**
 * Batch converts an array of ImageData objects to GridItem format
 * @param images Array of ImageData objects to convert
 * @returns Array of GridItem objects
 */
export function imagesToGridItems(images: ImageData[]): GridItem[] {
  return images.map((image, index) => imageToGridItem(image, index));
}
