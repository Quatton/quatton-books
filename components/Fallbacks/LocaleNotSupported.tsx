import { LANGUAGES } from "@/constants/multilang";
import { Locale } from "@/interfaces/text";
import { useRouter } from "next/router";
import Layout from "../Layout";

type Props = {
  localeSupported: Locale[];
};

export default function LocaleNotSupported({ localeSupported }: Props) {
  const router = useRouter();
  const { pathname, asPath } = router;
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-full w-full gap-4 text-amber-900">
        <h2 className="text-xl sm:text-2xl text-center border-amber-700 container">
          Okay. I've done the research. Here're your choices.
        </h2>
        <h2 className="text-lg sm:text-xl text-center border-amber-700">
          This page is available in
        </h2>
        <code className="prose">
          {localeSupported.map((locale) => (
            <div
              key={locale}
              onClick={() =>
                router.push(pathname, asPath, { locale, shallow: true })
              }
              className="bg-amber-100 rounded px-2 hover:bg-amber-200 cursor-pointer"
            >
              {LANGUAGES.find((language) => language.id === locale)!.display}
            </div>
          ))}
        </code>
      </div>
    </Layout>
  );
}
