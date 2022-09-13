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
  const exit = () => {
    switch (pageRef.current) {
      case 0:
        afterExit();
        break;
      default:
        flipPrev();
        setTimeout(() => exit(), 200);
    }
  };
  const page = state.page;
  const pageRef = useRef(page);

  const [isDoublePageView, setIsDoublePageView] = useState(
    () => innerWidth > 864
  );

  const PAGE_NUM = lastPage + 1;
  const isNextAvailable =
    (isDoublePageView && page + 2 <= PAGE_NUM + (PAGE_NUM % 2)) ||
    page + 1 < PAGE_NUM;
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
