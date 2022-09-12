export type Locale = "th" | "en" | "ja";
export type MultilingualText = {
  [locale in Locale]: string;
};
