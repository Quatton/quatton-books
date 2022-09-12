import BookCollection from "@/components/BookCollection";
import Layout from "@/components/Layout";
import Collection from "@/interfaces/collection";
import { getCollectionById, getCollections } from "@/utils/api";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

type Props = {
  collection: Collection;
};

export default function CollectionPage({ collection }: Props) {
  return (
    <Layout>
      <BookCollection {...collection} />
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
  const collection = await getCollectionById(collectionId);
  if (!collection)
    return {
      notFound: true,
      revalidate: 60,
    };

  return {
    props: { collection: collection.data() },
    revalidate: 60,
  };
};
