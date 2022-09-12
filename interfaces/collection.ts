import { getArticleByRef } from "@/utils/api";
import { DocumentReference } from "firebase/firestore";
import Article from "./article";
import { MultilingualText } from "./text";

export default interface Collection {
  id: string;
  title: MultilingualText;
  featured: DocumentReference[];
  articles?: Article[];
}

export default class Collection {
  constructor(
    id: string,
    title: MultilingualText,
    featured: DocumentReference[]
  ) {
    this.id = id;
    this.title = title;
    this.featured = typeof featured === "undefined" ? [] : featured;
  }

  async getFeaturedArticles() {
    const articles = (
      await Promise.all(
        this.featured.map(async (ref) => await getArticleByRef(ref))
      )
    ).filter((article): article is Article => !!article);

    return articles;
  }

  async saveFeaturedArticles() {
    this.articles = await this.getFeaturedArticles();
    return this.articles;
  }

  data() {
    return {
      id: this.id,
      title: this.title,
      articles: this.articles?.map((article) => article.data()),
    };
  }
}
