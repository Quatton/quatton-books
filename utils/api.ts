import Article from "@/interfaces/article";
import Assets, { Images, ImageSource } from "@/interfaces/assets";
import Collection from "@/interfaces/collection";
import { MultilingualText } from "@/interfaces/text";
import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  SnapshotOptions,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, listAll, ref } from "firebase/storage";

import { getPlaiceholder } from "plaiceholder";
import { firestore, storage } from "./firebase.config";

const collectionConverter = {
  toFirestore: (collection: Collection) => {
    return {
      id: collection.id,
      title: collection.title,
      featured: collection.featured,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)!;
    return new Collection(snapshot.id, data.title, data.featured);
  },
};

const articleConverter = {
  toFirestore: (article: Article) => {
    return {
      id: article.id,
      title: article.title,
      type: article.type,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)!;
    return new Article(
      snapshot.id,
      data.title,
      data.type,
      snapshot.ref.parent.parent?.id!,
      data.isAssetsLoaded
    );
  },
};

export const PLACEHOLDER_URL =
  "https://images.unsplash.com/photo-1508515053963-70c7cc39dfb5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1780&q=80";

/**
 * Get all collections for index page.
 */
export async function getCollections(): Promise<Collection[]> {
  const q = collection(firestore, "collections");
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

export async function getArticleFromId(
  collectionId: string,
  articleId: string
): Promise<Article | undefined> {
  const article = await getArticleByRef(
    doc(firestore, `collections/${collectionId}/articles`, articleId)
  );
  return article;
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
