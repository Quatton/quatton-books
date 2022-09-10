import { ImageSrc } from "@/utils/db";
import Image from "next/image";
import { useMemo } from "react";

type Props = {
  articleId: string;
  coverImg: ImageSrc | undefined;
};

export default function BookCover({ articleId, coverImg }: Props) {
  const backgroundColor =
    "#" +
    useMemo(
      () => Math.floor(Math.random() * 16777215).toString(16),
      [articleId]
    );

  return (
    <div
      className="
        w-36 h-36 aspect-square drop-shadow-md
        rounded-sm hover:ring-2 ring-amber-500 cursor-pointer
        flex items-center justify-center relative"
      style={{ backgroundColor, ...coverImg?.css }}
    >
      {coverImg && <Image {...coverImg.img} />}
    </div>
  );
}
