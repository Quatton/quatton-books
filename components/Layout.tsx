import EventEmitter from "events";
import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import LangSelect from "./LanguageSelector";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="w-full h-screen flex flex-col z-50 select-none">
      <div className="absolute w-full h-32 flex flex-col items-center justify-between bg-camel/20 shadow-md z-50">
        <div className="w-full flex items-center justify-between px-6 py-4">
          <Link href={`/`}>
            <a className="quatton text-amber-900 text-4xl font-semibold">
              Quatton
            </a>
          </Link>
          <span>
            <LangSelect />
          </span>
        </div>
        <div className="w-full px-4 py-2 h-12 flex items-center">
          <Breadcrumb />
        </div>
      </div>
      <div className="w-full h-full overflow-y-auto no-scrollbar bg-amber-50 pt-32 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
