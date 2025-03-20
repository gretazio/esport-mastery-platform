
import { useRef, useEffect, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
  threshold?: number;
}

const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 700,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Initial state - hidden
    node.style.opacity = "0";
    node.style.transform = getInitialTransform(direction);
    node.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    node.style.transitionDelay = `${delay}ms`;
    node.style.willChange = "opacity, transform";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reveal
          node.style.opacity = "1";
          node.style.transform = "translateY(0) translateX(0)";
          
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          // Hide again if not once
          node.style.opacity = "0";
          node.style.transform = getInitialTransform(direction);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [delay, direction, duration, once, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

// Helper function to get initial transform based on direction
const getInitialTransform = (direction: string): string => {
  switch (direction) {
    case "up":
      return "translateY(40px) translateX(0)";
    case "down":
      return "translateY(-40px) translateX(0)";
    case "left":
      return "translateY(0) translateX(40px)";
    case "right":
      return "translateY(0) translateX(-40px)";
    case "none":
    default:
      return "translateY(0) translateX(0)";
  }
};

export default ScrollReveal;
