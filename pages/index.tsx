import { getCollections } from "@/utils/db";
import { GetStaticProps } from "next";
import BookCollection from "../components/BookCollection";
import Layout from "../components/Layout";

export default function Home({ collections }: { collections: Array<any> }) {
  return (
    <Layout>
      <div className="pt-2">
        {collections.map((collection) => (
          <BookCollection
            key={collection.id}
            title={collection.title}
            slug={collection.id}
            content={collection.content}
          />
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const collections = await getCollections();
  return { props: { collections } };
};
