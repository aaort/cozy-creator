import imageMetadata from "@/data/image_metadata.json";
import { useCallback, useMemo, useState } from "react";

export interface UseImagesParams {
  itemsPerPage: number;
  initialItemCount: number;
  baseImageUrl?: string; // Keep for backwards compatibility
}

export interface ImageMetadata {
  type: string;
  id: string;
  src: string;
  alt: string;
  title: string;
  width: number;
  height: number;
  aspectRatio: string;
}

export interface ImageData {
  url: string;
  meta: {
    model?: string;
    width: number;
    height: number;
    aspectRatio: number;
    alt?: string;
    title?: string;
  };
}

export function useImages(params: UseImagesParams) {
  const { itemsPerPage, initialItemCount } = params;

  const [images, setImages] = useState<ImageData[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get all images from metadata
  const allImages: ImageMetadata[] = imageMetadata.images;
  const totalImages = allImages.length;

  const loadNextPage = useCallback(async () => {
    if (isNextPageLoading || !hasNextPage) return;

    setIsNextPageLoading(true);

    // Small delay to simulate loading for a smoother UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Calculate the end index for this page
    const endIndex = Math.min(currentIndex + itemsPerPage, totalImages);

    // Get the next batch of images from the metadata
    const nextImages = allImages.slice(currentIndex, endIndex);

    // Convert to ImageData format
    const newImages: ImageData[] = nextImages.map((img) => ({
      url: img.src,
      meta: {
        width: img.width,
        height: img.height,
        aspectRatio:
          typeof img.aspectRatio === "string"
            ? parseFloat(img.aspectRatio)
            : img.width / img.height,
        alt: img.alt,
        title: img.title || img.id,
      },
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
    setCurrentIndex(endIndex);
    setIsNextPageLoading(false);

    // Check if we've reached the end of available images
    if (endIndex >= totalImages) {
      setHasNextPage(false);
    }
  }, [
    isNextPageLoading,
    currentIndex,
    itemsPerPage,
    totalImages,
    hasNextPage,
    allImages,
  ]);

  const loadInitialImages = useCallback(() => {
    // Get initial batch of images
    const initialCount = Math.min(initialItemCount, totalImages);
    const initialImages = allImages.slice(0, initialCount);

    // Convert to ImageData format
    const formattedImages: ImageData[] = initialImages.map((img) => ({
      url: img.src,
      meta: {
        width: img.width,
        height: img.height,
        aspectRatio:
          typeof img.aspectRatio === "string"
            ? parseFloat(img.aspectRatio)
            : img.width / img.height,
        alt: img.alt,
        title: img.title || img.id,
      },
    }));

    setImages(formattedImages);
    setCurrentIndex(initialCount);

    // If we've loaded all images in the initial load
    if (initialCount >= totalImages) {
      setHasNextPage(false);
    }
  }, [initialItemCount, totalImages, allImages]);

  const memoizedValues = useMemo(
    () => ({
      loadNextPage,
      loadInitialImages,
      images,
      isNextPageLoading,
      hasNextPage,
    }),
    [hasNextPage, images, isNextPageLoading, loadInitialImages, loadNextPage],
  );

  return memoizedValues;
}
