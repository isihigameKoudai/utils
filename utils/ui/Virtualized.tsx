/**
 * wip
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

type VirtualizedProps<T> = {
  list: readonly T[];
  children: (item: T, index: number) => React.ReactNode;
};

// リストの高さを測定する純粋な非同期関数
const measureListHeights = async <T,>(
  list: readonly T[],
  renderItem: (item: T, index: number) => React.ReactNode,
  width: number = 200
): Promise<{ heights: number[] }> => {
  return new Promise((resolve) => {
    const measureElement = document.createElement('div');
    measureElement.style.position = 'fixed';
    measureElement.style.width = `${width}px`;
    measureElement.style.visibility = 'hidden';
    document.body.appendChild(measureElement);

    const root = createRoot(measureElement);
    root.render(
      <>
        {list.map((item, i) => (
          <div key={i} data-measure-index={i}>
            {renderItem(item, i)}
          </div>
        ))}
      </>
    );

    // レンダリング完了後に高さを測定
    setTimeout(() => {
      const elements = measureElement.querySelectorAll('[data-measure-index]');
      const heights = Array.from(elements).map(el => el.getBoundingClientRect().height);
      const totalHeight = heights.reduce((sum, height) => sum + height, 0);
      console.log( heights,totalHeight);

      // クリーンアップ
      root.unmount();
      document.body.removeChild(measureElement);

      resolve({ heights });
    }, 0);
  });
};

export const Virtualized = <T extends unknown>({ 
  list,
  children 
}: VirtualizedProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null!);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [totalHeight, setTotalHeight] = useState(0);

  const updateVisibility = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const index = Number(entry.target.getAttribute('data-list-index'));
      setVisibleIndices(prev => {
        const next = new Set(prev);
        if (entry.isIntersecting) {
          next.add(index);
        } else {
          next.delete(index);
        }
        return next;
      });
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    // 初期表示時の可視要素を計算
    const calculateInitialVisibleItems = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const placeholders = container.querySelectorAll('[data-list-index]');
      
      placeholders.forEach(placeholder => {
        const rect = placeholder.getBoundingClientRect();
        if (rect.top < containerRect.bottom && rect.bottom > containerRect.top) {
          const index = Number(placeholder.getAttribute('data-list-index'));
          setVisibleIndices(prev => new Set(prev).add(index));
        }
      });
      
      setIsInitialized(true);
    };

    observerRef.current = new IntersectionObserver(updateVisibility, {
      root: containerRef.current,
      rootMargin: '100px 0px',
      threshold: 0
    });

    // 初期表示時の可視要素を計算
    calculateInitialVisibleItems();

    return () => {
      observerRef.current?.disconnect();
    };
  }, [updateVisibility]);

  const dummyBackgroundRef = useRef<HTMLDivElement>(null!);
  const heightsRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    let isMounted = true;

    const initializeMeasurements = async () => {
      const { heights } = await measureListHeights(list, children);
      if (!isMounted || heights.length === 0) return;

      console.log(heights, totalHeight);

      setItemHeights(heights);
      setTotalHeight(totalHeight);
      if (dummyBackgroundRef.current) {
        dummyBackgroundRef.current.style.height = `${totalHeight}px`;
      }
    };

    initializeMeasurements();

    return () => {
      isMounted = false;
    };
  }, [list, children]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: 200,
        height: 500,
        overflowY: 'scroll',
        position: 'relative'
      }}
    >
      <div
        ref={dummyBackgroundRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          // height: totalHeight,
          visibility: 'hidden',
          pointerEvents: 'none'
      }} />
      {list.map((item, i) => (
        <div
          key={i}
          data-list-index={i}
          ref={el => {
            if (el && isInitialized) {
              // const listHeight = el.getBoundingClientRect().height;
              // heightsRef.current.set(i, listHeight);
              // console.log(i, 'map : ', heightsRef.current.get(i));
              observerRef.current?.observe(el);
            }
          }}
          style={{ 
            height: itemHeights[i] || 'auto',
            boxSizing: 'border-box'
          }}
        >
          {visibleIndices.has(i) ? children(item, i) : null}
        </div>
      ))}
    </div>
  );
};

export default Virtualized;
