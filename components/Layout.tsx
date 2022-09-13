import EventEmitter from "events";
import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import LangSelect from "./LanguageSelector";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="relative h-screen flex flex-col select-none">
      <div className="flex items-center justify-between shadow-md px-6 py-4 z-50 bg-camel">
        <Link href={`/`}>
          <a className="quatton text-amber-900 text-4xl font-semibold =">
            Quatton
          </a>
        </Link>

        <span>
          <LangSelect />
        </span>
      </div>

      <div className="relative w-full h-full overflow-y-auto no-scrollbar bg-amber-50 flex flex-col">
        <div className="px-4 py-2">
          <Breadcrumb />
        </div>
        {children}
      </div>
    </div>
  );
}
