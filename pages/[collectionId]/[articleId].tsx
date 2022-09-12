import BookModal from "@/components/BookModal";
import Layout from "@/components/Layout";
import Article from "@/interfaces/article";
import { getArticleById, getCollections } from "@/utils/api";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useEffect, useState } from "react";

type Props = {
  article: Article;
};

export default function ArticlePage({ article }: Props) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return <Layout>{isClient && <BookModal {...article} />}</Layout>;
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
    (prev: Path[], collection) => [
      ...prev,
      ...collection.articles!.map((article) => ({
        params: {
          collectionId: collection.id,
          articleId: article.id,
        },
      })),
    ],
    [] as Path[]
  );
  return {
    paths,
    fallback: "blocking",
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
    props: { article: article.data() },
    revalidate: 60,
  };
};
