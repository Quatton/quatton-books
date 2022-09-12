import BookCollection from "@/components/BookCollection";
import Layout from "@/components/Layout";
import Collection from "@/interfaces/collection";
import { Locale } from "@/interfaces/text";
import { getCollectionById, getCollections } from "@/utils/api";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";

type Props = {
  collection: Collection;
};

export default function CollectionPage({ collection }: Props) {
  const router = useRouter();
  const { locale } = router;
  return (
    <Layout>
      <div className="pt-2 flex flex-col" key={collection.id}>
        <div className="px-4 py-2">
          <h1>{collection.title[locale as Locale]}</h1>
        </div>
        <BookCollection {...collection} />
      </div>
    </Layout>
  );
}

//generate /[collectionId]
export const getStaticPaths: GetStaticPaths = async () => {
  const collections = await getCollections();
  type Path = {
    params: ParsedUrlQuery;
    locale?: string | undefined;
  };
  const paths: Path[] = collections.reduce(
    (prev, { id, title }) => [
      ...prev,
      ...Object.keys(title).map((locale) => ({
        params: { collectionId: id },
        locale,
      })),
    ],
    [] as Path[]
  );
  return {
    paths,
    fallback: "blocking",
    revalidate: 60,
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
  await collection.saveAllArticles();
  return {
    props: { collection: collection.data() },
    revalidate: 60,
  };
};
