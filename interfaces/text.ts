export type Locale = "th" | "en" | "ja";
export const LOCALE: Locale[] = ["th", "en", "ja"];
export type MultilingualText = {
  [locale in Locale]?: string;
};
