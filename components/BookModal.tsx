import _ from "lodash";
import { useRouter } from "next/router";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { setInterval } from "timers";

const PAGE_NUM = 10;
const TILT_ANGLE = 5;

export default function BookModal({}: Props) {
  const router = useRouter();

  const shallowPush = () => {
    router.push(pathname, pathname, { shallow: true });
  };

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

  const exit = () => {
    if (controlEnabled) {
      const closePageStaggeringTimer = setInterval(() => {
        prev();
        if (page === 0) {
          exit();
          clearInterval(closePageStaggeringTimer);
        }
      }, Math.floor(2000 / page));
    }
  };

  const { query, pathname } = router;
  if (typeof query.a !== "string") {
    shallowPush();
    return null;
  }

  const articleId = query.a;
  const article = getArticleFromId(articleId);
  if (!article) {
    shallowPush();
    return;
  }

  const lastPage = images.length;
  const [page, setPage] = useState(0);
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

  return (
    <>
      <span
        className="
          absolute w-full h-full"
        onClick={exit}
      ></span>
      <div
        className={`
          aspect-[2/1] h-96 relative
          flex flex-row items-center cursor-default
          justify-items-center transition-all 
          ease-in-out duration-1000 preserve-3d
          ${
            isDoublePageView || page % 2 === 1
              ? "translate-x-48"
              : "-translate-x-48"
          }`}
        style={{
          perspective: "800px",
          rotate: `x ${TILT_ANGLE}deg`,
        }}
        onAnimationStart={() => setControlEnabled(false)}
        onAnimationEnd={() => setControlEnabled(true)}
      >
        {_.range(PAGE_NUM).map((pageId) => (
          <BookPage
            key={pageId}
            {...{
              pageId,
              page,
              lastPage,
              setControlEnabled,
              image: images[pageId],
            }}
          />
        ))}

        <span
          className={`page-nav bg-gradient-to-l preserve-3d
          ${!isDoublePageView && page % 2 === 0 ? "left-1/2" : "left-0"}
          ${isPrevAvailable ? "cursor-pointer hover:to-amber-100" : ""}
          `}
          style={{ zIndex: 51 + lastPage, rotate: `x ${TILT_ANGLE}deg` }}
          onClick={prev}
        >
          <p
            className={`-rotate-90 text-black text-sm font-light 
            transition-all duration-200 select-none
            ${isPrevAvailable ? "opacity-100" : "opacity-50"}`}
          >
            PREV
          </p>
        </span>
        <span
          className={`page-nav bg-gradient-to-r preserve-3d
          ${!isDoublePageView && page % 2 === 1 ? "right-1/2" : "right-0"}
          ${isNextAvailable ? "cursor-pointer hover:to-amber-100" : ""}
          `}
          style={{ zIndex: 51 + lastPage, rotate: `x ${TILT_ANGLE}deg` }}
          onClick={next}
        >
          <p
            className={`rotate-90 text-black text-sm font-light 
            transition-all duration-200 select-none
            ${isNextAvailable ? "opacity-100" : "opacity-50"}`}
          >
            NEXT
          </p>
        </span>
      </div>
    </>
  );
}

type BookPageProps = {
  page: number;
  pageId: number;
  lastPage: number;
  setControlEnabled: Dispatch<SetStateAction<boolean>>;
  image: ImageSrc;
};

const BookPage = ({
  page,
  pageId,
  lastPage,
  setControlEnabled,
  image,
}: BookPageProps) => {
  // simple rule:
  // 1. pageId is even then it's on the front
  const isFront = pageId % 2 === 0;

  // 2. page on the even side is an even number or odd - 1
  const frontPageId = pageId - (pageId % 2);

  // 3. we turn page if page > page on the right
  const isPageExceeded = page > frontPageId;

  // 4. isPageExceeded && isFront => 180
  // -. !isPageExceeded && isFront => 0
  // -. isPageExceeded && !isFront => 0
  // -. !isPageExceeded && !isFront => -180
  const isPageFlipped = isPageExceeded == isFront;

  // 0 1 2 3 4 5 3 2 1 0
  const zIndexIncrement =
    -Math.abs(page - pageId) + page + (pageId > page ? -1 : 0);

  const zIndex = 50 + lastPage + zIndexIncrement;
  const rotateY = isPageFlipped ? 180 * (isFront ? -1 : 1) : 0;
  const translateZ =
    (isPageFlipped ? -1 : 1) * (zIndexIncrement - page - 1) * 1;

  return (
    <div
      className={`${isFront ? "right-0 origin-left" : "left-0 origin-right"}
        book-card rotate`}
      style={{
        zIndex,
        perspective: "800px",
      }}
      onTransitionEnd={() => setControlEnabled(true)}
    >
      <style jsx>
        {`
          .rotate {
            transform: rotateX(${TILT_ANGLE}deg) rotateY(${rotateY}deg)
              translateZ(${translateZ}px);
          }
        `}
      </style>
    </div>
  );
};
