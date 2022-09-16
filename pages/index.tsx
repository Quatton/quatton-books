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
            <div
              tabIndex={idx}
              className="flex items-center justify-center [&:focus_>_span]:hidden [&:focus_>_a]:brightness-110
              [&:focus_img]:blur-sm [&:img]:duration-500"
              key={idx}
            >
              <Link href={collection.id ? `/${collection.id}` : "#"} passHref>
                <a
                  onTouchStart={(e) => e.preventDefault}
                  className="
                  relative w-[92%] h-[92%] shadow-xl drop-shadow-md
                  flex items-center justify-center [&:hover+span]:hidden
                  hover:brightness-110 [&:hover_img]:blur-sm
                  transition-all
                  "
                >
                  <LoadingImage />
                  <h1
                    className="
                    opacity-0 transition-all absolute text-xs
                    w-5/6 flex items-center justify-center py-2
                    bg-neutral-400/80 text-center rounded-sm px-2"
                  >
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
