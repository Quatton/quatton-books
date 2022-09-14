import { useRouter } from "next/router";
import BookCover from "../BookCover";
import _ from "lodash";
import { Locale, MultilingualText } from "@/interfaces/text";
import Article from "@/interfaces/article";

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
    <div className="p-4 flex gap-1 overflow-x-auto overflow-y-visible no-scrollbar">
      {articles?.map((article) => (
        <BookCover
          key={article.id}
          collectionId={collectionId}
          articleId={article.id}
          coverImg={article.coverImageUrl!}
        />
      ))}
    </div>
  );
}
