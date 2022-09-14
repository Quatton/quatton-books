import BookModal from "@/components/BookModal";
import Fallback from "@/components/Fallbacks/Fallback";
import LocaleNotSupported from "@/components/Fallbacks/LocaleNotSupported";
import Layout from "@/components/Layout";
import Article from "@/interfaces/article";
import { LOCALE, Locale } from "@/interfaces/text";
import { getArticleById, getCollections } from "@/utils/api";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Props = {
  article: Article;
  collectionId: string;
};

export default function ArticlePage({ article, collectionId }: Props) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const { locale } = router;

  if (router.isFallback) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-full w-full gap-4 text-amber-900">
          <h2 className="text-xl sm:text-2xl text-center border-amber-700">
            what
          </h2>
          <h2 className="text-lg sm:text-xl text-center border-amber-700">
            Wait a sec. I didn't expect you to see this.
          </h2>
        </div>
      </Layout>
    );
  }

  if (!article.title[locale as Locale]) {
    return (
      <LocaleNotSupported
        localeSupported={Object.keys(article.title) as Locale[]}
      />
    );
  }

  return (
    <Layout>
      {isClient && (
        <BookModal
          {...{
            title: article.title,
            id: article.id,
            type: article.type,
            assets: article.assets,
            collectionId,
          }}
        />
      )}
    </Layout>
  );
}

//generate /[collectionId]/[articleId]
export const getStaticPaths: GetStaticPaths = async () => {
  const collections = await getCollections();
  await Promise.all(
    collections.map(async (collection) =>
      (await collection.saveAllArticles()).data()
    )
  );

  /**
   * Current collections:
   * {
   *  id: collectionId,
   *  ...
   *  articles: {
   *    id: articleId,
   *  }[]
   * }[]
   *
   * map & map:
   * {
   *  params: {collectionId, articleId}
   * }[][]
   */

  /**
   * DON'T DARE DEALING WITH THIS SHIT AGAIN
   * PLEASE LEAVE IT AS IS, FUTURE ME.
   */
  type Path = { params: { collectionId: string; articleId: string } };
  const paths = collections.reduce(
    (prevI: Path[], collection) => [
      ...prevI,
      ...collection.articles!.reduce(
        (prevJ, article) => [
          ...prevJ,
          ...LOCALE.map((locale) => ({
            params: {
              collectionId: collection.id,
              articleId: article.id,
            },
            locale,
          })),
        ],
        [] as Path[]
      ),
    ],
    [] as Path[]
  );
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { collectionId, articleId } = params as {
    collectionId: string;
    articleId: string;
  };
  const article = await getArticleById(collectionId, articleId);
  if (!article) {
    return {
      notFound: true,
      revalidate: 60,
    };
  }
  if (article.type === "server") {
    await article.saveAssets();
  }
  return {
    props: { article: article.data(), collectionId },
    revalidate: 60,
  };
};
