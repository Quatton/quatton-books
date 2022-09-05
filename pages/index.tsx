import { useContext } from "react";
import BookCollection from "../components/BookCollection";
import Layout from "../components/Layout";
import { SettingContext } from "../utils/Settings";

export default function Home() {
  const { settings, setSettings } = useContext(SettingContext);
  const collections = [
    { th: "ดอกไม้", en: "Flowers" },
    { th: "ต้นไม้", en: "Trees" },
    { th: "ใบไม้", en: "Leaves" },
    { th: "สัตว์ป่า", en: "Wild Animals" },
    { th: "ลำธาร", en: "Creek" },
  ];

  return (
    <Layout>
      {collections.map((collection) => (
        <BookCollection key={collection.en} />
      ))}
    </Layout>
  );
}
