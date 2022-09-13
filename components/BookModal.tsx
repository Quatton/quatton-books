import { PLACEHOLDER_URL } from "@/constants/placeholder";
import { ArticleTypeName } from "@/interfaces/article";
import Assets, { Images, ImageSource } from "@/interfaces/assets";
import { MultilingualText } from "@/interfaces/text";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/outline";
import _ from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useReducer,
  useContext,
} from "react";
import { EventContext } from "@/utils/Event";

const TILT_ANGLE = 10;

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
    router.push(`/${(collectionId as string) || `/`}`);
  };

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

  const prev = () =>
    isPrevAvailable &&
    (isDoublePageView
      ? dispatch({ type: "flipPrev" })
      : dispatch({ type: "prev" }));

  const next = () =>
    isNextAvailable &&
    (isDoublePageView
      ? dispatch({ type: "flipNext" })
      : dispatch({ type: "next" }));

  const emitter = useContext(EventContext);
  const exit = () => {
    if (controlEnabled) {
      (function closePageLoop(page) {
        setTimeout(() => {
          if (page > 0) {
            if (page === 1) {
              prev();
              page--;
            } else {
              dispatch({ type: "flipPrev" });
              page -= 2;
            }
            closePageLoop(page);
          } else {
            setTimeout(() => backToCollection(), 1000);
          }
        }, 200);
      })(state.page);
    }
  };

  const [images, setImages] = useState<Images>({});

  const lastPage =
    Object.keys(images).filter((key) => key !== "cover").length - 1;
  const PAGE_NUM = lastPage + 1;
  const [isDoublePageView, setIsDoublePageView] = useState(
    () => innerWidth > 864
  );

  const [controlEnabled, setControlEnabled] = useState(true);
  const isNextAvailable =
    (isDoublePageView && state.page + 2 <= PAGE_NUM + (PAGE_NUM % 2)) ||
    state.page + 1 < PAGE_NUM;
  const isPrevAvailable =
    (isDoublePageView && state.page - 2 >= 0) || state.page - 1 >= 0;

  useEffect(() => {
    const resetCenter = () => {
      const willCenter = innerWidth > 864;
      setIsDoublePageView(willCenter);
      if (willCenter) dispatch({ type: "toDouble" });
    };
    addEventListener("resize", resetCenter);
    console.log(state.page);
    emitter.addListener("exit", exit);
    if (assets) {
      setImages(assets.images);
    }

    return () => {
      emitter.removeListener("exit", exit);
      removeEventListener("resize", resetCenter);
    };
  }, [state.page]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        className={`book-container
          ${
            isDoublePageView ||
            (state.page % 2 === 1
              ? "translate-x-36 sm:translate-x-48"
              : "-translate-x-36 sm:-translate-x-48")
          }`}
        style={{
          perspective: "800px",
        }}
      >
        <div
          className={`book-container
          ${
            isDoublePageView &&
            state.page === 0 &&
            "-translate-x-40 sm:-translate-x-48"
          }`}
          onAnimationStart={() => setControlEnabled(false)}
          onAnimationEnd={() => setControlEnabled(true)}
        >
          {Object.entries(images)
            .filter(([key, _]) => key !== "cover")
            .map(([_, image], pageId) => (
              <BookPage
                key={pageId}
                {...{
                  pageId,
                  page: state.page,
                  lastPage,
                  isDoublePageView,
                  setControlEnabled,
                  image,
                }}
              />
            ))}
        </div>

        <span
          className={`page-nav bg-gradient-to-r 
          ${
            !isDoublePageView && state.page % 2 === 0
              ? "-translate-x-12 left-1/2"
              : "right-full"
          }
          `}
          style={{ zIndex: 51 + lastPage, rotate: `x ${TILT_ANGLE}deg` }}
          onClick={() => {
            if (controlEnabled) {
              (isPrevAvailable === true ? prev : exit)();
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
            !isDoublePageView && state.page % 2 === 1
              ? "translate-x-12 right-1/2"
              : "left-full"
          }`}
          style={{ zIndex: 51 + lastPage, rotate: `x ${TILT_ANGLE}deg` }}
          onClick={() => {
            if (controlEnabled) {
              (isNextAvailable === true ? next : exit)();
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

type BookPageProps = {
  page: number;
  pageId: number;
  lastPage: number;
  isDoublePageView: boolean;
  setControlEnabled: Dispatch<SetStateAction<boolean>>;
  image: ImageSource;
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

      <div
        className="w-full h-full aspect-square top-0 right-0 left-0 bottom-0 scale-150 absolute blur-2xl"
        style={{
          ...(image?.placeholder && image.placeholder.css),
        }}
      ></div>
      <Image
        {...(image?.placeholder
          ? image.placeholder.img
          : { src: image?.url ? image.url : PLACEHOLDER_URL, layout: "fill" })}
      />
    </div>
  );
};
