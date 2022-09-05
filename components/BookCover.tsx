import React from "react";

type Props = {};

export default function BookCover({}: Props) {
  return (
    <div
      className="
      w-36 h-36 aspect-square bg-gray-300
      rounded-lg hover:ring-2 ring-amber-500 cursor-pointer
      flex items-center justify-center"
    ></div>
  );
}
