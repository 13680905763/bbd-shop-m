import { useEffect } from "react";

export function useVisualViewport() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let rafId: number;

    const updateHeight = () => {
      // Cancel any pending frame to avoid stacking updates
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        // Use CSS variable to avoid re-renders
        document.documentElement.style.setProperty("--visual-viewport-height", `${height}px`);
      });
    };

    updateHeight();

    if (window.visualViewport) {
      // Only listen to resize, scroll is too frequent and not necessary for height changes
      window.visualViewport.addEventListener("resize", updateHeight);
    } else {
      window.addEventListener("resize", updateHeight);
    }

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateHeight);
      } else {
        window.removeEventListener("resize", updateHeight);
      }
    };
  }, []);
}
