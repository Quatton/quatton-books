import {
  Collection,
  getCollections,
  getAllCollectionsWithSrcs,
} from "@/utils/db";
import { GetStaticProps } from "next";
import BookCollection from "../components/BookCollection";
import Layout from "../components/Layout";

export default function Home({ collections }: { collections: Collection[] }) {
  return (
    <Layout>
      <div className="pt-2">
        {collections.map((collection) => (
          <BookCollection key={collection.id} {...collection} />
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const collections = await getAllCollectionsWithSrcs();
  return { props: { collections } };
};
