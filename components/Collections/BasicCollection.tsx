import { useRouter } from "next/router";
import BookCover from "../BookCover";
import _ from "lodash";
import { Locale, MultilingualText } from "@/interfaces/text";
import Article from "@/interfaces/article";
import Link from "next/link";

type Props = {
  title: MultilingualText;
  id: string;
  articles?: Article[];
};

export default function BasicCollection({
  title,
  id: collectionId,
  articles,
}: Props) {
  const { locale } = useRouter();
  if (!locale || typeof title[locale as Locale] === "undefined") return null;
  return (
    <div>
      <div className="px-4 py-2">
        <h1>{title[locale as Locale]}</h1>
      </div>
      <div className="p-4 flex gap-1 overflow-x-auto overflow-y-visible no-scrollbar">
        {articles?.map((article) => (
          <Link href={`/${collectionId}/${article.id}`}>
            <BookCover key={article.id} coverImg={article.coverImageUrl!} />
          </Link>
        ))}
      </div>
    </div>
  );
}
