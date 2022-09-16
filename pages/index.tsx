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

  collections.forEach(async (collection) => {
    ranges[collection.index] = collection;
  });

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.squaredSquare}>
          {ranges.map((collection, idx) => (
            <div tabIndex={idx} key={idx}>
              <Link href={collection.id ? `/${collection.id}` : "#"} passHref>
                <a
                  onTouchStart={(e) => e.preventDefault()}
                  className={styles.book}
                >
                  <LoadingImage />
                  <h1 className={styles.tag}>
                    {collection.title
                      ? collection.title[locale]
                        ? collection.title[locale]
                        : collection.title[Object.keys(collection.title)[0]]
                      : idx}
                  </h1>
                </a>
              </Link>
              <span className="w-full h-full absolute cursor-pointer sm:hidden"></span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const collections = await getCollections();

  return {
    props: { collections: collections.map((collection) => collection.data()) },
    revalidate: 60,
  };
};
