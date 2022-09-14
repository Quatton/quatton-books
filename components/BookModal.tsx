import { ArticleTypeName } from "@/interfaces/article";
import Assets, { Images } from "@/interfaces/assets";
import { MultilingualText } from "@/interfaces/text";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/outline";
import _ from "lodash";
import { useState, useEffect, useContext } from "react";
import { EventContext } from "@/utils/Event";
import { usePageControl } from "@/utils/BookModalHooks";
import ImageArticle from "./Articles/ImageArticle";
import { TILT_ANGLE } from "@/constants/bookpage";
import { useRouter } from "next/router";

type Props = {
  collectionId: string;
  id: string;
  title: MultilingualText;
  type: ArticleTypeName;
  assets?: Assets;
};

export default function BookModal({
  collectionId,
  id: articleId,
  title,
  type,
  assets,
}: Props) {
  const router = useRouter();

  const backToCollection = () => {
    setTimeout(() => router.push(`/${(collectionId as string) || `/`}`), 1000);
  };

  const [images, setImages] = useState<Images>(
    assets?.images ? assets.images : {}
  );

  const PAGE_NUM = Object.keys(images).length;
  const lastPage = PAGE_NUM - 1;

  const [controlEnabled, setControlEnabled] = useState(true);

  const {
    page,
    next,
    prev,
    flipNext,
    flipPrev,
    exit,
    isNextAvailable,
    isPrevAvailable,
    isDoublePageView,
  } = usePageControl(lastPage, backToCollection);

  const nextPage = isNextAvailable
    ? isDoublePageView
      ? flipNext
      : next
    : () => {};
  const prevPage = isPrevAvailable
    ? isDoublePageView
      ? flipPrev
      : prev
    : () => {};
  const exitPage = () => {
    exit();
  };
  const emitter = useContext(EventContext);

  useEffect(() => {
    emitter.addListener("exit", exitPage);
    if (assets) {
      setImages(assets.images);
    }

    return () => {
      emitter.removeListener("exit", exitPage);
    };
  }, [page]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        className={`book-container 
        ${
          isDoublePageView ||
          (page % 2 === 1
            ? "translate-x-36 sm:translate-x-48"
            : "-translate-x-36 sm:-translate-x-48")
        }
          `}
        style={{
          perspective: "800px",
        }}
      >
        <div
          className={`book-container
          ${
            isDoublePageView &&
            page === 0 &&
            "-translate-x-36 sm:-translate-x-48"
          }`}
          onAnimationStart={() => setControlEnabled(false)}
          onAnimationEnd={() => setControlEnabled(true)}
        >
          {(() => {
            switch (type) {
              case "server":
                return (
                  <ImageArticle
                    {...{
                      images,
                      page,
                      lastPage,
                      isDoublePageView,
                      setControlEnabled,
                    }}
                  />
                );
            }
          })()}
        </div>

        <span
          className={`page-nav bg-gradient-to-r 
          ${
            !isDoublePageView && page % 2 === 0
              ? "-translate-x-12 left-1/2"
              : "right-full"
          }
          `}
          style={{ zIndex: 51 + lastPage, rotate: `x ${TILT_ANGLE}deg` }}
          onClick={() => {
            if (controlEnabled) {
              (isPrevAvailable === true ? prevPage : exitPage)();
              setControlEnabled(false);
            }
          }}
        >
          <p className={`page-nav-button`}>
            {isPrevAvailable === false ? (
              <HomeIcon className="w-6 h-6" />
            ) : (
              <ChevronLeftIcon className="w-6 h-6" />
            )}
          </p>
        </span>
        <span
          className={`page-nav bg-gradient-to-l
          ${
            !isDoublePageView && page % 2 === 1
              ? "translate-x-12 right-1/2"
              : "left-full"
          }`}
          style={{ zIndex: 51 + lastPage, rotate: `x ${TILT_ANGLE}deg` }}
          onClick={() => {
            if (controlEnabled) {
              (isNextAvailable === true ? nextPage : exitPage)();
              setControlEnabled(false);
            }
          }}
        >
          <p className={`page-nav-button`}>
            {isNextAvailable === false ? (
              <HomeIcon className="w-6 h-6" />
            ) : (
              <ChevronRightIcon className="w-6 h-6" />
            )}
          </p>
        </span>
      </div>
    </div>
  );
}
