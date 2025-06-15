import { useCallback, useState } from "react";
import type { GridItem } from "../virtualized-grid";

interface UseVideosOptions {
  initialItemCount?: number;
  itemsPerPage?: number;
  baseVideoUrl?: string;
  initialVideos?: GridItem[];
}

export function useVideos({
  initialItemCount = 10,
  itemsPerPage = 10,
  baseVideoUrl = "",
  initialVideos = [],
}: UseVideosOptions = {}) {
  const [videos, setVideos] = useState<GridItem[]>(initialVideos);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // This would normally fetch from an API
  // For demo purposes, we're generating random videos
  const fetchMoreVideos = useCallback(
    async (count: number) => {
      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, limit to 100 videos total
      if (videos.length >= 100) {
        return [];
      }

      // Generate new videos
      return Array.from({ length: count }).map((_, index) => {
        const id = `video-${videos.length + index + 1}`;
        const randomWidth = Math.floor(Math.random() * 800) + 400;
        const randomHeight = Math.floor(Math.random() * 800) + 400;

        return {
          id,
          type: "video" as const,
          url: `${baseVideoUrl || ""}${id}.mp4`,
          width: randomWidth,
          height: randomHeight,
          title: `Video ${videos.length + index + 1}`,
          subtitle: "Click to view full size",
          aspectRatio: 16 / 9, // Videos typically have 16:9 aspect ratio
        };
      });
    },
    [videos.length, baseVideoUrl],
  );

  const loadInitialVideos = useCallback(async () => {
    if (initialVideos.length > 0) {
      setVideos(initialVideos);
      return;
    }

    setIsNextPageLoading(true);
    const newVideos = await fetchMoreVideos(initialItemCount);
    setVideos(newVideos);
    setIsNextPageLoading(false);
    setHasNextPage(newVideos.length >= initialItemCount);
  }, [fetchMoreVideos, initialItemCount, initialVideos]);

  const loadNextPage = useCallback(async () => {
    if (isNextPageLoading || !hasNextPage) return;

    setIsNextPageLoading(true);
    const newVideos = await fetchMoreVideos(itemsPerPage);

    setVideos((prevVideos) => [...prevVideos, ...newVideos]);
    setCurrentPage((prevPage) => prevPage + 1);
    setIsNextPageLoading(false);

    // If we got fewer items than requested, we've reached the end
    if (newVideos.length < itemsPerPage) {
      setHasNextPage(false);
    }
  }, [fetchMoreVideos, hasNextPage, isNextPageLoading, itemsPerPage]);

  return {
    videos,
    hasNextPage,
    isNextPageLoading,
    loadNextPage,
    loadInitialVideos,
    currentPage,
  };
}
