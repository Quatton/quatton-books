import { ImageProps } from "next/image";

export interface ImageSource {
  url: string;
  placeholder?: {
    img: ImageProps;
    css: React.CSSProperties;
  };
}

export default interface Assets {
  images: Images;
}

export type Images = {
  [imageId in string | "cover"]: ImageSource;
};
