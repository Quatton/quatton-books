import { useRouter } from "next/router";
import React from "react";

type Props = {};

export default function BookModal({}: Props) {
  const { pathname, query } = useRouter();
  if (typeof query.p !== "string") return null;

  const backgroundColor = "#" + query.p;

  return (
    <div
      className="
        w-72 h-72 aspect-square shadow-xl z-40
        rounded-2xl cursor-pointer hover:shadow-zinc-50 transition-shadow 
        flex items-center justify-center"
      style={{ backgroundColor }}
    >
      <h1
        className={`text-3xl ${parseInt(query.p) > 8 * 8 * 8 && "text-white"}`}
      >
        {backgroundColor}
      </h1>
    </div>
  );
}
