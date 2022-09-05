import { useRouter } from "next/router";
import React from "react";
import BookCover from "./BookCover";
import _ from "lodash";

type Props = any;

export default function BookCollection({ title }: Props) {
  const { locale } = useRouter();
  if (!locale || typeof title[locale] === "undefined") return null;

  return (
    <div className="p-4">
      <div className="text-3xl">{title[locale]}</div>
      <div className="mt-4 flex gap-4 p-1 overflow-x-auto no-scrollbar">
        {_.range(30).map((i) => (
          <BookCover />
        ))}
      </div>
    </div>
  );
}
