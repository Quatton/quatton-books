import { useRouter } from "next/router";
import BookCover from "./BookCover";
import _ from "lodash";
import { Locale, MultilingualText } from "@/utils/db";
import Link from "next/link";

type Props = {
  title: MultilingualText;
  slug: string;
  content: Array<any>;
};

export default function BookCollection({ title, slug, content }: Props) {
  const { locale } = useRouter();
  if (!locale || typeof title[locale as Locale] === "undefined") return null;

  return (
    <div className="p-4">
      <Link href={`/${slug}`}>
        <a className="text-lg text-amber-900 hover:text-amber-700 cursor-pointer">
          {title[locale as Locale]}
        </a>
      </Link>
      <div className="mt-2 flex gap-1 p-1 overflow-x-auto no-scrollbar">
        {content.map(({ id: articleId }) => (
          <BookCover key={articleId} slug={slug} articleId={articleId} />
        ))}
      </div>
    </div>
  );
}
