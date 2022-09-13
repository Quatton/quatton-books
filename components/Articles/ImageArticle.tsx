import { Images } from "@/interfaces/assets";
import React, { Dispatch, SetStateAction } from "react";
import BookPage from "../BookPage";
import Image from "next/image";
import { PLACEHOLDER_URL } from "@/constants/placeholder";

type Props = {
  images: Images;
  page: number;
  lastPage: number;
  isDoublePageView: boolean;
  setControlEnabled: Dispatch<SetStateAction<boolean>>;
};

export default function ImageArticle({
  images,
  page,
  lastPage,
  isDoublePageView,
  setControlEnabled,
}: Props) {
  return (
    <>
      {Object.entries(images)
        .filter(([key, _]) => key !== "cover")
        .map(([_, image], pageId) => (
          <BookPage
            key={pageId}
            {...{
              pageId,
              page,
              lastPage,
              isDoublePageView,
              setControlEnabled,
              image,
            }}
          >
            <div
              className="w-full h-full aspect-square top-0 right-0 left-0 bottom-0 scale-150 absolute blur-2xl"
              style={{
                ...(image?.placeholder && image.placeholder.css),
              }}
            ></div>
            <Image
              {...(image?.placeholder
                ? image.placeholder.img
                : {
                    src: image?.url ? image.url : PLACEHOLDER_URL,
                    layout: "fill",
                  })}
            />
          </BookPage>
        ))}
    </>
  );
}
