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
import { PLACEHOLDER_URL } from "@/constants/placeholder";

export default function Home({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const locale = router.locale as Locale;
  const ranges: any[] = _.range(21);
  collections.forEach((collection) => (ranges[collection.index] = collection));
  return (
    <Layout>
      <div className={styles.container}>
        <div
          className={styles.squaredSquare}
          style={{
            perspective: "800px",
          }}
        >
          {ranges.map((collection, idx) => (
            <div className="flex items-center justify-center">
              <Link href={`/${collection.id ? collection.id : ""}`} passHref>
                <a className="relative w-5/6 h-5/6">
                  <LoadingImage
                    src={
                      collection.articles
                        ? collection.articles[0]?.coverImageUrl
                        : ""
                    }
                  />
                  <div className="absolute w-full h-full flex items-center justify-center opacity-20">
                    {idx}
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
