import BookCover from "@/components/BookCover";
import Collection from "@/interfaces/collection";
import { Locale } from "@/interfaces/text";
import { getCollections } from "@/utils/api";
import _ from "lodash";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Home({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const locale = router.locale as Locale;
  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center py-10 overflow-y-auto">
        <div className="grid grid-cols-4 grid-rows-4 gap-2 overflow-visible">
          {collections
            .filter((collection) =>
              Object.keys(collection.title).includes(locale)
            )
            .map((collection) => (
              <Link href={`/${collection.id}`} key={collection.id} passHref>
                <BookCover coverImg={collection.articles![0]?.coverImageUrl} />
              </Link>
            ))}
        </div>
      </div>
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
