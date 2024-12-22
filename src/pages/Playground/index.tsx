import React, { useState, useRef, useEffect, useCallback } from 'react';

type VirtualizedProps<T> = {
  list: readonly T[];
  children: (item: T, index: number) => React.ReactNode;
};

export const Virtualized = <T extends unknown>({ 
  list,
  children 
}: VirtualizedProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

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

  return (
    <div 
      ref={containerRef}
      style={{
        width: 200,
        height: 500,
        overflowY: 'scroll',
      }}
    >
      {list.map((item, i) => {
        const height = itemHeights[i] || 100; // デフォルトの高さを設定
        
        return (
          <div
            key={i}
            data-list-index={i}
            ref={el => {
              if (el && isInitialized) {
                observerRef.current?.observe(el);
              }
            }}
            style={{ 
              height,
              boxSizing: 'border-box'
            }}
          >
            {visibleIndices.has(i) ? children(item, i) : null}
          </div>
        );
      })}
    </div>
  );
};

const ListItem = ({ height, num }: { height: number, num: number }) => {
  useEffect(() => {
    console.log('mount', num);
    return () => {
      console.log('unmount', num);
    }
  }, [num]);
  return (
    <div style={{ height, padding: '8px', borderBottom: '1px solid #eee' }}>
      item {num}
    </div>
  )
}

const PlaygroundPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const customItems = [...Array(100)].map((_, i) => ({
    id: i,
    name: `Item ${i}`,
    height: Math.floor(Math.random() * 100) + 100
  }));

  return (
    <div>
      <button onClick={() => setOpen(!open)}>open</button>
      {
        open && (
          <Virtualized list={customItems}>
            {(item, i) => {
              console.log(i);
              return (
                <ListItem height={item.height} num={i} />
              )
            }}
          </Virtualized>
        )
      }
    </div>
  );
};

export default PlaygroundPage;
