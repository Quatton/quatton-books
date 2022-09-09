import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { getImageUrl } from "./db";

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

/**
 * Load image on the path:
 * collectionId/articleId/articleId-pageId.png
 *
 * Image display: 'none' while loading
 * onLoadingComplete => setLoading(true)
 * */
export const useLoadImage = (
  collectionId: string,
  articleId: string,
  pageId: number
): [string, boolean, Dispatch<SetStateAction<boolean>>] => {
  const [url, setUrl] = useState("");
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    getImageUrl(collectionId, articleId, pageId)
      .then((url) => {
        setUrl(url);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            setUrl("");
        }
      });
  }, []);

  return [url, isLoading, setLoading];
};
