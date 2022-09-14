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
    <Link href={`/${collectionId}/${articleId}`}>
      <div
        className="
          h-[7.5rem] sm:h-36 aspect-square drop-shadow-md
          rounded-sm cursor-pointer overflow-y-visible
          flex items-center justify-center relative"
        style={{ backgroundColor, perspective: "800px" }}
      >
        <LoadingImage src={coverImg} />
      </div>
    </Link>
  );
}
