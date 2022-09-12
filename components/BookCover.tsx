import { useRandomColor } from "@/utils/utils";
import LoadingImage from "./Loading";

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
    <div
      className="
        w-36 h-36 aspect-square drop-shadow-md
        rounded-sm hover:ring-2 ring-amber-500 cursor-pointer
        flex items-center justify-center relative"
      style={{ backgroundColor }}
    >
      <LoadingImage src={coverImg} />
    </div>
  );
}
