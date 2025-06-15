import { useCallback, useState } from "react";
import type { GridItem } from "../virtualized-grid/virtualized-grid";

interface UseMediaModalReturn {
  isOpen: boolean;
  currentItem: GridItem | null;
  currentIndex: number;
  openModal: (item: GridItem, allItems: GridItem[]) => void;
  closeModal: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  items: GridItem[];
}

export function useMediaModal(): UseMediaModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<GridItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<GridItem[]>([]);

  const openModal = useCallback((item: GridItem, allItems: GridItem[]) => {
    setCurrentItem(item);
    setItems(allItems);
    setCurrentIndex(allItems.findIndex((i) => i.id === item.id));
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToNext = useCallback(() => {
    if (!items.length) return;

    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIndex);
    setCurrentItem(items[nextIndex]);
  }, [currentIndex, items]);

  const goToPrevious = useCallback(() => {
    if (!items.length) return;

    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(prevIndex);
    setCurrentItem(items[prevIndex]);
  }, [currentIndex, items]);

  return {
    isOpen,
    currentItem,
    currentIndex,
    openModal,
    closeModal,
    goToNext,
    goToPrevious,
    items,
  };
}
