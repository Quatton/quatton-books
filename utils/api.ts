import { PLACEHOLDER_URL } from "@/constants/placeholder";
import Article, { articleConverter } from "@/interfaces/article";
import Assets, { Images, ImageSource } from "@/interfaces/assets";
import Collection, { collectionConverter } from "@/interfaces/collection";
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";

import { getPlaiceholder } from "plaiceholder";
import { firestore, storage } from "./firebase.config";

/**
 * Get all collections for index page.
 */
export async function getCollections(): Promise<Collection[]> {
  const q = query(collection(firestore, "collections"), orderBy("index"));
  const snapshot = await getDocs(q.withConverter(collectionConverter));

  const col = snapshot.docs
    .map((item) => item.data())
    .filter((data) => data !== undefined);
  return col;
}

export async function getCollectionById(
  collectionId: string
): Promise<Collection | undefined> {
  const collection = await getCollectionByRef(
    doc(firestore, "collections", collectionId)
  );
  return collection;
}

export async function getCollectionByRef(
  collectionRef: DocumentReference
): Promise<Collection | undefined> {
  try {
    const collection = (
      await getDoc(collectionRef.withConverter(collectionConverter))
    )?.data();
    return collection;
  } catch (e) {
    return undefined;
  }
}

export async function getArticleByRef(
  articleRef: DocumentReference
): Promise<Article | undefined> {
  try {
    const article = (
      await getDoc(articleRef.withConverter(articleConverter))
    )?.data();
    return article;
  } catch (e) {
    return undefined;
  }
}

export async function getArticleById(
  collectionId: string,
  articleId: string
): Promise<Article | undefined> {
  const article = await getArticleByRef(
    doc(firestore, `collections/${collectionId}/articles`, articleId)
  );
  return article;
}

export async function getAllArticlesInCollection(
  collectionId: string
): Promise<Article[]> {
  const snapshot = (
    await getDocs(
      query(
        collection(
          firestore,
          `collections/${collectionId}/articles`
        ).withConverter(articleConverter),
        orderBy("index")
      )
    )
  ).docs;
  const articles = snapshot.map((doc) => doc.data());
  return articles;
}

export async function getAssetsById(
  collectionId: string,
  articleId: string,
  isAssetsLoaded: boolean = false
) {
  const images = await getImagesById(collectionId, articleId, isAssetsLoaded);
  return {
    images,
  };
}

/**
 * Please check if assets are already loaded by isAssetsLoaded property
 * because this function literally doesn't even care
 * @param collectionId
 * @param articleId
 * @param assets
 */
export async function loadAssetsToFirestore(
  collectionId: string,
  articleId: string,
  assets: Assets
) {
  Object.entries(assets.images).forEach(async ([imageId, { url }]) => {
    await setDoc(
      doc(
        firestore,
        `collections/${collectionId}/articles/${articleId}/images`,
        imageId
      ),
      { url }
    );
  });
  await updateDoc(
    doc(firestore, `collections/${collectionId}/articles/${articleId}`),
    { isAssetsLoaded: true }
  );
}

export async function getImagesById(
  collectionId: string,
  articleId: string,
  isAssetsLoaded: boolean = false
) {
  let images: Images;
  if (isAssetsLoaded) {
    const path = `collections/${collectionId}/articles/${articleId}/images`;
    const snapshot = await getDocs(collection(firestore, path));
    images = snapshot.docs.reduce(
      (prev, item) => ({
        ...prev,
        [item.id]: item.data() as ImageSource,
      }),
      {} as Images
    );
  } else {
    const path = `${collectionId}/${articleId}/images`;
    const parentRef = ref(storage, path);
    const items = (await listAll(parentRef)).items;
    const imageArray = await Promise.all(
      items.map(async (item) => {
        const imageId = item.name.replace(/\.(gif|jpe?g|png)$/i, "");
        const url = await getDownloadURL(item);
        const placeholder = await getPlaiceholder(url);
        return { imageId, url, placeholder };
      })
    );

    images = imageArray.reduce(
      (prev, { imageId, url, placeholder }) => ({
        ...prev,
        [imageId]: { url, placeholder },
      }),
      {}
    );
    if (!images.cover)
      images.cover = {
        url: PLACEHOLDER_URL,
        placeholder: await getPlaiceholder(PLACEHOLDER_URL),
      };
  }
  return images;
}

/** Contrary to popular beliefs, getImageById returns only url
 *
 * @returns
 * */
export async function getImageUrlById(
  collectionId: string,
  articleId: string,
  imageId: string,
  fileExtension: string = "png"
): Promise<string> {
  const path = `${collectionId}/${articleId}/images/${imageId}.${fileExtension}`;
  try {
    const url = await getDownloadURL(ref(storage, path));
    return url;
  } catch (err) {
    return PLACEHOLDER_URL;
  }
}

//TODO: getCoverImage

export async function getCoverImageUrl(
  collectionId: string,
  articleId: string
): Promise<string> {
  const url = await getImageUrlById(collectionId, articleId, "cover", "jpg");
  if (url) return url;
  const urlAgain = await getImageUrlById(
    collectionId,
    articleId,
    "cover",
    "jpeg"
  );
  return urlAgain;
}
