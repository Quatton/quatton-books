import _ from "lodash";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

type Props = {};

export default function BookModal({}: Props) {
  const router = useRouter();
  const { query, pathname } = router;
  if (typeof query.c !== "string" && typeof query.a !== "string") return null;

  const collectionId = query.c;
  const articleId = query.a;

  const [page, setPage] = useState(0);

  const PAGE_NUM = 10;

  const [isDoublePageView, setIsDoublePageView] = useState(
    () => innerWidth > 864
  );

  const [controlEnabled, setControlEnabled] = useState(true);

  const isNextAvailable =
    ((isDoublePageView && page + 2 <= PAGE_NUM + (PAGE_NUM % 2)) ||
      page + 1 < PAGE_NUM) &&
    controlEnabled;
  const isPrevAvailable =
    ((isDoublePageView && page - 2 >= 0) || page - 1 >= 0) && controlEnabled;

  const prev = () => {
    if (isPrevAvailable) {
      setPage(page - (isDoublePageView ? 2 : 1));
      setControlEnabled(false);
    }
  };

  const next = () => {
    if (isNextAvailable) {
      setPage(page + (isDoublePageView ? 2 : 1));
      setControlEnabled(false);
    }
  };

  useEffect(() => {
    const resetCenter = () => {
      const willCenter = innerWidth > 864;
      setIsDoublePageView(willCenter);
      if (willCenter) setPage(page + (page % 2));
    };
    addEventListener("resize", resetCenter);
    return () => {
      removeEventListener("resize", resetCenter);
    };
  });
  const shallowPush = () => {
    if (controlEnabled) {
      setPage(0);
      setControlEnabled(false);
      setTimeout(() => {
        router.push(pathname, pathname, { shallow: true });
      }, 1200);
    }
  };
  return (
    <>
      {/* TODO: Move this to Backdrop component*/}
      <span
        className="
          absolute w-full h-full"
        onClick={shallowPush}
      ></span>
      <div
        className={`
          aspect-[2/1]
          h-96 relative flex flex-row items-center cursor-default
          justify-items-center transition-all ease-in-out duration-1000
          ${
            isDoublePageView ||
            (page % 2 === 1 ? "translate-x-48" : "-translate-x-48")
          }`}
        style={{
          perspective: "800px",
        }}
      >
        {_.range(PAGE_NUM).map((pageId) => (
          <BookPage
            key={pageId}
            {...{
              pageId,
              page,
              next,
              prev,
              setControlEnabled,
            }}
          />
        ))}

        {/* TODO: disable all control when turning page*/}
        <span
          className={`page-nav bg-gradient-to-l
          ${!isDoublePageView && page % 2 === 0 ? "left-1/2" : "left-0"}
          ${isPrevAvailable ? "cursor-pointer hover:to-amber-100" : ""}
          `}
          onClick={prev}
        >
          <p
            className="-rotate-90 text-black text-sm font-light"
            style={{ display: isPrevAvailable ? "block" : "none" }}
          >
            PREV
          </p>
        </span>
        <span
          className={`page-nav bg-gradient-to-r
          ${!isDoublePageView && page % 2 === 1 ? "right-1/2" : "right-0"}
          ${isNextAvailable ? "cursor-pointer hover:to-amber-100" : ""}
          `}
          onClick={next}
        >
          <p
            className="rotate-90 text-black text-sm font-light"
            style={{ display: isNextAvailable ? "block" : "none" }}
          >
            NEXT
          </p>
        </span>
      </div>
    </>
  );
}

const BookPage = ({ page, pageId, next, prev, setControlEnabled }: any) => {
  // simple rule:
  // 1. pageId is even then it's on the front
  const isFront = pageId % 2 === 0;

  // 2. page on the even side is an even number or odd - 1
  const evenPageId = pageId - (pageId % 2);

  // 3. we turn page if page > page on the right
  const isPageExceeded = page > evenPageId;

  // 4. isPageTurned => morePageId = high z
  // -. !isPageTurned => lessPageId = high z
  const zIndexIncrement = Math.sign(page - evenPageId) * evenPageId;

  // 5. isPageExceeded && isFront => 180
  // -. !isPageExceeded && isFront => 0
  // -. isPageExceeded && !isFront => 0
  // -. !isPageExceeded && !isFront => 180
  const isPageFlipped = isPageExceeded == isFront;

  return (
    <div
      className="
      book-card"
      style={{
        rotate: `y ${isPageFlipped ? 180 : 0}deg`,
        zIndex: `${(isPageFlipped ? 50 : 51) + zIndexIncrement}`,
        transform: isFront ? "" : "translateX(-24rem)",
        perspective: "800px",
      }}
      onTransitionEnd={() => setControlEnabled(true)}
    >
      <div className="flex flex-col">
        <h2>currentPage: {page}</h2>
        <h2>pageId: {pageId}</h2>
        <h2>rightPageId: {evenPageId}</h2>
        <h2>shouldBeTurned?: {isPageExceeded ? "true" : "false"}</h2>
        <h2>side: {isFront ? "front" : "back"}</h2>
      </div>
    </div>
  );
};
