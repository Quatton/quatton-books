import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import Error from "next/error";
import { firestore, storage } from "./firebase.config";

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

export async function getImageUrl(
  collectionId: string,
  articleId: string,
  page: number
) {
  const path = `${collectionId}/${articleId}/${articleId}-${page
    .toString()
    .padStart(2, "0")}.png`;
  const imageRef = ref(storage, path);
  console.log(imageRef);
  try {
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error: unknown) {
    return "https://images.unsplash.com/photo-1508515053963-70c7cc39dfb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80";
  }
}
