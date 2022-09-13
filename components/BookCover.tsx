import { useRandomColor } from "@/utils/hooks";
import LoadingImage from "./Loading";
import Link from "next/link";

type Props = {
  articleId: string;
  collectionId: string;
  coverImg: string;
};

export default function BookCover({
  articleId,
  coverImg,
  collectionId,
}: Props) {
  const backgroundColor = useRandomColor();

  return (
    <Link href={`${collectionId}/${articleId}`}>
      <div
        className="
          h-24 sm:h-36 aspect-square drop-shadow-md
          rounded-sm hover:ring-2 ring-amber-500 cursor-pointer
          flex items-center justify-center relative"
        style={{ backgroundColor }}
      >
        <LoadingImage src={coverImg} />
      </div>
    </Link>
  );
}
