import { useRouter } from "next/router";
import BookCover from "./BookCover";
import _ from "lodash";
import { Collection, Locale } from "@/utils/db";
import Link from "next/link";

type Props = Collection;

export default function BookCollection({
  title,
  id: collectionId,
  articles,
}: Props) {
  const { locale } = useRouter();
  if (!locale || typeof title[locale as Locale] === "undefined") return null;

  return (
    <div className="p-4">
      <Link href={`/${collectionId}`}>
        <a className="text-lg text-amber-900 hover:text-amber-700 cursor-pointer">
          {title[locale as Locale]}
        </a>
      </Link>
      <div className="mt-2 flex gap-1 p-1 overflow-x-auto no-scrollbar">
        {articles.map((article) => (
          <BookCover
            key={article.id}
            collectionId={collectionId}
            articleId={article.id}
            url={article.srcs ? article.srcs[0] : ""}
          />
        ))}
      </div>
    </div>
  );
}
