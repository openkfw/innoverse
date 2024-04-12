import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';

import { ShowLessButton } from './ShowLessButton';
import { ShowMoreButton } from './ShowMoreButton';

interface ExapandableContainerProps {
  collapsedHeight: number;
  content: ReactNode;
  maxExpandedHeight?: CSSProperties['maxHeight'];
  scrollWhenExpanded?: boolean;
  showExpandButton?: boolean;
  showCollapseButton?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  styling?: {
    backgroundColor: CSSProperties['backgroundColor'];
  };
}

export function useExpandableContainer({
  collapsedHeight,
  maxExpandedHeight,
  scrollWhenExpanded = true,
  showCollapseButton = true,
  showExpandButton = true,
  onExpand,
  onCollapse,
  content,
  styling,
}: ExapandableContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const [offsetHeight, setOffsetHeight] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const isOverflowing = scrollHeight > collapsedHeight && scrollHeight > offsetHeight;
  const isExpandable = isOverflowing && !isExpanded;

  // TODO: Consider using CSS instead of the resize observer
  useEffect(function subscribeToContainerHeightChanges() {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    const observer = new ResizeObserver((entries) => {
      if (entries.length < 1) return;
      const container = entries[0].target as HTMLDivElement;
      setOffsetHeight(container.offsetHeight);
      setScrollHeight(container.scrollHeight);
    });

    observer.observe(containerElement);

    return () => observer.unobserve(containerElement);
  }, []);

  useEffect(function scrollToTopOnCollapse() {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    if (scrollTop > 0 && !isExpanded) {
      containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  });

  const expand = () => {
    if (isExpandable) {
      onExpand && onExpand();
      setIsExpanded(true);
    }
  };

  const collapse = () => {
    if (isExpanded) {
      onCollapse && onCollapse();
      setIsExpanded(false);
    }
  };

  return {
    expand,
    collapse,
    isOverflowing,
    element: (
      <Box
        ref={containerRef}
        sx={{
          maxHeight: isExpanded ? maxExpandedHeight ?? 'auto' : collapsedHeight,
          overflowY: isExpanded ? (scrollWhenExpanded ? 'scroll' : 'visible') : 'hidden',
          scrollBehavior: 'smooth',
          position: 'relative',
          pb: 0,
          backgroundColor: styling?.backgroundColor,
        }}
      >
        {content}
        {showExpandButton && (
          <ShowMoreButton
            isVisible={isExpandable}
            top={offsetHeight}
            onClick={expand}
            backgroundColor={styling?.backgroundColor}
          />
        )}
        {showCollapseButton && <ShowLessButton isVisible={isExpanded} onClick={collapse} />}
      </Box>
    ),
  };
}
