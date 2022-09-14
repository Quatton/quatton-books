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

export default function InstagramCollection({
  title,
  id: collectionId,
  articles,
}: Props) {
  const { locale } = useRouter();
  if (!locale || typeof title[locale as Locale] === "undefined") return null;
  return (
    <div className="w-full h-full flex flex-col items-center p-4 overflow-y-auto">
      <div className="grid grid-cols-3 gap-2 overflow-visible">
        {articles!.map((article) => (
          <BookCover
            key={article.id}
            collectionId={collectionId}
            articleId={article.id}
            coverImg={article.coverImageUrl!}
          />
        ))}
      </div>
    </div>
  );
}
