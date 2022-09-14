import { useRandomColor } from "@/utils/hooks";
import Link from "next/link";
import LoadingImage from "./Loading";

type Props = {
  coverImg?: string;
  collectionId: string;
  articleId: string;
};

export default function BookCover({
  coverImg,
  collectionId,
  articleId,
}: Props) {
  const backgroundColor = useRandomColor();
  return (
    <Link href={`/${collectionId}/${articleId}`} passHref>
      <a>
        <div
          className="
            h-24 sm:h-36 aspect-square drop-shadow-md
            rounded-sm cursor-pointer overflow-y-visible
            flex items-center justify-center relative"
          style={{ perspective: "800px", backgroundColor }}
        >
          <div className="open-book w-full h-full">
            <LoadingImage src={coverImg} />
          </div>
        </div>
      </a>
    </Link>
  );
}
