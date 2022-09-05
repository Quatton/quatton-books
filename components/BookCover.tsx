import React from "react";

type Props = {};

export default function BookCover({}: Props) {
  const backgroundColor =
    "#" + Math.floor(Math.random() * 16777215).toString(16);
  return (
    <div
      className="
      w-36 h-36 aspect-square drop-shadow-md
      rounded-lg hover:ring-2 ring-amber-500 cursor-pointer
      flex items-center justify-center"
      style={{ backgroundColor }}
    ></div>
  );
}
