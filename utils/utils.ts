import { useCallback, useEffect, useState } from "react";

export const useMediaQuery = (width: string) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) setTargetReached(true);
    else setTargetReached(false);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addEventListener("change", updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) setTargetReached(true);

    return () => media.removeEventListener("change", updateTarget);
  }, []);

  return targetReached;
};

export const useRandomColor = (): string => {
  const [color, setColor] = useState("");

  useEffect(() => {
    setColor("#" + Math.floor(Math.random() * 16777215).toString(16));
  }, []);

  return color;
};
