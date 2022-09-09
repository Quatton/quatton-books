import { getImageUrl } from "@/utils/db";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import LoadingImage from "./Loading";
import Loading from "./Loading";

type Props = {
  slug: string;
  articleId: string;
};

export default function BookCover({ slug, articleId }: Props) {
  const backgroundColor =
    "#" +
    useMemo(
      () => Math.floor(Math.random() * 16777215).toString(16),
      [articleId]
    );
  const router = useRouter();
  const { pathname } = router;

  const shallowPush = () => {
    router.push(
      { pathname, query: { c: slug, a: articleId } },
      { pathname, query: { c: slug, a: articleId } },
      { shallow: true }
    );
  };

  return (
    <div
      onClick={() => shallowPush()}
      className="
        w-36 h-36 aspect-square drop-shadow-md
        rounded-sm hover:ring-2 ring-amber-500 cursor-pointer
        flex items-center justify-center relative"
      style={{ backgroundColor }}
    >
      <LoadingImage collectionId={slug} articleId={articleId} pageId={0} />
    </div>
  );
}
