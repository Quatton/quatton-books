import _ from "lodash";
import { useRouter } from "next/router";
import { useState } from "react";

type Props = {};

export default function BookModal({}: Props) {
  const { query } = useRouter();
  if (typeof query.p !== "string") return null;
  const color = query.p;

  const [page, setPage] = useState(1);

  const PAGE_NUM = 10;

  const next = () => {
    if (page + 1 <= PAGE_NUM) {
      setPage(page + 1);
    }
  };

  const prev = () => {
    if (page - 1 >= 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex flex-row absolute bottom-16 gap-48">
        <button
          className={`bg-camel px-4 py-2 
          rounded-l-md text-2xl
          ${
            page - 1 < 1
              ? "cursor-not-allowed bg-gray-500 text-gray-700"
              : "hover:bg-amber-200 hover:text-amber-900"
          }`}
          onClick={() => prev()}
          disabled={page - 1 < 1}
        >
          Prev
        </button>
        <button
          className={`bg-camel px-4 py-2 
          rounded-r-md text-2xl
          ${
            page + 1 > PAGE_NUM
              ? "cursor-not-allowed bg-gray-500 text-gray-700"
              : "hover:bg-amber-200 hover:text-amber-900"
          }`}
          onClick={() => next()}
          disabled={page + 1 > PAGE_NUM}
        >
          Next
        </button>
      </div>

      <div
        className={`
      aspect-[2/1] relative 
      flex flex-row items-center justify-items-center transition-all ease-in-out duration-1000
      ${page % 2 === 0 ? "translate-x-48" : "-translate-x-48"}`}
      >
        {_.range(1, PAGE_NUM, 2).map((pageId) => (
          <BookTurnPage
            color={color}
            content={[pageId, pageId + 1]}
            page={page}
            pageId={pageId}
            lastPage={PAGE_NUM}
          />
        ))}
      </div>
    </div>
  );
}

const BookStaticPage = ({ color, content }: any) => {
  return (
    <div
      className="
      book-card z-40"
      style={{
        backgroundColor: `#${color}`,
      }}
    >
      <h1 className={`text-3xl ${parseInt(color) > 8 * 8 * 8 && "text-white"}`}>
        {content}
      </h1>
    </div>
  );
};

const BookTurnPage = ({ page, lastPage, pageId, color, content }: any) => {
  const isPageTurned = page > pageId;

  // page > pageId === passed === later should cover
  const zIndexIncrement = Math.sign(page - pageId) * pageId;
  return (
    <>
      <div
        className="
        left-1/2
        absolute book-card origin-left"
        style={{
          backgroundColor: `#${color}`,
          rotate: `y ${isPageTurned ? 180 : 0}deg`,
          zIndex: `${isPageTurned ? 50 : 51 + zIndexIncrement}`,
        }}
      >
        <h1
          className={`text-3xl ${parseInt(color) > 8 * 8 * 8 && "text-white"}`}
        >
          {content[0]}
        </h1>
      </div>
      <div
        className="
        left-1/2
        absolute book-card origin-left"
        style={{
          backgroundColor: `#${color}`,
          transform: "translateX(-24rem)",
          rotate: `y ${isPageTurned ? 0 : 180}deg`,
          zIndex: `${isPageTurned ? 51 : 50 + zIndexIncrement}`,
        }}
      >
        <h1
          className={`text-3xl ${parseInt(color) > 8 * 8 * 8 && "text-white"}`}
        >
          {content[1]}
        </h1>
      </div>
    </>
  );
};
