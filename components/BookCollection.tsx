import { useRouter } from "next/router";
import BookCover from "./BookCover";
import _ from "lodash";

type Props = any;

export default function BookCollection({ title }: Props) {
  const { locale } = useRouter();
  if (!locale || typeof title[locale] === "undefined") return null;

  return (
    <div className="p-4">
      <div className="text-xl text-amber-900">{title[locale]}</div>
      <div className="mt-2 flex gap-1 p-1 overflow-x-auto no-scrollbar scroll-auto">
        {_.range(30).map((i) => (
          <BookCover key={i} />
        ))}
      </div>
    </div>
  );
}
