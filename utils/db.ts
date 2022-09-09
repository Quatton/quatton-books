import { collection, getDocs } from "firebase/firestore";
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

export type MultilingualText = {
  th?: string;
  en?: string;
  ja?: string;
};

export type Locale = "th" | "en" | "ja";

export type Collection = {
  id: string;
  title: MultilingualText;
  articles:
    | ImageArticle<SourceWithPlaceholder | SourceWithURL | undefined>[]
    | ComponentArticle[];
};

export type ComponentArticle = {
  id: string;
  type: "component";
};

export type ImageArticle<Source> = {
  id: string;
  type: "image";
  srcs: Source;
};

export type SourceWithPlaceholder = {
  type: "placeholder";
  placeholders: Placeholder[];
};

export type Placeholder = {
  img: ImageProps;
  css: CSSProperties;
};

export type SourceWithURL = {
  type: "url";
  urls: string[];
};

const INVALID_URL =
  "https://images.unsplash.com/photo-1508515053963-70c7cc39dfb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80";

export async function getData(path: string) {
  const querySnapshot = await getDocs(collection(firestore, path));
  return querySnapshot;
}

export async function getCollections() {
  const res = await getData("collections");

  const collections = res.docs.map((item) => {
    return { ...(item.data() as Collection), id: item.id };
  });

  return collections;
}

export async function getAllImageURLsFromList(imageRefs: StorageReference[]) {
  const urls: string[] = await Promise.all(
    imageRefs.map(async (imageRef) => {
      try {
        return await getDownloadURL(imageRef);
      } catch (error) {
        return INVALID_URL;
      }
    })
  );
  return urls;
}

export async function getImageRefsFromArticle(
  collectionId: string,
  articleId: string
) {
  const imageRefs = (
    await listAll(ref(storage, `${collectionId}/${articleId}`))
  ).items;
  return imageRefs;
}

export async function getUrlsFromArticle(
  collectionId: string,
  articleId: string
) {
  const imageRefs = await getImageRefsFromArticle(collectionId, articleId);
  const urls = await getAllImageURLsFromList(imageRefs);

  return urls;
}

export async function getPlaceholdersFromArticle(
  collectionId: string,
  articleId: string
) {
  const urls = await getUrlsFromArticle(collectionId, articleId);
  const placeholders = await getPlaceholderFromURLs(urls);
  return placeholders;
}

export async function getPlaceholderFromURLs(urls: string[]) {
  const placeholders = await Promise.all(
    urls.map(async (url) => (await getPlaiceholder(url)) as Placeholder)
  );
  return placeholders;
}

export async function getAllCollectionsWithSrcs(withPlaceholder = false) {
  const collections: Collection[] = await getCollections();
  const collectionsWithSrcs = await Promise.all(
    collections
      .filter((collection) => collection.articles)
      .map(async (collection) => {
        return {
          ...collection,
          articles: await Promise.all(
            collection.articles.map(async (article) => {
              switch (article.type) {
                case "image":
                  return {
                    ...article,
                    srcs: withPlaceholder
                      ? ({
                          type: "placeholder",
                          placeholders: await getPlaceholdersFromArticle(
                            collection.id,
                            article.id
                          ),
                        } as SourceWithPlaceholder)
                      : ({
                          type: "url",
                          urls: await getUrlsFromArticle(
                            collection.id,
                            article.id
                          ),
                        } as SourceWithURL),
                  };
                case "component":
                  return article;
              }
            })
          ),
        };
      })
  );

  return collectionsWithSrcs;
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
