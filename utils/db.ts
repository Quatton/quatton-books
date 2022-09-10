import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  listAll,
  ref,
  StorageReference,
} from "firebase/storage";

import { getPlaiceholder } from "plaiceholder";
import { firestore, storage } from "./firebase.config";
import { ImageProps } from "next/image";
import { CSSProperties } from "react";
import { serialize } from "v8";

export type Locale = "th" | "en" | "ja";
export type MultilingualText = {
  th?: string;
  en?: string;
  ja?: string;
};

export type ArticleTypeName = "images" | "components";

export type Collection = {
  id: string;
  title: MultilingualText;
};

export type Article = ImageArticle | ComponentArticle;

export type BaseArticle = {
  id: string;
  title: MultilingualText;
  collectionId: string;
  type: ArticleTypeName;
};

export type ArticleType<A extends ArticleTypeName> = A extends "images"
  ? ImageArticle
  : A extends "components"
  ? ComponentArticle
  : never;

export interface ImageArticle extends BaseArticle {
  type: "images";
  images?: ImageSrc[];
}

export type ImageSrc = {
  img: ImageProps;
  css: CSSProperties;
};

export interface ComponentArticle extends BaseArticle {
  type: "components";
}

export const placeholderURL =
  "https://images.unsplash.com/photo-1508515053963-70c7cc39dfb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80";

export async function getCollections() {
  const q = query(collection(firestore, "collections"), orderBy("title"));
  const snapshot = await getDocs(q);

  const collections: Collection[] = snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() } as Collection))
    .filter((data) => data !== undefined);
  return collections;
}

export async function getCollection(collectionId: string) {
  const item = await getDoc(doc(firestore, "collections", collectionId));
  const collection = { id: item.id, ...item.data() } as Collection;
  return collection;
}

export async function getArticle(articleId: string) {
  const item = await getDoc(doc(firestore, "articles", articleId));
  const Article = { id: item.id, ...item.data() } as Article;
  return Article;
}

export async function getArticles<T extends ArticleTypeName>(options?: {
  collectionId?: string;
  type?: T;
}) {
  const q = options
    ? query(
        collection(firestore, "articles"),
        options.collectionId
          ? where("collectionId", "==", options.collectionId)
          : orderBy("collectionId"),
        options.type ? where("type", "==", options.type) : orderBy("type")
      )
    : query(collection(firestore, "articles"));
  const snapshot = await getDocs(q);

  const articles: ArticleType<T>[] = snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() } as ArticleType<T>))
    .filter((data) => data !== undefined);
  return articles;
}

export async function getImagesFromArticle(article: ImageArticle) {
  const imageRefs = await getImageRefsFromArticle(
    article.collectionId,
    article.id
  );
  const images: ImageSrc[] = await getAllImagesFromRefs(imageRefs);
  return images;
}

async function getAllImagesFromRefs(imageRefs: StorageReference[]) {
  const images: ImageSrc[] = await Promise.all(
    imageRefs.map(async (imageRef) => {
      try {
        return await getPlaiceholder(await getDownloadURL(imageRef), {
          size: 64,
        });
      } catch (error) {
        return await getPlaiceholder(placeholderURL);
      }
    })
  );
  return images;
}

async function getImageRefsFromArticle(
  collectionId: string,
  articleId: string
) {
  const imageRefs = (
    await listAll(ref(storage, `${collectionId}/${articleId}`))
  ).items;
  return imageRefs;
}

export async function getImageUrl(
  collectionId: string,
  articleId: string,
  page?: number
) {
  const pageNum = page ? "-" + page : "";
  const path = `${collectionId}/${articleId}/${articleId}${pageNum}.png`;
  const imageRef = ref(storage, path);
  try {
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error: unknown) {
    return "https://images.unsplash.com/photo-1508515053963-70c7cc39dfb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80";
  }
}
