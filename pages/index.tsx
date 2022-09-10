import { Collection, getCollections, Locale } from "@/utils/db";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

export default function Home({ collections }: { collections: Collection[] }) {
  const router = useRouter();
  const locale = router.locale as Locale;

  return (
    <Layout>
      <div className="pt-2 flex flex-col">
        {collections.map((collection) => (
          <Link href={collection.id} passHref key={collection.id}>
            <div className="px-4 py-2 cursor-pointer">
              <a>{collection.title[locale]}</a>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const collections = await getCollections();
  return { props: { collections } };
};
