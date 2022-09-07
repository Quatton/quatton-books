import { collection, getDocs } from "firebase/firestore";
import { firestore } from "./firebase.config";

export type MultilingualText = {
  th?: string;
  en?: string;
  ja?: string;
};

export type Locale = "th" | "en" | "ja";

export type Collection = {
  id: string;
  title: MultilingualText;
};

export async function getData(path: string) {
  const querySnapshot = await getDocs(collection(firestore, path));
  return querySnapshot;
}

export async function getCollections() {
  const res = await getData("collections");
  const collections = res.docs.map((item) => {
    return { ...item.data(), id: item.id };
  });

  return collections;
}
