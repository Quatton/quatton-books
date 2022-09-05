import { SettingContext } from "../utils/Settings";
import Link from "next/link";
import React, { useContext } from "react";
import LangSelect from "./LanguageSelector";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="">
      <div className="flex items-center shadow-md px-6 py-4">
        <Link href={`/`}>
          <a className="quatton text-4xl font-semibold">Quatton</a>
        </Link>

        <span className="ml-auto">
          <LangSelect />
        </span>
      </div>

      <div>{children}</div>
    </div>
  );
}
