import { useEffect, useReducer, useRef, useState } from "react";

export const usePageControl = (lastPage: number, afterExit: () => void) => {
  const [state, dispatch] = useReducer(
    (state: { page: number }, action: { type: string }): { page: number } => {
      switch (action.type) {
        case "next":
          return {
            page: state.page + 1 > lastPage ? lastPage : state.page + 1,
          };
        case "prev":
          return { page: state.page - 1 < 0 ? 0 : state.page - 1 };
        case "toDouble":
          return { page: state.page + (state.page % 2) };
        case "flipNext":
          return {
            page: state.page + 2 > lastPage ? lastPage : state.page + 2,
          };
        case "flipPrev":
          return { page: state.page - 2 < 0 ? 0 : state.page - 2 };
        default:
          throw new Error();
      }
    },
    { page: 0 }
  );

  const next = () => dispatch({ type: "next" });
  const prev = () => dispatch({ type: "prev" });
  const toDouble = () => dispatch({ type: "toDouble" });
  const flipNext = () => dispatch({ type: "flipNext" });
  const flipPrev = () => dispatch({ type: "flipPrev" });
  const exit = (page = state.page) => {
    switch (page) {
      case 0:
        afterExit();
        break;
      case 1:
        prev();
        page--;
        exit(page);
        break;
      default:
        flipPrev();
        setTimeout(() => {
          page -= 2;
          exit(page);
        }, 100);
    }
  };
  const { page } = state;

  const [isDoublePageView, setIsDoublePageView] = useState(
    () => innerWidth > 864
  );

  const isNextAvailable =
    (isDoublePageView && page + 2 <= lastPage + (lastPage % 2)) ||
    page + 1 <= lastPage;
  const isPrevAvailable = (isDoublePageView && page - 2 >= 0) || page - 1 >= 0;

  const resetCenter = () => {
    const willCenter = innerWidth > 864;
    setIsDoublePageView(willCenter);
    if (willCenter) toDouble();
  };

  useEffect(() => {
    addEventListener("resize", resetCenter);
    return () => {
      removeEventListener("resize", resetCenter);
    };
  }, [page]);

  return {
    page,
    next,
    prev,
    toDouble,
    flipNext,
    flipPrev,
    exit,
    isNextAvailable,
    isPrevAvailable,
    isDoublePageView,
  };
};
