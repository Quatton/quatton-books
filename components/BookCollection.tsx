import { useRouter } from "next/router";
import BookCover from "./BookCover";
import _ from "lodash";
import { Article, Collection, Locale } from "@/utils/db";
import Link from "next/link";

type Props = Collection & { articles: Article[] };

export default function BookCollection({
  title,
  id: collectionId,
  articles,
}: Props) {
  const { locale } = useRouter();
  if (!locale || typeof title[locale as Locale] === "undefined") return null;
  return (
    <div className="p-4">
      <div className="mt-2 flex gap-1 p-1 overflow-x-auto no-scrollbar">
        {articles.map((article) => (
          <BookCover
            key={article.id}
            articleId={article.id}
            coverImg={
              article.type === "images" && article.images
                ? article.images[0]
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
