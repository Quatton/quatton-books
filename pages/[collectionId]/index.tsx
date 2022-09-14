import BasicCollection from "@/components/Collections/BasicCollection";
import InstagramCollection from "@/components/Collections/InstagramCollection";
import LocaleNotSupported from "@/components/Fallbacks/LocaleNotSupported";
import Layout from "@/components/Layout";
import Collection from "@/interfaces/collection";
import { LOCALE, Locale } from "@/interfaces/text";
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

  if (!collection.title[locale as Locale]) {
    return (
      <LocaleNotSupported
        localeSupported={Object.keys(collection.title) as Locale[]}
      />
    );
  }

  return (
    <Layout>
      {(() => {
        switch (collection.id) {
          case "studygram":
            return <InstagramCollection {...collection} />;
          default:
            return <BasicCollection {...collection} />;
        }
      })()}
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
      ...LOCALE.map((locale) => ({
        params: { collectionId: id },
        locale,
      })),
    ],
    [] as Path[]
  );
  return {
    paths,
    fallback: true,
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
    props: {
      collection: collection.data(),
    },
    revalidate: 60,
  };
};
