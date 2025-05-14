import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

export function useScrollAnimation({
  threshold = 0.1,
  root = null,
  rootMargin = "0px",
}: UseScrollAnimationProps = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once the element has been animated, we don't need to observe it anymore
          observer.unobserve(element);
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [root, rootMargin, threshold]);

  return { ref, isVisible };
}
