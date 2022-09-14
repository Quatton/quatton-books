import BasicCollection from "@/components/Collections/BasicCollection";
import Collection from "@/interfaces/collection";
import { Locale } from "@/interfaces/text";
import { getCollections } from "@/utils/api";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Home({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const locale = router.locale as Locale;
  return (
    <Layout>
      {collections.map((collection) => (
        <div className="pt-2 flex flex-col" key={collection.id}>
          <div className="px-4 py-2">
            <Link href={collection.id} passHref>
              <a className="cursor-pointer text-amber-900 hover:text-amber-700 hover:underline underline-offset-2">
                {collection.title[locale]}
              </a>
            </Link>
          </div>
          <BasicCollection {...collection} />
        </div>
      ))}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const collections = await getCollections();
  await Promise.all(
    collections.map(
      async (collection) => await collection.saveFeaturedArticles()
    )
  );
  return {
    props: { collections: collections.map((collection) => collection.data()) },
    revalidate: 60,
  };
};
