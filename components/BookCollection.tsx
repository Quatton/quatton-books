import { useRouter } from "next/router";
import React from "react";

type Props = any;

export default function BookCollection({ title }: Props) {
  const { locale } = useRouter();
  return (
    <div className="p-8">
      <div className="text-3xl">{title[locale ? locale : "en"]}</div>
    </div>
  );
}
