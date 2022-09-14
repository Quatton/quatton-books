import BookCover from "@/components/BookCover";
import LoadingImage from "@/components/Loading";
import Collection from "@/interfaces/collection";
import { Locale } from "@/interfaces/text";
import { getCollections } from "@/utils/api";
import _ from "lodash";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import styles from "@/styles/Home.module.css";

export default function Home({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const locale = router.locale as Locale;
  const ranges: any[] = _.range(21);
  collections.forEach((collection) => (ranges[collection.index] = collection));
  return (
    <Layout>
      <div className="w-full h-full flex flex-col items-center justify-center py-10 overflow-y-auto">
        <div className={styles.squaredSquare}>
          {ranges.map((collection, idx) => (
            <div>
              <Link href={`/${collection.id}`} passHref>
                <a>
                  <LoadingImage
                    src={
                      ""
                      // collection.articles
                      //   ? collection.articles[0]?.coverImageUrl
                      //   : ""
                    }
                  />
                  <div className="absolute w-full h-full flex items-center justify-center">
                    {idx + 1}
                  </div>
                </a>
              </Link>
            </div>
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
