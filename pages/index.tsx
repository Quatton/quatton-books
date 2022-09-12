import BookCollection from "@/components/BookCollection";
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
        <div className="pt-2 flex flex-col">
          <Link href={collection.id} passHref key={collection.title[locale]}>
            <div className="px-4 py-2 cursor-pointer">
              <a>{collection.title[locale]}</a>
            </div>
          </Link>
          <BookCollection
            {...collection}
            articles={collection.articles}
            key={collection.id}
          />
        </div>
      ))}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const collections = await getCollections();
  await Promise.all(
    collections.map(
      async (collection) =>
        await Promise.all(
          (
            await collection.saveFeaturedArticles()
          ).map(async (article) => await article.saveCoverImageUrl())
        )
    )
  );

  return {
    props: { collections: collections.map((collection) => collection.data()) },
  };
};
