import { getArticleByRef, getAllArticlesInCollection } from "@/utils/api";
import {
  DocumentReference,
  DocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import Article from "./article";
import { MultilingualText } from "./text";

export default interface Collection {
  id: string;
  index: number;
  title: MultilingualText;
  articles?: Article[];
}

export default class Collection {
  constructor(id: string, index: number, title: MultilingualText) {
    this.id = id;
    this.index = index;
    this.title = title;
  }

  async getAllArticles() {
    const articles = await getAllArticlesInCollection(this.id);
    await Promise.all(
      articles.map(async (article) => await article.saveCoverImageUrl())
    );
    return articles;
  }

  async saveAllArticles() {
    this.articles = await this.getAllArticles();
    return this;
  }

  data() {
    return {
      id: this.id,
      index: this.index,
      title: this.title,
      articles: this.articles?.map((item) => item.data()) || [],
    };
  }
}

export const collectionConverter = {
  toFirestore: (collection: Collection) => {
    return {
      id: collection.id,
      index: collection.index,
      title: collection.title,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options)!;
    return new Collection(snapshot.id, data.index, data.title);
  },
};
