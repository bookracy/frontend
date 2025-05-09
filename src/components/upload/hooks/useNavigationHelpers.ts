import { useState, useEffect } from "react";

interface NavigationState {
  currentItemIndex: number | null;
  hasPrevious: boolean;
  hasNext: boolean;
  goToNextUnfilled: () => void;
  goToPrevUnfilled: () => void;
}

export function useNavigationHelpers<T>(items: T[], isItemUnfilledFn: (item: T) => boolean): NavigationState {
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);

  // Initialize the current item index when items are loaded
  useEffect(() => {
    if (items.length > 0 && currentItemIndex === null) {
      // Find the first unfilled item
      const firstUnfilledIndex = items.findIndex(isItemUnfilledFn);
      if (firstUnfilledIndex !== -1) {
        setCurrentItemIndex(firstUnfilledIndex);
      } else {
        setCurrentItemIndex(0);
      }
    } else if (items.length === 0) {
      setCurrentItemIndex(null);
    }
  }, [items, currentItemIndex, isItemUnfilledFn]);

  // Check if there's a previous unfilled item
  const hasPreviousUnfilled = (): boolean => {
    if (items.length === 0) return false;

    const startIndex = currentItemIndex !== null ? currentItemIndex - 1 : items.length - 1;

    // Check from current position to beginning
    for (let i = startIndex; i >= 0; i--) {
      if (isItemUnfilledFn(items[i])) {
        return true;
      }
    }

    // If not found above, check from end to current
    if (startIndex < items.length - 1) {
      for (let i = items.length - 1; i > startIndex; i--) {
        if (isItemUnfilledFn(items[i])) {
          return true;
        }
      }
    }

    return false;
  };

  // Check if there's a next unfilled item
  const hasNextUnfilled = (): boolean => {
    if (items.length === 0) return false;

    const startIndex = currentItemIndex !== null ? currentItemIndex + 1 : 0;

    // Check from current position to end
    for (let i = startIndex; i < items.length; i++) {
      if (isItemUnfilledFn(items[i])) {
        return true;
      }
    }

    // If not found and we started from a position other than 0, check from beginning to current
    if (startIndex > 0) {
      for (let i = 0; i < startIndex; i++) {
        if (isItemUnfilledFn(items[i])) {
          return true;
        }
      }
    }

    return false;
  };

  // Navigate to the next unfilled item
  const goToNextUnfilled = () => {
    if (items.length === 0) return;

    const startIndex = currentItemIndex !== null ? currentItemIndex + 1 : 0;

    // Check from current position to end
    for (let i = startIndex; i < items.length; i++) {
      if (isItemUnfilledFn(items[i])) {
        setCurrentItemIndex(i);
        document.getElementById(`bulk-item-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    // If not found and we started from a position other than 0, check from beginning to current
    if (startIndex > 0) {
      for (let i = 0; i < startIndex; i++) {
        if (isItemUnfilledFn(items[i])) {
          setCurrentItemIndex(i);
          document.getElementById(`bulk-item-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
    }
  };

  // Navigate to the previous unfilled item
  const goToPrevUnfilled = () => {
    if (items.length === 0) return;

    const startIndex = currentItemIndex !== null ? currentItemIndex - 1 : items.length - 1;

    // Check from current position to beginning
    for (let i = startIndex; i >= 0; i--) {
      if (isItemUnfilledFn(items[i])) {
        setCurrentItemIndex(i);
        document.getElementById(`bulk-item-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    // If not found and we started from a position other than the end, check from end to current
    if (startIndex < items.length - 1) {
      for (let i = items.length - 1; i > startIndex; i--) {
        if (isItemUnfilledFn(items[i])) {
          setCurrentItemIndex(i);
          document.getElementById(`bulk-item-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
    }
  };

  return {
    currentItemIndex,
    hasPrevious: hasPreviousUnfilled(),
    hasNext: hasNextUnfilled(),
    goToNextUnfilled,
    goToPrevUnfilled,
  };
}
