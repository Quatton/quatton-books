import BookModal from "@/components/BookModal";
import Layout from "@/components/Layout";
import Article from "@/interfaces/article";
import { LOCALE, Locale } from "@/interfaces/text";
import { getArticleById, getCollections } from "@/utils/api";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useEffect, useState } from "react";

type Props = {
  article: Article;
  collectionId: string;
};

export default function ArticlePage({ article, collectionId }: Props) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
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
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
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
  if (!article.title[locale as Locale]) {
    return {
      redirect: {
        destination: `/${
          Object.keys(article.title)[0]
        }/${collectionId}/${articleId}`,
        permanent: false,
        basePath: false,
      },
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
