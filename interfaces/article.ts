import { PLACEHOLDER_URL } from "@/constants/placeholder";
import {
  getAssetsById,
  getCollectionById,
  getCoverImageUrl,
} from "@/utils/api";
import Assets from "./assets";
import { MultilingualText } from "./text";

export type ArticleTypeName = "client" | "server";

export default interface Article {
  id: string; //articleId
  title: MultilingualText;
  collectionId: string;
  type: ArticleTypeName;
  isAssetsLoaded: boolean;
  coverImageUrl?: string;
  assets?: Assets;
}

export default class Article {
  constructor(
    id: string,
    title: MultilingualText,
    type: ArticleTypeName,
    collectionId: string,
    isAssetsLoaded: boolean
  ) {
    this.id = id;
    this.title = title;
    this.type = type || "client";
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
      title: this.title,
      type: this.type,
      coverImageUrl: this.coverImageUrl || PLACEHOLDER_URL,
      assets: this.assets || null,
    };
  }
}
