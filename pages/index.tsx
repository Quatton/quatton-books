import { useContext } from "react";
import BookCollection from "../components/BookCollection";
import Layout from "../components/Layout";
import { SettingContext } from "../utils/Settings";

export default function Home() {
  const collections = [
    { th: "ดอกไม้", en: "Flowers", ja: "花" },
    { th: "ต้นไม้", en: "Trees", ja: "木" },
    { th: "ใบไม้", en: "Leaves", ja: "葉っぱ" },
    { th: "สัตว์ป่า", en: "Wild Animals", ja: "野生動物" },
    { th: "ลำธาร", en: "Creek", ja: "小川" },
  ];

  return (
    <Layout>
      <div className="pt-2">
        {collections.map((collection, idx) => (
          <BookCollection key={idx} title={collection} />
        ))}
      </div>
    </Layout>
  );
}
