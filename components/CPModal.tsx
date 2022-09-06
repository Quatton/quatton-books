import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import BookModal from "./BookModal";

type Props = {};

export default function CPModal({}: Props) {
  const { pathname, query } = useRouter();
  if (typeof query.p !== "string") return null;

  return (
    <div className="absolute flex items-center justify-center w-full h-full z-30">
      <Link href={pathname}>
        <span className="absolute flex items-center justify-center w-full h-full bg-neutral-900/70 cursor-pointer"></span>
      </Link>
      <BookModal />
    </div>
  );
}
