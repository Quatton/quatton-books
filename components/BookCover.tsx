import { useRandomColor } from "@/utils/hooks";
import LoadingImage from "./Loading";

type Props = {
  coverImg?: string;
};

export default function BookCover({ coverImg }: Props) {
  const backgroundColor = useRandomColor();

  return (
    <div
      className="
          h-24 sm:h-36 aspect-square drop-shadow-md
          rounded-sm cursor-pointer overflow-y-visible
          flex items-center justify-center relative"
      style={{ backgroundColor, perspective: "800px" }}
    >
      <LoadingImage src={coverImg} />
    </div>
  );
}
