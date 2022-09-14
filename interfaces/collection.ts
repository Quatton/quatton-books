import { getArticleByRef, getAllArticlesInCollection } from "@/utils/api";
import { DocumentReference } from "firebase/firestore";
import Article from "./article";
import { MultilingualText } from "./text";

export default interface Collection {
  id: string;
  index: number;
  title: MultilingualText;
  featured: DocumentReference[];
  articles?: Article[];
}

export default class Collection {
  constructor(
    id: string,
    index: number,
    title: MultilingualText,
    featured: DocumentReference[]
  ) {
    this.id = id;
    this.index = index;
    this.title = title;
    this.featured = typeof featured === "undefined" ? [] : featured;
  }

  async getFeaturedArticles() {
    const articles = (
      await Promise.all(
        this.featured.map(
          async (ref) => await (await getArticleByRef(ref))?.saveCoverImageUrl()
        )
      )
    ).filter((article): article is Article => !!article);
    return articles;
  }

  async saveFeaturedArticles() {
    this.articles = await this.getFeaturedArticles();
    return this;
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
      title: this.title,
      articles: this.articles?.map((article) => article.data()) || [],
    };
  }
}
