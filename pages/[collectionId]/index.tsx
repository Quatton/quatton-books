import BookCollection from "@/components/BookCollection";
import Layout from "@/components/Layout";
import {
  Article,
  Collection,
  getArticles,
  getCollection,
  getCollections,
  getImagesFromArticle,
  ImageArticle,
} from "@/utils/db";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

type Props = {
  collection: Collection;
  articles: Article[];
};

export default function CollectionPage({ collection, articles }: Props) {
  return (
    <Layout>
      <BookCollection {...{ ...collection, articles }} />
    </Layout>
  );
}

//generate /[collectionId]
export const getStaticPaths: GetStaticPaths = async () => {
  const collections = await getCollections();
  const paths = collections.map(({ id }) => ({
    params: { collectionId: id },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { collectionId } = params as { collectionId: string };
  let collection;
  try {
    collection = await getCollection(collectionId);
    const articles: ImageArticle[] = await Promise.all(
      (
        await getArticles({ type: "images", collectionId })
      ).map(async (article) => ({
        ...article,
        images: await getImagesFromArticle(article),
      }))
    );
    return {
      props: { collection, articles },
    };
  } catch (err) {
    return { notFound: true };
  }
};
