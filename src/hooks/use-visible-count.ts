"use client";

import { useState, useEffect } from "react";

/**
 * Responsive visible card count: mobile 1, then 2, 3, 5 on larger screens.
 */
export function useVisibleCount(): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCount(1);
      else if (w < 768) setCount(2);
      else if (w < 1024) setCount(3);
      else setCount(5);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}
