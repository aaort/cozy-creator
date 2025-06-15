import { IMAGE_HEIGHT, IMAGE_WIDTH, MAX_IMAGE_AMOUNT } from "@/constants/data";
import { getRandomModel } from "@/lib/get-random-model";
import { useCallback, useMemo, useState } from "react";

export interface UseImagesParams {
  itemsPerPage: number;
  baseImageUrl: string;
  initialItemCount: number;
}

export interface ImageData {
  url: string;
  meta: {
    model: string;
  };
}

export function useImages(params: UseImagesParams) {
  const { itemsPerPage, baseImageUrl, initialItemCount } = params;

  const [images, setImages] = useState<ImageData[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);

  const loadNextPage = useCallback(async () => {
    if (isNextPageLoading) return;

    setIsNextPageLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const currentLength = images.length;
    const newImages: ImageData[] = Array.from({ length: itemsPerPage }).map(
      (_, index) => ({
        url: `${baseImageUrl}${currentLength + index}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}.jpg`,
        meta: { model: getRandomModel() },
      }),
    );

    setImages((prevImages) => [...prevImages, ...newImages]);
    setIsNextPageLoading(false);

    // Simulate ending pagination after reaching max
    if (currentLength + itemsPerPage >= MAX_IMAGE_AMOUNT) {
      setHasNextPage(false);
    }
  }, [isNextPageLoading, images.length, itemsPerPage, baseImageUrl]);

  const loadInitialImages = useCallback(() => {
    const initialImages: ImageData[] = Array.from({
      length: initialItemCount,
    }).map((_, index) => ({
      url: `${baseImageUrl}${index}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}.jpg`,
      meta: { model: getRandomModel() },
    }));
    setImages(initialImages);
  }, [baseImageUrl, initialItemCount]);

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
