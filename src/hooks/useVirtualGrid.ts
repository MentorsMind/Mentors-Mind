import { useRef, useState, useEffect, useCallback } from 'react';

interface UseVirtualGridOptions {
  itemCount: number;
  defaultColumns?: number;
  buffer?: number;
}

export function useVirtualGrid({
  itemCount,
  defaultColumns = 3,
  buffer = 2,
}: UseVirtualGridOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeightRef = useRef<number>(0);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const [columns, setColumns] = useState(defaultColumns);

  const getRowCount = useCallback(() => {
    if (itemCount === 0) return 0;
    return Math.ceil(itemCount / columns);
  }, [itemCount, columns]);

  const calculateColumns = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1024) return 3; // lg:3
    if (width >= 768) return 2;  // md:2
    return 1; // mobile:1
  }, []);

  const updateVisibleItems = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const viewportHeight = window.innerHeight;
    const { top: containerTop } = container.getBoundingClientRect();

    const bufferHeight = buffer * viewportHeight;
    const viewportTop = -bufferHeight;
    const viewportBottom = viewportHeight + bufferHeight;

    const rowHeight = itemHeightRef.current || 300;

    const startRow = Math.max(0, Math.floor((viewportTop - containerTop) / rowHeight));
    const endRow = Math.min(getRowCount(), Math.ceil((viewportBottom - containerTop) / rowHeight) + 1);

    const newVisibleIndices = new Set<number>();
    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col;
        if (index < itemCount) {
          newVisibleIndices.add(index);
        }
      }
    }

    setVisibleIndices(newVisibleIndices);
  }, [buffer, columns, getRowCount, itemCount]);

  const measureItem = useCallback((index: number, height: number) => {
    if (height > itemHeightRef.current) {
      itemHeightRef.current = height;
    }
  }, []);

  const resetToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateVisibleItems();
  }, [updateVisibleItems]);

  useEffect(() => {
    const handleResize = () => {
      setColumns(calculateColumns());
    };

    const handleScroll = () => {
      updateVisibleItems();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    setColumns(calculateColumns());
    updateVisibleItems();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [calculateColumns, updateVisibleItems]);

  useEffect(() => {
    resetToTop();
  }, [itemCount]);

  const totalHeight = getRowCount() * (itemHeightRef.current || 300);

  return {
    containerRef,
    visibleIndices,
    measureItem,
    resetToTop,
    totalHeight,
  };
}
