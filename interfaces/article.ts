import { PLACEHOLDER_URL } from "@/constants/placeholder";
import {
  getAssetsById,
  getCollectionById,
  getCoverImageUrl,
} from "@/utils/api";
import { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import Assets from "./assets";
import { MultilingualText } from "./text";

export default interface Article {
  id: string; //articleId
  index: number;
  title: MultilingualText;
  collectionId: string;
  type: string;
  coverImageUrl?: string;
  assets?: Assets;
  isAssetsLoaded?: boolean;
}

export default class Article {
  constructor(
    id: string,
    index: number,
    title: MultilingualText,
    type: string,
    collectionId: string,
    isAssetsLoaded: boolean
  ) {
    this.id = id;
    this.index = index;
    this.title = title;
    this.type = type || "album";
    this.collectionId = collectionId;
    this.isAssetsLoaded = isAssetsLoaded || false;
  }

  async getCollection() {
    return await getCollectionById(this.collectionId);
  }

  async getAssets() {
    const assets = await getAssetsById(
      this.collectionId,
      this.id,
      this.isAssetsLoaded
    );
    return assets;
  }

  async saveAssets() {
    const assets = await this.getAssets();
    this.assets = assets;
    return this;
  }

  async getCoverImageUrl() {
    const cover = await getCoverImageUrl(this.collectionId, this.id);
    return cover;
  }

  async saveCoverImageUrl() {
    const cover = await this.getCoverImageUrl();
    this.coverImageUrl = cover;
    return this;
  }

  data() {
    return {
      id: this.id,
      index: this.index,
      title: this.title,
      type: this.type,
      collectionId: this.collectionId,
      coverImageUrl: this.coverImageUrl || PLACEHOLDER_URL,
      assets: this.assets || null,
    };
  }
}

export const articleConverter = {
  toFirestore: (article: Article) => {
    return {
      id: article.id,
      index: article.index,
      title: article.title,
      type: article.type,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)!;
    return new Article(
      snapshot.id,
      data.index,
      data.title,
      data.type,
      snapshot.ref.parent.parent?.id!,
      data.isAssetsLoaded
    );
  },
};
