import _ from "lodash";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

type Props = {};

export default function BookModal({}: Props) {
  const { query } = useRouter();
  if (typeof query.p !== "string") return null;
  const color = query.p;
  const backgroundColor = "#" + color;

  const [page, setPage] = useState(1);

  const PAGE_NUM = 10;

  const next = () => {
    if (page + 2 <= PAGE_NUM) {
      setPage(page + 2);
    }
  };

  const prev = () => {
    if (page - 2 >= 0) {
      setPage(page - 2);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center">
      <p className="absolute top-20">{page}</p>
      <button
        className="absolute top-40 left-40 bg-red-500 p-4"
        onClick={() => prev()}
      >
        Prev
      </button>
      <button
        className="absolute top-40 right-40 bg-red-500 p-4"
        onClick={() => next()}
      >
        Next
      </button>

      <div className="w-144 aspect-[1/2] relative flex flex-row items-center justify-items-center">
        {_.range(1, PAGE_NUM, 2).map((idx) => (
          <>
            <div
              className="
            absolute w-72 h-72 aspect-square shadow-xl
            rounded-2xl cursor-pointer hover:shadow-zinc-50
            flex items-center justify-center transition-all duration-1000 origin-left"
              style={{
                backgroundColor,
                rotate: `y ${page >= idx ? 180 : 0}deg`,
                zIndex: `${50 + page - idx}`,
              }}
            >
              <h1
                className={`text-3xl ${
                  parseInt(color) > 8 * 8 * 8 && "text-white"
                }`}
              >
                {idx + 1} Front
              </h1>
            </div>
            <div
              className="
            absolute w-72 h-72 aspect-square shadow-xl
            rounded-2xl cursor-pointer hover:shadow-zinc-50
            flex items-center justify-center transition-all duration-1000 origin-left"
              style={{
                backgroundColor,
                rotate: `y ${page >= idx ? 0 : 180}deg`,
                zIndex: `${50 + page - idx + Math.sign(page - idx)}`,
                transform: `translateX(-18rem)`,
              }}
            >
              <h1
                className={`text-3xl ${
                  parseInt(color) > 8 * 8 * 8 && "text-white"
                }`}
              >
                {idx} Back
              </h1>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}
