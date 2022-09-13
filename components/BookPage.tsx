import { TILT_ANGLE } from "@/constants/bookpage";
import { PLACEHOLDER_URL } from "@/constants/placeholder";
import { ImageSource } from "@/interfaces/assets";
import { Dispatch, ReactNode, SetStateAction } from "react";
import Image from "next/image";

type BookPageProps = {
  page: number;
  pageId: number;
  lastPage: number;
  setControlEnabled: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

export default function BookPage({
  page,
  pageId,
  lastPage,
  setControlEnabled,
  children,
}: BookPageProps) {
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

      {children}
    </div>
  );
}
